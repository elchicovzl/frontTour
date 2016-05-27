(function() {
    "use strict";

    module.exports = ['$modal','$rootScope',
        function ($modal, $rootScope) {
            
            return function(options)
            {
                var properties;

                if(options.scope && !options.scope.$root)
                {
                    properties      = options.scope;
                    options.scope   = $rootScope.$new(true);

                    angular.extend(options.scope, properties);
                }

                return  {
                    open : function(data, isCopy) {
                        options.scope    = $rootScope.$new(true);
                        options.backdrop = 'static';

                        if (data)
                        {
                            if(isCopy) {
                                data = angular.copy(data);
                            }

                            angular.extend(options.scope, properties, data);
                        }
                        else {
                            angular.extend(options.scope, properties);
                        }

                        return $modal.open(options);
                    }
                }
            };
        }
    ];
})();