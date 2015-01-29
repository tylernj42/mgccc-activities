(function(){
	/* Declare Angular App */
	var app;
	app = angular.module('activityList', ['ngRoute']);
	
	/* Define pages and templates using routes */
	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {templateUrl : 'partials/home.html', controller : 'ListController'})
			.when('/:permalink', {templateUrl : 'partials/activity.html', controller : 'ActivityController'})
			.otherwise({redirectTo : '/'});
		$locationProvider.html5Mode(true);
	}])
	
	app.controller('HomeController', function($http){
		
	});
	
	app.controller('ActivityController', function($scope, $rootScope, $routeParams){
		console.log('rootScope:')
		console.log($rootScope.data.activities);
		console.log('rootParams: '+$routeParams.permalink);
		var activity = $rootScope.data.activities.filter(function(obj){
			return obj.permalink === $routeParams.permalink;
		});
		$scope.activity = activity[0];
	});
	
	/* Controller for lists of activities */
	
	
	
	
	
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