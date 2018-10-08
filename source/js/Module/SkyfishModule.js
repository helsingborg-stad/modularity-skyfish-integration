'use strict';

import SkyfishModuleBrowser from './SkyfishModuleBrowser.js';
import SkyfishModuleDetails from './SkyfishModuleMediaDetails.js';
import {forceDownload, formatBytes} from '../Helper/files.js';
import {reSize} from '../Helper/ratio.js';

module.exports = class extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            posts: [],
            currentPost: 0,
            postsPerPage: 12,
            currentPage:  0,
            totalPages: 0,
            showDetails: false,
            searchString: ''
        }

        this.fetchPosts = this.fetchPosts.bind(this);
    }

    componentDidMount()
    {
        this.props.api.getFolder(this.fetchPosts, this.state.postsPerPage, 0);
    }

    getSizes(width, height, id, fileName)
    {
        const avalibleSizes = {
            large: 1600,
            medium: 1200,
            small: 800
        };

        let sizes = {
            original: {
                id: id,
                width: width,
                height: height,
                format: fileName.split('.').pop() || ''
            }
        }

        Object.entries(avalibleSizes).forEach(([sizeName, size]) => {
            let reSized = reSize(width, height, size);

            sizes[sizeName] = {
                id: id,
                width: reSized.width,
                height: reSized.height,
                format: 'jpeg'
            };
        });

        return sizes;
    }

    fetchPosts(result)
    {
        this.setState((state, props) => {
            const posts = result.response.media.map((media, index) => {
                return {
                    id: media.unique_media_id,
                    type: media.media_type,
                    mimeType: media.file_mimetype,
                    fileName: media.filename,
                    thumbnail: media.thumbnail_url_ssl || media.thumbnail_url,
                    index: index,
                    sizes: this.getSizes(media.width, media.height, media.unique_media_id, media.filename),
                    fileSize: media.file_disksize,
                    width: media.width,
                    height: media.height
                };
            });

            return {
                posts: posts,
                totalPages: Math.ceil(result.response.hits / state.postsPerPage),
                currentPage: (result.media_offset == 0 ? 1 : (result.media_offset / state.postsPerPage) + 1)
            };
        });
    }

    fetchDetails(results)
    {
        let index = this.state.currentPost;

        if (typeof(this.state.posts[index]) == 'undefined') {
            return;
        }

        this.setState((state, props) => {
                let posts = state.posts;
                posts[index].description = results.metadata.description.en || '';
                posts[index].publishDate = results.created || '';
                posts[index].takenDate = results.metadata.iptc.DateCreated || '';
                posts[index].keywords = results.metadata.iptc.Keywords || '';
                posts[index].photographer = results.metadata.iptc['By-line'] || '';
            return {posts: posts};
        });
    }

    preloadOnMouseDown(e)
    {
        const media = JSON.parse(e.target.getAttribute('data-media-object'));
        const index = parseInt(media.index);

        //Bail if post index does not exists or if image already has been preloaded
        if (typeof(this.state.posts[index]) == 'undefined' || typeof(this.state.posts[index].thumbnail_large) != 'undefined') {
            return;
        }

        //Get large image thumbnail for details view
        this.props.api.requestHook('GET', '/search', {
            folder_ids: this.props.api.rootFolder,
            return_values: ['thumbnail_url_ssl'],
            thumbnail_size: '800px',
            unique_media_id: media.id
        }, (results) => {
            //Save preloaded image url & dom object
            this.setState((state, props) => {
                let posts = state.posts;
                let img = new Image();
                img.src = results.response.media[0].thumbnail_url_ssl;

                posts[index].thumbnail_large = results.response.media[0].thumbnail_url_ssl;
                posts[index]._thumbnail_large = img;

                return {
                    posts: posts
                };
            });
        });
    }

    clickImage(e)
    {
        e.preventDefault();
        const media = JSON.parse(e.target.getAttribute('data-media-object'));

        //Change current post
        if (this.state.currentPost != media.index) {
            this.setState({
                currentPost: media.index
            });
        }

        this.props.api.requestHook('GET', '/media/' + media.id, {}, (results) => {
            //Make sure preload has been initiated
            if (typeof(this.state.posts[media.index]._thumbnail_large) == 'undefined') {
                return;
            }

            //Show details if preload is done
            if (this.state.posts[media.index]._thumbnail_large.complete) {
                this.fetchDetails(results);
                this.toggleDetails();
                return;
            }

            //Show once preload is done
            this.state.posts[media.index]._thumbnail_large.addEventListener('load', () => {
                this.fetchDetails(results);
                this.toggleDetails();
            });
        });
    }

    toggleDetails(e = false)
    {
        if (e) {
            e.preventDefault()
        };

        this.setState((state, props) => {
            return {
                showDetails: (!state.showDetails ? true : false),
            }
        });
    }

    clickDownload(e)
    {
        e.preventDefault();
        const media = JSON.parse(e.target.getAttribute('data-media-object'));
        this.props.api.requestHook('GET', '/media/' + media.unique_media_id + '/download_location', {}, (results) => {forceDownload(results.url)});
    }

    updatePosts(offset)
    {
        if (this.state.searchString.length != 0) {
            this.props.api.searchInFolder(this.state.searchString, this.fetchPosts, this.state.postsPerPage, offset);

            return;
        }

        this.props.api.getFolder(this.fetchPosts, this.state.postsPerPage, offset);
    }

    nextPage()
    {
        if (this.state.currentPage == this.state.totalPages) {
            return;
        }

        const offset = this.state.currentPage * this.state.postsPerPage;
        this.updatePosts(offset);
    }

    prevPage()
    {
        if (this.state.currentPage <= 1) {
            return;
        }
        const offset = (this.state.currentPage - 2) * this.state.postsPerPage;
        this.updatePosts(offset);
    }

    paginationInput(e)
    {
        const value = e.target.value;
        const current = (value > 0 && this.state.totalPages >= value ? value : 1);
        const offset = (current * this.state.postsPerPage) - this.state.postsPerPage;
        this.updatePosts(offset);
    }

    downloadImage(size, id)
    {
        const avalibleSizes = {
            large: 1600,
            medium: 1200,
            small: 800
        };

        //Sizes
        if (Object.values(avalibleSizes).includes(size)) {
            this.props.api.requestHook('GET', '/media/' + id + '/download_location/' + size + 'px', {}, (results) => {forceDownload(results.url)});
            return;
        }

        //Original size
        this.props.api.requestHook('GET', '/media/' + id + '/download_location', {}, (results) => {forceDownload(results.url)});
    }

    render(props)
    {
        const skyfishModuleIndex = {
            action: {
                searchInput: (e) => {this.setState({searchString: e.target.value});},
                clickImage: this.clickImage.bind(this),
                clickDownload:  this.clickDownload.bind(this),
                paginationInput: this.paginationInput.bind(this),
                submitSearch: (e) => {e.preventDefault(); this.updatePosts(0);},
                clickNext: this.nextPage.bind(this),
                clickPrev: this.prevPage.bind(this),
                hoverImage: this.preloadOnMouseDown.bind(this)
            },
            data: {
                postsPerPage: this.state.postsPerPage,
                totalPages: this.state.totalPages,
                currentPage: this.state.currentPage,
                posts: this.state.posts.map((media, index) => {
                    return {
                        index: media.index,
                        type: media.type,
                        title: media.fileName,
                        id: media.id,
                        imageSrc: media.thumbnail
                    };
                })
            }
        };

        const detailsActions = {
            goBack: this.toggleDetails.bind(this),
            downloadImage: this.downloadImage.bind(this)
        };

        const currentPost = this.state.posts[this.state.currentPost];
        let detailsData =  {};
        if (typeof(currentPost) != 'undefined') {
            detailsData =  {
                title: currentPost.fileName || '',
                preview: currentPost.thumbnail_large || '',
                description: currentPost.description || '',
                keywords: currentPost.keywords || '',
                publishDate: currentPost.publishDate || '',
                sizes: currentPost.sizes || '',
                id: currentPost.id || '',
                meta: {
                    'Taken': String(currentPost.takenDate).replace('/:/gm', '-') || '',
                    'Uploaded': currentPost.publishDate || '',
                    'Resolution': currentPost.width + ' x ' + currentPost.height + ' px' || '',
                    'Size':  formatBytes(currentPost.fileSize) || '',
                    'Photographer': currentPost.photographer || '',
                    'Mime Type': currentPost.mimeType || ''
                }
            };
        }

        return (
            <div className={this.state.showDetails ? 'skyfish-module show-details' : 'skyfish-module'}>
                <div className="skyfish-module__index">
                    <SkyfishModuleBrowser
                        action={skyfishModuleIndex.action}
                        data={skyfishModuleIndex.data} />
                </div>
                <div className="skyfish-module__details">
                    <SkyfishModuleDetails
                        action={detailsActions}
                        data={detailsData} />
                </div>
            </div>

        );
    }
}
