'use strict';

angular.module('gallerybutler').factory('Materials', function($http, $q, endpoint) {
	var materials = [];

	return {
		loadAll: function() {
			return $q(function(resolve) {
				var promises = [];

				promises.push($http.get(endpoint + '/materials').success(function(data) {
					data.urls.forEach(function(url) {
						promises.push($http.get(url).success(function(data) {
							materials.push(data);
						}));
					});
				}));

				$q.all(promises).then(function() {
					resolve();
				});
			});
		},
		materials: materials,
		getByUrl: function(url) {
			return _.findWhere(materials, {url: url});
		},
		create: function(props) {
			return $q(function(resolve) {
				var existingMaterial = _.findWhere(materials, {name: props.name});
				if (existingMaterial) {
					resolve(existingMaterial);
				}
				else {
					$http.post(endpoint + '/materials', props)
						.success(function(data, status, headers) {
							$http.get(headers('Location')).success(function(newMaterial) {
								materials.push(newMaterial);
								resolve(newMaterial);
							});
						});
				}
			});
		}
	};
});