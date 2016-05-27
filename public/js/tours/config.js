(function() {
    'use strict';

    module.exports = ['awsImgLinkConfigProvider',
        function(awsImgLinkConfigProvider) {
            awsImgLinkConfigProvider.setHostName(window.awsBucket);
        }
    ]
})();