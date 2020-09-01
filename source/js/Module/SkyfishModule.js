import SkyfishModuleBrowser from './SkyfishModuleBrowser.js';
import SkyfishModuleDetails from './SkyfishModuleDetails.js';
import { forceDownload, formatBytes } from '../Helper/files.js';
import { reSize } from '../Helper/ratio.js';
import { getMediaID, showDetail } from '../Helper/virtualUrl.js';

const { translation } = skyfishAjaxObject;

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            currentPost: 0,
            postsPerPage: 12,
            currentPage: 0,
            totalPages: 0,
            showDetails: false,
            searchString: '',
            hits: 0,
            direction: props.api.commonArgs.direction,
            order: props.api.commonArgs.order,
            fallbackUrl: props.errorFallback,
        };

        this.fetchPosts = this.fetchPosts.bind(this);
    }

    componentDidMount() {
        const { api } = this.props;
        const { postsPerPage } = this.state;
        const url = new URL(window.location).pathname.split('/');
        const mediaId = url.indexOf('skyfishId') != -1 ? getMediaID() : false;

        if (mediaId) {
            api.getFolder(this.fetchPosts, postsPerPage, 0, mediaId);
            this.getDetailsOnLoad(mediaId);
        } else {
            api.getFolder(this.fetchPosts, postsPerPage, 0);
        }
    }

    fetchPosts(data) {
        if (!data) {
            if (this.state.fallbackUrl !== '') {
                document.getElementById('skyfish-module').innerHTML =
                    translation.ajaxError +
                    '<a href="' +
                    this.state.fallbackUrl +
                    '">' +
                    this.state.fallbackUrl +
                    '</a>';
            } else {
                document.getElementById('skyfish-module').innerHTML = translation.ajaxErrorDefault;
            }
            return false;
        }

        this.setState((state, props) => {
            const posts = data.response.media.map((media, index) => {

                console.log(media); 

                return {
                    id: media.unique_media_id,
                    type: media.media_type,
                    mimeType: media.file_mimetype,
                    fileName: media.filename,
                    title: media.title,
                    thumbnail: media.thumbnail_url_ssl || media.thumbnail_url,
                    index: index,
                    sizes: this.getSizes(
                        media.width,
                        media.height,
                        media.unique_media_id,
                        media.filename
                    ),
                    fileSize: media.file_disksize,
                    width: media.width,
                    height: media.height,
                };
            });

            return {
                posts: posts,
                totalPages: Math.ceil(data.response.hits / state.postsPerPage),
                currentPage:
                    data.media_offset == 0 ? 1 : data.media_offset / state.postsPerPage + 1,
                hits: data.response.hits,
            };
        });
    }

    fetchDetails(data) {
        let { currentPost, posts } = this.state;

        if (typeof posts[currentPost] == 'undefined') {
            return;
        }

        //Remove time from publish date
        if (typeof data.created != 'undefined') {
            let arr = data.created.split(' ');
            data.created = arr[0] || '';
        }

        //Format taken date
        if (data.metadata.iptc != null && typeof data.metadata.iptc.DateCreated != 'undefined') {
            data.metadata.iptc.DateCreated = data.metadata.iptc.DateCreated.replace(/:/g, '-');
        }

        this.setState((state, props) => {
            let { posts, currentPost } = state;
            posts[currentPost].description = data.metadata.description.en || '';
            posts[currentPost].publishDate = data.created || '';

            if (typeof data.metadata.camera_created != 'undefined') {
                posts[currentPost].takenDate =
                    new Date(data.metadata.camera_created * 1000).toLocaleString().split(' ')[0] ||
                    '';
            }

            if (data.metadata.keywords != null) {
                posts[currentPost].keywords = data.metadata.keywords.en || [];
            }

            if (data.metadata.iptc != null) {
                posts[currentPost].photographer = data.metadata.iptc['By-line'] || '';
            }

            return { posts: posts };
        });
    }

    getDetailsOnLoad(mediaId) {
        if (this.state.currentPost != 0) {
            this.setState({
                currentPost: 0,
            });
        }

        this.props.api.requestHook('GET', '/media/' + mediaId, {}, data => {
            this.props.api.requestHook(
                'GET',
                '/search',
                {
                    folder_ids: this.props.api.rootFolder,
                    return_values: ['thumbnail_url_ssl'],
                    thumbnail_size: '800px',
                    unique_media_id: mediaId,
                },
                data => {
                    if (data) {
                        this.setState((state, props) => {
                            let posts = state.posts;
                            let img = new Image();
                            img.src = data.response.media[0].thumbnail_url_ssl;
                            posts[0].thumbnail_large = data.response.media[0].thumbnail_url_ssl;
                            posts[0]._thumbnail_large = img;
                            return {
                                posts: posts,
                            };
                        });
                    }
                }
            );

            document.querySelector('.skyfish-module__goback').classList.add('hidden');

            this.fetchDetails(data);
            this.toggleDetails();
            return;
        });
    }

    preloadOnMouseDown(e) {
        const media = JSON.parse(e.target.getAttribute('data-media-object'));
        const index = parseInt(media.index);
        //Bail if post index does not exists or if image already has been preloaded
        if (
            typeof this.state.posts[index] == 'undefined' ||
            typeof this.state.posts[index].thumbnail_large != 'undefined'
        ) {
            return;
        }

        //Get large image thumbnail for details view
        this.props.api.requestHook(
            'GET',
            '/search',
            {
                folder_ids: this.props.api.rootFolder,
                return_values: ['thumbnail_url_ssl', 'title'],
                thumbnail_size: '800px',
                unique_media_id: media.id,
            },
            data => {
                //Save preloaded image url & dom object
                this.setState((state, props) => {
                    let posts = state.posts;
                    let img = new Image();
                    img.src = data.response.media[0].thumbnail_url_ssl;
                    posts[index].thumbnail_large = data.response.media[0].thumbnail_url_ssl;
                    posts[index]._thumbnail_large = img;

                    return {
                        posts: posts,
                    };
                });
            }
        );
    }

    clickImage(e) {
        e.preventDefault();
        const media = JSON.parse(e.target.getAttribute('data-media-object'));

        //Change current post
        if (this.state.currentPost != media.index) {
            this.setState({
                currentPost: media.index,
            });
        }

        this.props.api.requestHook('GET', '/media/' + media.id, {}, data => {
            //Make sure preload has been initiated
            if (typeof this.state.posts[media.index]._thumbnail_large == 'undefined') {
                return;
            }

            //Show details if preload is done
            if (this.state.posts[media.index]._thumbnail_large.complete) {
                this.fetchDetails(data);
                this.toggleDetails();
                return;
            }

            //Show once preload is done
            this.state.posts[media.index]._thumbnail_large.addEventListener('load', () => {
                this.fetchDetails(data);
                this.toggleDetails();
            });
        });
    }

    toggleDetails(e = false) {
        if (e) {
            e.preventDefault();
        }

        this.setState((state, props) => {
            showDetail(state);
            return {
                showDetails: !state.showDetails ? true : false,
            };
        });
    }

    quickDownload(e) {
        e.preventDefault();
        const media = JSON.parse(e.target.getAttribute('data-media-object'));
        this.props.api.requestHook('GET', '/media/' + media.id + '/download_location', {}, data => {
            forceDownload(data.url);
        });
    }

    updatePosts(offset) {
        const { searchString, postsPerPage } = this.state;
        const { api } = this.props;
        if (typeof searchString != 'undefined' && searchString != '') {
            api.searchInFolder(searchString, this.fetchPosts, postsPerPage, offset);

            return;
        }

        api.getFolder(this.fetchPosts, postsPerPage, offset);
    }

    getSizes(width, height, id, fileName) {
        const avalibleSizes = {
            [translation.large]: 1600,
            [translation.medium]: 1200,
            [translation.small]: 800,
        };

        let sizes = {
            [translation.original]: {
                id: id,
                width: width,
                height: height,
                format: fileName.split('.').pop() || '',
            },
        };

        Object.entries(avalibleSizes).forEach(([sizeName, size]) => {
            let reSized = reSize(width, height, size);

            sizes[sizeName] = {
                id: id,
                width: reSized.width,
                height: reSized.height,
                format: 'jpeg',
            };
        });

        return sizes;
    }

    nextPage() {
        if (this.state.currentPage == this.state.totalPages) {
            return;
        }

        const offset = this.state.currentPage * this.state.postsPerPage;
        this.updatePosts(offset);
    }

    prevPage() {
        if (this.state.currentPage <= 1) {
            return;
        }
        const offset = (this.state.currentPage - 2) * this.state.postsPerPage;
        this.updatePosts(offset);
    }

    paginationInput(e) {
        const value = e.target.value;
        const current = value > 0 && this.state.totalPages >= value ? value : 1;
        const offset = current * this.state.postsPerPage - this.state.postsPerPage;
        this.updatePosts(offset);
    }

    downloadImage(size, id) {
        const avalibleSizes = {
            large: 1600,
            medium: 1200,
            small: 800,
        };

        //Sizes
        if (Object.values(avalibleSizes).includes(size)) {
            this.props.api.requestHook(
                'GET',
                '/media/' + id + '/download_location/' + size + 'px',
                {},
                data => {
                    forceDownload(data.url);
                }
            );
            return;
        }

        //Original size
        this.props.api.requestHook('GET', '/media/' + id + '/download_location', {}, data => {
            forceDownload(data.url);
        });
    }

    changeOrder(order) {
        const { api } = this.props;
        if (api.commonArgs.order == order) {
            return;
        }

        api.commonArgs.order = order;
        this.setState({ order: api.commonArgs.order });
        this.updatePosts(0);
    }

    changeDirection() {
        let { api } = this.props;
        api.commonArgs.direction = api.commonArgs.direction == 'desc' ? 'asc' : 'desc';
        this.setState({ direction: api.commonArgs.direction });
        this.updatePosts(0);
    }

    render(props) {
        const {
            direction,
            posts,
            postsPerPage,
            currentPage,
            currentPost,
            totalPages,
            showDetails,
            searchString,
            hits,
            order,
        } = this.state;

        let detailsData = {};
        if (typeof posts[currentPost] != 'undefined') {
            detailsData = {
                title: posts[currentPost].title || posts[currentPost].fileName || '',
                preview: posts[currentPost].thumbnail_large || '',
                description: posts[currentPost].description || '',
                keywords: posts[currentPost].keywords || '',
                publishDate: posts[currentPost].publishDate || '',
                sizes: posts[currentPost].sizes || '',
                id: posts[currentPost].id || '',
                meta: {
                    [translation.cameraDate]: posts[currentPost].takenDate || '',
                    [translation.publishDate]: posts[currentPost].publishDate || '',
                    [translation.resolution]:
                        posts[currentPost].width + ' x ' + posts[currentPost].height + ' px' || '',
                    [translation.size]: formatBytes(posts[currentPost].fileSize) || '',
                    [translation.photographer]: posts[currentPost].photographer || '',
                    [translation.fileType]: posts[currentPost].mimeType || '',
                    [translation.fileName]: posts[currentPost].fileName || '',
                },
            };
        }

        return (
            <div
                className={
                    this.state.showDetails
                        ? 'skyfish-module u-pt-4 show-details'
                        : 'skyfish-module u-pt-4'
                }
            >
                <div className="skyfish-module__index">
                    <SkyfishModuleBrowser
                        action={{
                            searchInput: e => {
                                this.setState({ searchString: e.target.value });
                            },
                            clickImage: this.clickImage.bind(this),
                            clickDownload: this.quickDownload.bind(this),
                            paginationInput: this.paginationInput.bind(this),
                            submitSearch: e => {
                                e.preventDefault();
                                this.updatePosts(0);
                            },
                            clickNext: this.nextPage.bind(this),
                            clickPrev: this.prevPage.bind(this),
                            hoverImage: this.preloadOnMouseDown.bind(this),
                            changeOrder: this.changeOrder.bind(this),
                            changeDirection: this.changeDirection.bind(this),
                        }}
                        data={{
                            postsPerPage: postsPerPage,
                            totalPages: totalPages,
                            currentPage: currentPage,
                            posts: posts.map((media, index) => {
                                return {
                                    index: media.index,
                                    type: media.type,
                                    title: media.title || media.fileName,
                                    id: media.id,
                                    imageSrc: media.thumbnail, 
                                };
                            }),
                            hits: hits,
                            searchString: searchString,
                            order: order,
                            direction: direction,
                        }}
                    />
                </div>
                <div className="skyfish-module__details">
                    <SkyfishModuleDetails
                        action={{
                            goBack: this.toggleDetails.bind(this),
                            downloadImage: this.downloadImage.bind(this),
                        }}
                        data={detailsData}
                    />
                </div>
            </div>
        );
    }
}
