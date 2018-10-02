'use strict';

const SearchForm = require('./SkyfishModuleSearchForm.jsx');
const PaginationComponent = require('./SkyfishModulePagination.jsx');
const Media = require('./SkyfishModuleMedia.jsx');

module.exports = class extends React.Component {
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const Pagination = (props) => (
            <PaginationComponent
                current={this.props.data.currentPage}
                total={this.props.data.totalPages}
                next={this.props.action.clickNext}
                prev={this.props.action.clickPrev}
                input={this.props.action.paginationInput}
            />
        );

        const items = this.props.data.posts.map((media, index) => (
            <Media
                key={media.id}
                clickImage={this.props.action.clickImage}
                clickDownload={this.props.action.clickDownload}
                hoverImage={this.props.action.hoverImage}
                object={media}
                source={media.imageSrc}
            />
        ));

        // const SearchBar = this.SearchBar;
        const Breadcrumb = (props) => <span>Breadcrumb</span>;
        const SortBy = (props) => <span>SortBy</span>;

        return (
            <div>
                <div className="grid">
                    <div className="grid-xs-auto">
                        <SearchForm searchMethod={this.props.action.searchInput} submitSearchMethod={this.props.action.submitSearch} />
                    </div>
                    <div className="grid-fit-content">
                        <Pagination />
                    </div>
                </div>
                <div className="grid">
                    <div className="grid-xs-auto">
                        <Breadcrumb />
                    </div>
                    <div className="grid-fit-content">
                        <SortBy />
                    </div>
                </div>

                <div className="grid grid--columns">
                    {items}
                </div>

                <div className="grid">
                    <div className="grid-fit-content u-ml-auto">
                        <Pagination />
                    </div>
                </div>
            </div>
        );
    }
}


