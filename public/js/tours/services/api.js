'use strict';

(function() {
    module.exports = ['utils.API',
        function(API) {
            var api;

            api = new API([
                {name: 'tours'     , url: '/tours/{id}'     },
                {name: 'panos'     , url: '/panos/{id}'     },
                {name: 'images'    , url: '/images/{id}'    },
                {name: 'floorplans', url: '/floorplans/{id}'},
                {name: 'povlinks'  , url: '/povLinks/{id}'  }
            ]);

            api.config.setPrefix(window.api.pathPrefix);
            api.config.setCache(true);

            return api;
        }
    ];
})();
