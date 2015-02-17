(function(){
    document.write('declaring app');
	/* Declare Angular App */
	var ngApp;
	ngApp = angular.module('activityList', ['ngRoute', 'ngSanitize', 'angular-carousel']);
	
    document.write('Setting data Pull');
	/* Get Global Data.  Pulls every 5 minutes */
	ngApp.run(function Poller($http, $interval, $rootScope){
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
	
    document.write('Setting router');
	/* Define pages and templates using routes */
	ngApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {templateUrl : 'partials/home.html'})
			.when('/:permalink', {templateUrl : 'partials/activity.html', controller : 'ActivityController'})
			.otherwise({redirectTo : '/'});
		$locationProvider.html5Mode(true);
	}])
	
    document.write('Creating Controllers');
	/* Controller for individual activity pages */
	ngApp.controller('ActivityController', function($scope, $rootScope, $routeParams, $filter, $sce){
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
	ngApp.controller('SliderController', function($scope, $rootScope){
		var slider = this;
		slider.slides = $rootScope.data.slides;
		$rootScope.$watch('data', function(newValue, oldValue){
			if (newValue !== oldValue){
				slider.slides = newValue.slides;
			}
		});
	});
	
	/* Controller for lists of activities on home page */
	ngApp.controller('ListController', function($scope, $rootScope){
		var list = this;
		list.activities = $rootScope.data.activities;
		$rootScope.$watch('data', function(newValue, oldValue){
			if (newValue !== oldValue){
				list.activities = newValue.activities;
			}
		});
	});
    document.write('Done');
})();