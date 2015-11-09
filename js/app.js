'use strict';

angular.module('myApp', ['ui.router'])
	.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/home.html',
					controller: 'SearchController'
				})
				.state('albums', {
					url: '/albums/{id}',
					templateUrl: '/albums.html',
					controller: 'AlbumsController'
				});
			$urlRouterProvider.otherwise('home');
		}])

	.factory('albums', [function(){
		var a = {
			albums: []
		};
		return a;
	}])

	.controller('AlbumsController', [
		'$scope',
		'$stateParams',
		'albums',
		function($scope, $stateParams, albums) {
			console.log('foo');
			$scope.albums = albums.albums;
			if (albums.albums[id]) {
			$scope.album = albums.albums[id];
		} else {
			$http.get("https://api.discogs.com/database/search?q=" + $stateParams.id + "&key=sgPQPSrsXwtszVQohmLS&secret=AkCvXlTSVACjBxuLHSKQteoeuFQFvZVY").success(function(response){			$scope.album = response.results
			});
		}
			$scope.addReview = function() {
				if($scope.body === '') { return; }
				$scope.album.reviews.push({
					body: $scope.body,
					author: 'user',
					upvotes: 0
				});
				$scope.body = '';
			}
		}])

	.controller('SearchController', [
	'$scope',
	'$http',
	'albums',
	function($scope, $http, albums){

	var pendingTask;

	$scope.albums = albums.albums;

	if($scope.search === undefined){
		$scope.search = "";
		fetch();
	}
	$scope.addAlbum = function() {
		$scope.albums.push({
			title: $scope.details[0].title,
			img: $scope.details[0].thumb,
			id: $scope.details[0].id,
			reviews: [
				{author: 'Bront', body: 'Whatever', upvotes: 0},
				{author: 'Brandt', body: 'I love it', upvotes: 0}
			]
		});
	};

	$scope.change = function(){
		if(pendingTask){
			clearTimeout(pendingTask);
		}
		pendingTask = setTimeout(fetch, 800);
	};

	function fetch() {
		$http.get("https://api.discogs.com/database/search?q=" + $scope.search + "&key=sgPQPSrsXwtszVQohmLS&secret=AkCvXlTSVACjBxuLHSKQteoeuFQFvZVY").success(function(response){
		var output = response.results;
		$scope.details = output;
		var related = output.slice(1, (output.length - 1));
		$scope.results = related; 	console.log(related[0]);
		});

		/* do something for related results, eventually use Grunt to store secret & key */
	}

	$scope.update = function(result) {
		$scope.search = result.title;
		$scope.change();
	};

	$scope.select = function() {
		this.setSelectionRange(0, this.value.length);
	}
}]);
