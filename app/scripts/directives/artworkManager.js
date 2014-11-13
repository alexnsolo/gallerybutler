'use strict';

angular.module('gallerybutler').directive('artworkManager', function($q, Artworks, Materials, Mediums) {
	return {
		restrict: 'E',
		templateUrl: 'templates/artworkManager.html',
		controller: function($scope) {
			$scope.drafts = [];
			$scope.isLoading = true;

			$q.all([
				Materials.loadAll(),
				Mediums.loadAll()
			]).then(function() {
				Artworks.getAll().then(function(artworks) {
					$scope.artworks = artworks;
					$scope.isLoading = false;
				});
			});

			$scope.createArtwork = function() {
				$scope.drafts.push({
					'medium': null,
					'materials': [], 
					'dimension1': null,
					'dimension2': null,
					'dimension3': null,
					'dimensions_in_cm': true,
					'description': '',
					'includes_vat': false,
					'vat': 0
				});
			};

			$scope.$on('ARTWORK_DELETED', function($event, artwork) {
				var index = $scope.artworks.indexOf(artwork);
				$scope.artworks.splice(index, 1);
			});

			$scope.$on('DRAFT_DELETED', function($event, draft) {
				var index = $scope.drafts.indexOf(draft);
				$scope.drafts.splice(index, 1);
			});

			$scope.$on('ARTWORK_UPDATED', function($event, artwork) {
				var existing = _.findWhere($scope.artworks, {id: artwork.id});
				var index = $scope.artworks.indexOf(existing);
				$scope.artworks.splice(index, 1, artwork);
			});

			$scope.$on('ARTWORK_CREATED', function($event, artwork) {
				$scope.artworks.unshift(artwork);
			});
		}
	};
});