'use strict';

import SearchForm from './SkyfishModuleSearchForm.js';
import Pagination from './SkyfishModulePagination.js';
import Media from './SkyfishModuleMedia.js';
import {Dropdown} from 'hbg-react';

const {translation} = skyfishAjaxObject;

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
                let Message = () => (<span>{translation.xResults.replace('%s', hits).replace('%s', currentPage).replace('%s', totalPages)}</span>);
            return (
                <Message />
            );
        }

        const DirectionController = (props) => {
            const {direction, onClickAction} = props;
            return (
                <button
                    className={"link u-border-0 u-font-inherit pricon pricon-sort-" + (direction == 'desc' ? 'asc' : 'desc')}
                    onClick={onClickAction}>
                    {(direction == 'desc' ? translation.descending : translation.ascending)}
                </button>
            );
        }

        const OrderController = (props) => {
            const {onClickAction, currentOrder} = props;

            let orderTypes = {
                'created': translation.publishDate,
                'camera_created': translation.cameraDate,
                'relevance': translation.relevance,
            };

            let orderOptions = [];

            Object.entries(orderTypes).forEach(([id, label]) => {
                if (currentOrder == id) {
                    return;
                }

                let orderType = {
                    id: id,
                    title: label,
                    onClickAction: onClickAction,
                    'classes': 'link'
                };

                orderOptions.push(orderType);
            });

            return (
                <Dropdown
                    title={orderTypes[currentOrder]}
                    list={orderOptions}
                    toggleClass="link u-border-0 u-font-inherit pricon pricon-sort"

                />
            );
        }

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
                <div className="grid sm-gutter">
                    <div className="grid-xs-auto u-mb-2">
                        <Breadcrumb
                            hits={data.hits}
                            postsPerPage={data.postsPerPage}
                            currentPage={data.currentPage}
                            totalPages={data.totalPages}
                            searchString={data.searchString}
                        />
                    </div>
                    <div className="grid-xs-12 grid-sm-fit-content u-mb-3">
                        <div className="grid sm-gutter">
                            <div className="grid-fit-content">
                                {/* OrderController component breaks with react 16.6.0 */}
                                <OrderController
                                    onClickAction={action.changeOrder}
                                    currentOrder={data.order}
                                />
                            </div>
                            <div className="grid-fit-content">
                                 <DirectionController
                                    direction={data.direction}
                                    onClickAction={action.changeDirection}
                                />
                            </div>
                        </div>


                    </div>
                </div>

                <div className="grid sm-gutter  grid--columns">
                    {items}
                </div>

                <div className="grid sm-gutter">
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


