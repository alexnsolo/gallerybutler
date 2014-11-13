'use strict';

angular.module('gallerybutler').factory('Artworks', function($resource, $http, $q, endpoint) {
	return {
		getAll: function() {
			return $q(function(resolve) {
				var artworks = [];
				var promises = [];

				// Load artworks
				promises.push($http.get(endpoint + '/artworks').success(function(data) {
					data.urls.forEach(function(artworkUrl) {
						promises.push($http.get(artworkUrl).success(function(data) {
							artworks.push(data);
						}));
					});
				}));

				$q.all(promises).then(function() {
					resolve(artworks);
				});
			});
		},
		create: function(artwork) {
			return $q(function(resolve) {
				var promises = [];
				var location;

				artwork.medium = artwork.medium.url;
				promises.push($http.post(endpoint + '/artworks', artwork).success(function(data, status, headers) {
					location = headers('Location');
					
					var materialUrls = _.pluck(artwork.materials, 'url');
					_.each(materialUrls, function(materialUrl) {
						promises.push($http.post(location + '/materials', {url: materialUrl}));
					});
				}));

				$q.all(promises).then(function() {
					$http.get(location).success(function(data) {
						resolve(data);
					});
				});
			});
		},
		save: function(artwork, materialsAdded, materialsDeleted) {
			return $q(function(resolve) {
				var promises = [];

				artwork.medium = artwork.medium.url;
				promises.push($http.put(artwork.url, artwork).success(function() {
					promises.push($http.get(artwork.url).success(function(data) {
						resolve(data);
					}));

					materialsAdded.forEach(function(material) {
						promises.push($http.post(artwork.url + '/materials', {url: material.url}));
					});

					materialsDeleted.forEach(function(material) {
						promises.push($http.delete(artwork.url + '/materials', {url: material.url}));
					});
				}));

				$q.all(promises).then(function() {
					$http.get(artwork.url).success(function(data) {
						resolve(data);
					});
				});
			});
		}
	};
});