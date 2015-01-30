(function(){
	/* Declare Angular App */
	var app;
	app = angular.module('activityList', ['ngRoute']);
	
	/* Global Data.  Pulls every 5 minutes */
	app.run(function Poller($http, $interval, $rootScope){
		$rootScope.data = {'slider' : [], 'activities' : []};
		var getData = function() {
			$http.get('http://tnjdesigns.com/sandbox/pbl-2015/app-api/')
				.then(function(response){
				$rootScope.data = response.data;
				});
		};
		getData();
		var loopGetData = function() {
			$interval(getData, 5000);
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
	app.controller('ActivityController', function($scope, $rootScope, $routeParams){
		console.log('rootScope:')
		console.log($rootScope.data.activities);
		console.log('rootParams: '+$routeParams.permalink);
		var activity = $rootScope.data.activities.filter(function(obj){
			return obj.permalink === $routeParams.permalink;
		});
		$scope.activity = activity[0];
	});
	
	
	/* Controller for slider on home page */
	app.controller('SliderController', function($http){
		
	});
	
	/* Controller for lists of activities on home page */
	app.controller('ListController', function($scope, $rootScope){
		var list = this;
		list.activities = $rootScope.data.activities;
		$scope.Initialize = function (){
			$rootScope.$watch('data', function(newValue, oldValue){
				if (newValue !== oldValue){
					list.activities = newValue.activities;
				}
			});
		};
	
		$scope.Initialize();
	});
})();