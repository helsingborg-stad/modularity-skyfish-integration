'use strict';

const $ = jQuery.noConflict();

module.exports = class {
    constructor(settings)
    {
        const {authToken, baseUrl, rootFolder, orderBy, orderDirection, searchMode} = settings;

        if (typeof(authToken) == 'undefined' || !authToken) {
            return;
        }

        this.authToken = authToken;
        this.baseUrl = baseUrl;

        this.commonReturnValues = [
            'filename',
            'width',
            'height',
            'media_type',
            'file_mimetype',
            'file_disksize',
            'byline',
            'camera_created',
            'created',
            'unique_media_id',
            'thumbnail_url_ssl'
        ];

        this.commonArgs = {
            return_values: this.commonReturnValues,
            folder_ids: rootFolder,
            direction: orderDirection || 'desc',
            order: orderBy || 'created'
        };

        //Add query type if defined as anything but default
        if (typeof(searchMode) != 'undefined' && searchMode != 'default') {
            this.commonArgs.query_type = searchMode;
        }
    }

    requestHook(type, path, data = {}, successCallback)
    {
        $.ajax({
            url : this.baseUrl + path,
            type : type,
            headers: {
                'Authorization' : 'CBX-SIMPLE-TOKEN Token=' + this.authToken
            },
            data : data,
            success : function(response, status) {
                successCallback(response)
            },
            error : function(jqXHR, status, error) {
            }
        });
    }

    getRootFolderId()
    {
        var root = '';

        this.listFolders().forEach(folder => {
            if (typeof(folder.name) != 'undefined'
                && folder.name == 'Public'
                && typeof(folder.id) != 'undefined') {
                root = folder.id;
            }
        });

        return root;
    }

    listFolders()
    {
        return this.request('get', '/folder', {});
    }

    searchInFolder(searchString, successCallback, mediaCount, mediaOffset)
    {
        let args = this.commonArgs;
        args.media_count = mediaCount;
        args.media_offset = mediaOffset;
        args.q = searchString;
        this.requestHook('get', '/search', args, successCallback);
    }

    getFolder(successCallback, mediaCount, mediaOffset)
    {
        var args = this.commonArgs;
        args.media_count = mediaCount;
        args.media_offset = mediaOffset;
        delete args.q;

        this.requestHook('get', '/search', args, successCallback);
    }

    request(type, path, data = {})
    {
        var result;

        $.ajax({
            async : false,
            url : this.baseUrl + path,
            type : type,
            headers: {
                'Authorization' : 'CBX-SIMPLE-TOKEN Token=' + this.authToken
            },
            data : data,
            success : function(response, status) {
                result = response;
            }.bind(this),
            error : function(jqXHR, status, error) {
                result = jqXHR;
            }
        });

        return result;
    }
}
