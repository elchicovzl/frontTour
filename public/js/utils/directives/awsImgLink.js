(function() {
    'use strict';

    module.exports = ['awsImgLinkConfig',
        function(awsImgConfig) {
            return {
                restrict    : 'A',
                scope       : {
                    id     : '=',
                    onLoad : '='
                },

                link: function($scope, element, attrs) {
                    var hostName,
                        defaultImage;

                    defaultImage = awsImgConfig.defaultImage;

                    element = element[0];

                    if(element.tagName !== 'IMG') {
                        console.log('Directive awsImgLink need to be used in an img tag');
                        return;
                    }

                    if(typeof $scope.onLoad === 'function') element.onLoad($scope.onLoad);

                    element.onerror(function() {
                        attrs.$set('src', defaultImage);
                    });

                    hostName = awsImgConfig.getHostName();

                    attrs.$set('src',hostName + '/' + $scope.id);
                }

            }
        }
    ]
})();