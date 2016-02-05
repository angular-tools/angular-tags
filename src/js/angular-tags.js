(function () {
    angular.module('angularTags', ['session'])
        .service('$replacetags', ['$session', function ($session) {
            var serviceInstance = {};

            serviceInstance.replaceTags = function (text, replacements) {
                var replace = function (tag, hash) {
                    var parts = (tag || '').split('|');
                    return (hash[parts[0]] || parts[1]) || '';
                };

                var obj = typeof($session) !== 'undefined' ? angular.extend({}, $session.site, $session.user, $session.request, replacements) : replacements || {};
                var html = (text || '')
                    .replace(/%([\w\-\|]+)%/g, function (all, key) { return replace(key, replacements);})
                    .replace(/%(\w+)\.([\w\-\|]+)%/g, function (all, key1, key2) {return replace(key2, replacements[key1]);});


                return html;
            };

            return serviceInstance;
        }])
        .filter('replacetags', ['$replacetags', function ($replacetags) {
            return function (text, replacements) {
                return $replacetags.replaceTags(text, replacements);
            }
        }]);
})();