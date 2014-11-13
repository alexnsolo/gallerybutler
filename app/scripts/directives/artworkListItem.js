'use strict';

angular.module('gallerybutler').directive('artworkListItem', function($http, Artworks, Mediums, Materials) {
	return {
		restrict: 'E',
		templateUrl: 'templates/artworkListItem.html',
		replace: true,
		scope: {
			artwork: '=',
			createMode: '=?'
		},
		controller: function($scope) {
			$scope.mediums = Mediums.mediums;
			$scope.newMaterial = {name: ''};
			$scope.measuringUnits = [
				{name: 'cm', value: true},
				{name: 'inch', value: false}
			];
			$scope.priceTypes = [
				{name: 'Net', value: true},
				{name: 'Gross', value: false}
			];
			$scope.materialsAdded = [];
			$scope.materialsDeleted = [];

			function loadArtwork() {
				$scope.editArtwork = angular.copy($scope.artwork);
				$scope.editArtwork.medium = Mediums.getByUrl($scope.artwork.medium);
				$scope.editArtwork.materials = [];

				$http.get($scope.artwork.materials).success(function(data) {
					if (!data) { 
						return;
					}
					data.urls.forEach(function(url) {
						$scope.editArtwork.materials.push(Materials.getByUrl(url));
					});
				});

				$scope.materialsAdded = [];
				$scope.materialsDeleted = [];
			}

			$scope.addMaterial = function() {
				if ($scope.newMaterial.name.trim() === '') {
					return;
				}

				Materials.create($scope.newMaterial).then(function(material) {
					$scope.editArtwork.materials.push(material);
					$scope.materialsAdded.push(material);
				});

				$scope.newMaterial = {name: ''};
				$scope.artworkForm.$setDirty();
			};

			$scope.removeMaterial = function(material) {
				$scope.editArtwork.materials = _.without($scope.editArtwork.materials, material);
				$scope.materialsDeleted.push(material);
				$scope.artworkForm.$setDirty();
			};

			$scope.deleteArtwork = function() {
				if (window.confirm('Are you sure you want to delete this record')) {
					$http.delete($scope.artwork.url).success(function() {
						$scope.$emit('ARTWORK_DELETED', $scope.artwork);
					});
				}
			};

			$scope.discardDraft = function() {
				$scope.$emit('DRAFT_DELETED', $scope.artwork);
			};

			$scope.discardChanges = function() {
				loadArtwork();
				$scope.artworkForm.$setPristine();
			};

			$scope.saveChanges = function() {
				if ($scope.createMode) {
					Artworks.create($scope.editArtwork).then(function(result) {
						$scope.$emit('ARTWORK_CREATED', result);
						$scope.$emit('DRAFT_DELETED', $scope.artwork);
					});
				}
				else {
					Artworks.save($scope.editArtwork, $scope.materialsAdded, $scope.materialsDeleted).then(function(result) {
						$scope.$emit('ARTWORK_UPDATED', result);
					});
				}
			};

			$scope.$watch('artwork', function() {
				loadArtwork();
			});
		}
	};
});