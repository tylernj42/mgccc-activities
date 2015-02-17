(function(){
	/* Declare Angular App */
	var app;
	app = angular.module('activityList', ['ngRoute', 'ngSanitize', 'angular-carousel']);
	
	/* Get Global Data.  Pulls every 5 minutes */
	app.run(function Poller($http, $interval, $rootScope){
		$rootScope.data = {'slides' : [], 'activities' : []};
		var getData = function() {
			$http.get('http://tnjdesigns.com/sandbox/pbl-2015/app-api/?width='+window.innerWidth)
				.then(function(response){
					$rootScope.data = response.data;
				});
		};
		getData();
		var loopGetData = function() {
			$interval(getData, 1000*60);
		};
		loopGetData();
 	});
	
	/* Define pages and templates using routes */
	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {templateUrl : 'partials/home.html'})
			.when('/:permalink', {templateUrl : 'partials/activity.html', controller : 'ActivityController'})
			.otherwise({redirectTo : '/'});
		$locationProvider.html5Mode(true);
	}])
	
	/* Controller for individual activity pages */
	app.controller('ActivityController', function($scope, $rootScope, $routeParams, $filter, $sce){
		var activity = $rootScope.data.activities.filter(function(obj){
			return obj.permalink === $routeParams.permalink;
		});
		$scope.activity = activity[0];
		if($filter('date')($scope.activity.startTime, 'MMyyyy') == $filter('date')($scope.activity.endTime, 'MMyyyy') && $filter('date')($scope.activity.startTime, 'dd') != $filter('date')($scope.activity.endTime, 'dd')){
			$scope.activity.multiDay = true;
		}else{
			$scope.activity.multiDay = false;
		}
		$scope.activity.description = $sce.trustAsHtml(unescape($scope.activity.description));
	});
	
	
	/* Controller for slider on home page */
	app.controller('SliderController', function($scope, $rootScope){
		var slider = this;
		slider.slides = $rootScope.data.slides;
		$rootScope.$watch('data', function(newValue, oldValue){
			if (newValue !== oldValue){
				slider.slides = newValue.slides;
			}
		});
	});
	
	/* Controller for lists of activities on home page */
	app.controller('ListController', function($scope, $rootScope){
		var list = this;
		list.activities = $rootScope.data.activities;
		$rootScope.$watch('data', function(newValue, oldValue){
			if (newValue !== oldValue){
				list.activities = newValue.activities;
			}
		});
	});
})();