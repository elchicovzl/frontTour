(function() {
    module.exports = ['utils.helpers',
        function(helpers) {
            return function(str, option) {
                var formattedStr;

                if(option === 'all') {
                    formattedStr = helpers.words(str);
                    formattedStr = formattedStr.map(function(word) {
                        return helpers.capitalize(word);
                    });
                    formattedStr = formattedStr.join(' ');

                } else {
                    formattedStr = helpers.capitalize(str);
                }

                return formattedStr;
            }
    }];
})();