'use strict';

angular.module('gallerybutler').factory('Mediums', function($q, $http, $resource, endpoint) {
	var mediums = [];

	return {
		loadAll: function() {
			return $q(function(resolve) {
				var promises = [];

				promises.push($http.get(endpoint + '/mediums').success(function(data) {
					data.urls.forEach(function(url) {
						promises.push($http.get(url).success(function(data) {
							mediums.push(data);
						}));
					});
				}));

				$q.all(promises).then(function() {
					resolve();
				});
			});
		},
		mediums: mediums,
		getByUrl: function(url) {
			return _.findWhere(mediums, {url: url});
		}
	};
});