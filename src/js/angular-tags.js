(function () {
    angular.module('angularTags', ['session'])
        .service('$replacetags', ['$session', function ($session) {
            var serviceInstance = {};

            serviceInstance.replaceTags = function (text, hash) {
                var replacements = {};

                function flatten(json, flattened, str_key) {
                    for (var key in json) {
                        if (json.hasOwnProperty(key)) {
                            if (json[key] instanceof Date) {
                                flattened[str_key + (str_key ? "." : '') + key] = json[key] + '';
                            } else if (json[key] instanceof Object && json[key] != "") {
                                flatten(json[key], flattened, str_key + (str_key ? "." : '') + key);
                            } else {
                                flattened[str_key + (str_key ? "." : '') + key] = json[key] + '';
                            }
                        }
                    }
                }

                flatten(angular.extend({}, hash, {session: $session}), replacements, "");

                return (text || '').replace(/%([^%]+)%/g, function (all, tag) {
                    var parts = (tag || '').split('|');
                    var prefixes = (parts[0] || '').split('&');
                    var key = prefixes.length > 1 ? prefixes[1] : prefixes[0];
                    var prefix = prefixes.length > 1 ? prefixes[0] : '';
                    var suffix = prefixes.length > 2 ? prefixes[2] : '';
                    var value = (replacements || {})[key];

                    return (value ? prefix + value + suffix : (parts[1] || ''));
                });
            };

            return serviceInstance;
        }])
        .filter('replacetags', ['$replacetags', function ($replacetags) {
            return function (text, replacements) {
                return $replacetags.replaceTags(text, replacements);
            }
        }]);
})();