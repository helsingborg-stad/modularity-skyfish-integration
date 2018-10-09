'use strict';

import SearchForm from './SkyfishModuleSearchForm.js';
import Pagination from './SkyfishModulePagination.js';
import Media from './SkyfishModuleMedia.js';

module.exports = class extends React.Component {
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const {data, action} = this.props;

        const items = data.posts.map((media, index) => (
            <Media
                key={media.id}
                clickImage={action.clickImage}
                clickDownload={action.clickDownload}
                hoverImage={action.hoverImage}
                object={media}
                source={media.imageSrc}
            />
        ));

        // const SearchBar = this.SearchBar;
        const Breadcrumb = (props) => {
            const {hits, postsPerPage, currentPage, totalPages, searchString} = props;
                let Message = () => (<span>Found {hits} items, displaying page {currentPage} of {totalPages}.</span>);

                // if (searchString != '') {
                //     Message = () => (<span><b>{hits}</b> hits when searching for "{searchString}", displaying page {currentPage} of {totalPages}.</span>);
                // }
            return (
                <Message />
            );
        }


        const SortBy = (props) => <span>SortBy</span>;

        return (
            <div>
                <div className="grid u-mb-3">
                    <div className="grid-xs-12 grid-md-auto u-mb-2 u-mb-0@md u-mb-0@lg u-mb-0@xl">
                        <SearchForm
                            searchMethod={action.searchInput}
                            submitSearchMethod={action.submitSearch}
                        />
                    </div>
                    <div className="grid-xs-12 grid-md-fit-content">
                        <Pagination
                            current={data.currentPage}
                            total={data.totalPages}
                            next={action.clickNext}
                            prev={action.clickPrev}
                            input={action.paginationInput}
                        />
                    </div>
                </div>
                <div className="grid u-mb-3">
                    <div className="grid-xs-auto">
                        <Breadcrumb
                            hits={data.hits}
                            postsPerPage={data.postsPerPage}
                            currentPage={data.currentPage}
                            totalPages={data.totalPages}
                            searchString={data.searchString}
                        />
                    </div>
                    <div className="grid-fit-content">

                    </div>
                </div>

                <div className="grid grid--columns">
                    {items}
                </div>

                <div className="grid">
                    <div className="grid-fit-content u-ml-auto">
                        <Pagination
                            current={data.currentPage}
                            total={data.totalPages}
                            next={action.clickNext}
                            prev={action.clickPrev}
                            input={action.paginationInput}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


