'use strict';

import queryString from 'query-string';

/**
 * Getting Skyfish Id
 * @return (object) id
 */
const getMediaID = () => {

    let url = new URL(window.location).pathname.split('/');
    if (url.indexOf('skyfishId') != -1) {
        let newUrl = {};
        Object.keys(url).forEach(function (key) {
            if (typeof url[key] != 'undefined' && url[key] != null && url[key] != '') {
                newUrl[key] = url[key];
            }
        });
        return Object.values(newUrl)[Object.values(newUrl).length - 1];
    }
};


/**
 * Changing url address
 * @return void
 */
const changeVirtualUrl = (id = false) => {

    const queryStr = queryString.parse(location.search);
    const mediaId = (queryStr.mediaId) ? queryStr.mediaId : false;
    let uri = window.location.toString();
    let buildQyery = '';
    let amp = '';

    if (uri.indexOf("?") > 0) {
        const clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        buildQyery = '?';
        amp = '&';
    }

    const url = new URL(window.location).pathname.split('/');
    if (Object.keys(queryStr).length > 0 || id || url.indexOf('skyfishId') != 1) {

        for (var key in queryStr) {
            buildQyery += (queryStr[key] != mediaId) ? key + '=' + queryStr[key] + amp : '';
        }

        if (url.indexOf('skyfishId') != 1) {
            buildQyery += (id != false) ? uri + '/skyfishId/' + id + '/' : '';
        }

        buildQyery = (buildQyery.substring(buildQyery.length - 1) == "&") ? buildQyery.substring(0, buildQyery.length - 1) : buildQyery;
        window.history.replaceState({}, document.title, buildQyery);
    }
};


/**
 * Toogle Details dependant on state
 * @return void
 */
const showDetail = (state) => {

    if (state.showDetails === false) {
        const url = new URL(window.location).pathname.split('/');
        const mediaId = (url.indexOf('skyfishId') != 1) ? getMediaID() : '';
        if (!mediaId)
            changeVirtualUrl(state.posts[state.currentPost].id);
    }
    else {
        const path = window.location.pathname.split('/');
        const mediaId = path.pop() || path.pop();
        const newPath = window.location.pathname.replace('/' + mediaId + '/', '');
        window.history.pushState({}, document.title, newPath.replace('/skyfishId', ''));
        changeVirtualUrl();
    }
};

module.exports = {
    showDetail: showDetail,
    getMediaID: getMediaID
};