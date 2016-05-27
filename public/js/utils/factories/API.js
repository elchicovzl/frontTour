(function() {
    'use strict';

    var API;

    API = ['$http', function($http) {
        var APIConfig;

        /**
         * @description APIConfig class. Configuration instance that allows to change properties of an endpoint
         *
         * @param {object}  options         - Options for the instance
         * @param {object}  options.actions - Object that maps an alias to a verb in a http request. save : 'POST'
         * @param {boolean} options.isCache - Boolean that determines if you want to cache the response.
         * @param {string}  options.name    - Name of the endpoint
         * @param {string}  options.url     - Url of the endpoint you want to hit. It can have parameters like
         *                                    /user/{userId}
         * @param {string}  options.prefix  - url prefix. This will be use as a prefix in each endpoint's url.
         *
         * @constructor
         * @class
         */
        APIConfig = function (options) {
            options = options || {};

            this.actions = options.actions;
            this.isCache = options.isCache;
            this.name    = options.name;
            this.url     = options.url;
            this.prefix  = options.prefix;

            this._cache  = {}
        };

        /***************************************************************************************************************
         *                                         PUBLIC
         **************************************************************************************************************/

        /**
         * @description Flush cache for the APIConfig instance
         */
        APIConfig.prototype.flushCache = function() {
            this._cache = {};

            return this;
        };

        /**
         * @description Sets a flag if you want to cache a specific endpoint
         * @param {boolean} isCache - Boolean that sets if you want to cache the request
         */
        APIConfig.prototype.setCache = function (isCache) {
            this.isCache = isCache === true;

            return this;
        };

        /**
         * @description Method that sets the headers for a specific endpoint
         * @param {object} headers - Object containing the name of value of http request headers
         */
        APIConfig.prototype.setHeaders = function (headers) {
            this.headers = headers;

            return this;
        };

        /**
         * @description Sets the url for a specific endpoint.
         * @param {string} url - String containing the url. It can contain url parameters. /user/{userId} or
         *                       /user/:userId
         */
        APIConfig.prototype.setUrl = function (url) {
            this.url = url;

            return this;
        };

        /**
         * @description Set an url prefix for an endpoint
         * @param {string} prefix - String containing an url prefix
         */
        APIConfig.prototype.setPrefix = function (prefix) {
            this.prefix = prefix;

            return this;
        };

        /**
         * @description Caches a specific request using its promise
         * @param {string} method   - HTTP method
         * @param {string} url      - Request url
         * @param {promise} promise - Return promise of the request
         * @returns {promise}
         */
        APIConfig.prototype.setPromiseCache = function (method, url, promise) {

            //If its a safe http method, cache the promise, if not, flush it
            if(APIConfig._isSafeMethod(method)) {
                this._cache[APIConfig._createCacheIndex(method, url)] = promise;
                promise = this.getPromiseCache(method, url);
            } else {
                this.flushCache();
            }

            return promise;
        };

        /**
         * @description Gets the cache promise of a request
         * @param {string} method   - HTTP method
         * @param {string} url      - Request url
         * @returns {promise || undefined}
         */
        APIConfig.prototype.getPromiseCache = function (method, url) {
            var promise;

            promise =  this._cache[APIConfig._createCacheIndex(method, url)];

            promise = promise && promise.then(function(response) {
                return API._clone(response);
            });

            return promise;
        };

        /***************************************************************************************************************
         *                                         PRIVATE
         **************************************************************************************************************/

        APIConfig._createCacheIndex = function (method, url) {
            return method + ' ' + url;
        };

        APIConfig._isSafeMethod = function(method) {
            return APIConfig._isSafeMethod.SAFE_METHODS.indexOf(method) !== -1;
        };

        APIConfig._isSafeMethod.SAFE_METHODS = ['OPTIONS', 'GET', 'HEAD'];

        //------------------------------------------------------------------------------------------------------------------

        var API;

        /**
         * @description API Class. Each instance of a class allows you to have different endpoints and manage them
         * globally or independently. Each endpoint created will be accessible as a property in the instance. Each
         * one will have a APIConfig instance that will allow to set specific properties on that current endpoint.
         * The API instance will have a main configuration which will be use in the case that the endpoint's config is
         * missing.
         *
         * @param {object}    options           - Options for configuring an instance of the class
         * @param {array}     options.endpoints - Array of endpoints
         * @param {APIConfig} options.config    - Global APIConfig instance
         * @param {array}     options           - Array of endpoints
         *
         * @constructor
         */
        API = function(options) {

            if(Array.isArray(options)) {
                this.addEndpoint(options);

                //check for config property
            } else if(options.config) {
                this.config = new APIConfig(options.config);
                options.endPoints && this.addEndpoint(options.endPoints);
            }

        };

        /**************************************************************************************************************
         *                                         PUBLIC
         **************************************************************************************************************/

        /**
         * @description Adds a new endpoint to the API instance.
         *
         * @param {object} endPointOpts           - It should be an object containing params for the instance
         * @param {object} endPointOpts.config    - It should be an object containing config params for the global
         *                                          APIConfig instance.
         * @param {array}  endPointOpts.endpoints - It should be an array of endpoints
         * @param {object} endPointOpts           - It should be an array of endpoints
         *
         */
        API.prototype.addEndpoint = function(endPointOpts) {
            var _this;

            _this = this;

            if(Array.isArray(endPointOpts)) {
                endPointOpts.forEach(function(endPointOpt) {
                    _this._addEndpoint(endPointOpt);
                });

                //check if its and object
            } else if(typeof endPointOpts === 'object') {
                _this._addEndpoint(endPointOpts);

                //throw an error
            } else {
                throw new Error('Invalid endpoints')
            }

            return this;
        };

        /**
         * TODO
         * @description Aborts a specific ongoing request
         * @param {promise} promise - Promise returned by the specific request
         *
         * @return {boolean}
         */
        API.prototype.abort = function(promise) {
            return API._request.abort(promise._requestId);
        };

        /**
         * @description Deletes any cache request for all endPoints
         */
        API.prototype.flushCache = function() {
            var endPointName;

            for (endPointName in this) {
                if (this.hasOwnProperty(endPointName)) this[endPointName].config.flushCache();
            }

            return this;
        };

        /**
         * TODO
         * Make a request overriding config parameters
         * @param requestObject
         * @returns {*}
         */
        API.prototype.makeRequest = function(requestObject) {
            return API._request(requestObject);
        };

        /**************************************************************************************************************
         *                                         DEFAULTS
         **************************************************************************************************************/

        API.prototype.config = new APIConfig({
            isCache: false,
            prefix: '',

            headers : {
                'Content-Type'     : 'application/json',
                'X-Requested-With' : 'XMLHttpRequest'
            },

            actions : {
                'get'            : 'GET',
                'create'         : 'POST',
                'update'         : 'PUT',
                'partialUpdate'  : 'PATCH',
                'remove'         : 'DELETE'
            }
        });

        /**************************************************************************************************************
         *                                         PRIVATE
         **************************************************************************************************************/

        /*
         * @description Removes or replaces any url parameter with the following format:
         * {userId: 'IE-32332' } ----> {}
         * url: /user/{userId}   ----> /user/IE-32332
         * url: /user/:userId    ----> /user/IE-32332
         *
         * @param {String} url - url to make the request to. It can have parameters like user/{userId}
         * @param {object} params - object that will contain properties to replace the url parameters
         * @private
         */
        API._replaceParamUrl = function(url, params) {
            var matches;

            matches = url.match(API._replaceParamUrl.paramRegex);

            if(matches === null) return url;

            matches.forEach(function(match) {

                match = match.replace(/({|}|:)/g, '');

                //remove string param if property is not defined
                if(params === undefined || params[match] === undefined) {
                    url = url
                        .replace('/{' + match + '}', '')
                        .replace('/:' + match, '');

                    //replace param {param} or :param with value and removes property from object
                } else {
                    url = url
                        .replace('{' + match + '}', params[match])
                        .replace(':' + match, params[match]);

                    delete params[match];
                }
            });

            return url;
        };

        API._replaceParamUrl.paramRegex = /(\{[a-zA-Z]+\}|:[a-zA-Z]+)/g;

        /**
         * @description Clone object, that has no clycle
         * @see {@link http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object}
         *      for further information.
         * @private
         */
        API._clone = function(obj) {
            return obj && JSON.parse(JSON.stringify(obj))
        };

        /**
         * @description
         * @param defaults
         * @param transform
         * @returns {Array|string}
         * @see https://docs.angularjs.org/api/ng/service/$http
         * @private
         */
        API._appendTransformation = function(defaults, transform) {
            // We can't guarantee that the default transformation is an array
            defaults = Array.isArray(defaults) ? defaults : [defaults];

            // Append the new transformation to the defaults
            return defaults.concat(transform);
        };

        /**
         *
         * @param apiConfig
         * @param method
         * @param urlParams
         * @param data
         * @returns {{method: *, url: string, headers: (*|API.config.headers), data: *}}
         * @private
         */
        API._createRequestObject = function(apiConfig, method, urlParams, data) {
            var url,
                prefixUrl,
                queryString,
                requestObject;

            urlParams = API._clone(urlParams);

            prefixUrl = apiConfig.prefix || this.config.prefix;


            url = API._replaceParamUrl(apiConfig.url, urlParams);

            queryString = API._object2Query(urlParams);
            queryString = queryString && '?' + queryString;

            //build the full url
            url = prefixUrl + url + queryString;

            requestObject = {
                method  : method,
                url     : url,
                headers : apiConfig.headers || this.config.headers,
                data    : data
            };

            API._setTransformationRequests.apply(requestObject, arguments);

            return requestObject;
        };

        API._setTransformationRequests = function(apiConfig, method, urlParams, data) {

            //check for second parameter in get requests to attach transformation request
            if(method === 'GET') {
                if (typeof arguments[3] === 'function') {
                    this.transformResponse = API._appendTransformation(API._request.defaults.transformResponse, arguments[3]);
                }

                if (typeof arguments[4] === 'function') {
                    this.transformRequest = API._appendTransformation(API._request.defaults.transformRequest, arguments[4]);
                }

            } else if(method === 'POST') {
                if (typeof arguments[4] === 'function') {
                    this.transformResponse = API._appendTransformation(API._request.defaults.transformResponse, arguments[4]);
                }

                if (typeof arguments[5] === 'function') {
                    this.transformRequest = API._appendTransformation(API._request.defaults.transformRequest, arguments[5]);
                }
            }
        };

        /**
         * @description Function that has been use bind upon. It binds the apiConfig and the method to the function.
         *              It gets call through the aliases
         *
         * @param apiConfig
         * @param method
         * @param urlParams
         * @param data
         * @returns {promise}
         * @private
         */
        API._makeRequest = function(apiConfig, method, urlParams, data) {
            var promise,
                isCache,
                requestObject;

            requestObject = API._createRequestObject.apply(this, arguments);

            //check if you want to cache the request
            isCache = apiConfig.isCache === undefined ? this.config.isCache : apiConfig.isCache;

            promise = isCache ? apiConfig.getPromiseCache(method, requestObject.url) : undefined;

            if(promise === undefined) {

                //make the request
                promise = API._request(requestObject);

                //stores the request in the private cache if isCache
                if(isCache === true) {
                    promise = apiConfig.setPromiseCache(method, requestObject.url, promise);
                }
            }

            return promise;
        };

        /**
         * Turns a single level object into a url query string
         * @param {object} object - Single level object
         * @returns {string} - Query string
         * @private
         */
        API._object2Query = function(object) {
            var name,
                value,
                queries;

            queries = [];

            for(name in object) {
                value = object[name];

                //Check for a valid property
                if(!object.hasOwnProperty(name) || undefined === value || null === value || '' === value) continue;

                if(Array.isArray(value)) {

                    //create query for array like name[]=value1&name[]=value2
                    value.forEach(function(item) {
                        queries.push(name + '[]=' + item);
                    });

                } else {
                    queries.push(name + '=' + object[name]);
                }
            }

            return queries.length === 0 ? '' : queries.join('&');
        };

        API.prototype._addEndpoint = function(endPoint) {

            var actionAlias,
                actions;

            if(endPoint.name === undefined || endPoint.url === undefined) {
                throw new Error('The endpoint object should have "name" and a "url" property');
            }

            endPoint = this[endPoint.name] = {
                config: new APIConfig(endPoint)
            };

            actions = endPoint.config.actions || this.config.actions;

            for (actionAlias in actions) {
                var method;

                method = actions[actionAlias];

                endPoint[actionAlias] = API._makeRequest.bind(this, endPoint.config, method);
            }
        };

        API._request = $http;

        return API
    }];

    module.exports = API;
})();