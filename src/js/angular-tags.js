(function () {
    angular.module('angularTags', ['session'])
        .service('$replacetags', ['$session', function ($session) {
            var serviceInstance = {};

            serviceInstance.replaceTags = function (text, replacements) {
                var obj = typeof($session) !== 'undefined' ? angular.extend({}, $session.site, $session.user, $session.request, replacements) : replacements || {};
                var html = text.replace(/\%(.+?)\%/g, function (match, contents, offset, s) {
                    return obj.hasOwnProperty(contents) ? obj[contents] : '';
                });

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