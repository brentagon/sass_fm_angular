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
			/* dynamically created state depending on type of object selected (artist, album, label, etc.) */
				.state('object', {
					url: '/{type}/{id}',
					templateUrl: '/objects.html',
					controller: 'ObjectsController'
				})
			$urlRouterProvider.otherwise('home');
		}])

	.factory('objects', [function(){
		/* store of favorite objects */
		var a = {
			objects: []
		};
		return a;
	}])

	.controller('ObjectsController', [
		'$scope',
		'$stateParams',
		'objects',
		'$http',
		'$filter',
		function($scope, $stateParams, objects, $http, $filter) {
			/* check if object has been interacted with by users */
			var objectStored = $filter('filter')(objects.objects, {id: $stateParams.id, type: $stateParams.type});

			if( objectStored[0] != null ) {
			$scope.object = objectStored[0];
		} else {
			/* if not, render page using API info */
			$http.get("https://api.discogs.com/"+ $stateParams.type + "/" + $stateParams.id).success(function(response){
			$scope.object = response;
			console.log(response);
			});
		}
		$scope.getPartial = function() {
			if ($stateParams.type === ("releases" || "masters")) {
				return "partials/album.html"
			} else if ($stateParams.type === "artists") {
				return "partials/artist.html"
			} else {
				return "partials/label.html"
			}
		}
			$scope.addReview = function() {
				if($scope.body === '') { return; }
				$scope.object.reviews.push({
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
	'objects',
	function($scope, $http, objects){

	var pendingTask;

	$scope.objects = objects.objects;


	$scope.addObject = function() {
		$scope.objects.push({
			title: $scope.details[0].title,
			img: $scope.details[0].thumb,
			id: $scope.details[0].id,
			type: $scope.details[0].type + "s",
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
		$scope.dataType = output[0].type;
		var related = output.slice(1, (output.length - 1));
		$scope.results = related;
		});

		/* eventually use Grunt to store secret & key */
	}

	$scope.update = function(result) {
		$scope.search = result.title;
		$scope.change();
	};

	$scope.select = function() {
		this.setSelectionRange(0, this.value.length);
	}
}]);
