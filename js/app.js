'use strict';


angular.module('myApp', [])
	.controller('SearchController', function($scope, $http){

	var pendingTask;

	if($scope.search === undefined){
		$scope.search = "";
		fetch();
	}

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
		$scope.results = related; console.log(related); });
		/* do something for related results, eventually use Grunt to store secret & key */
	}

	$scope.update = function(result) {
		$scope.search = result.title;
		$scope.change();
	};

	$scope.select = function() {
		this.setSelectionRange(0, this.value.length);
	}
});
