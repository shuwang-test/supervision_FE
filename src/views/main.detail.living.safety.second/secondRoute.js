;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living.safety.second', {
			url: '/second',
			templateUrl: 'views/main.detail.living.safety.second/second.html',
			controller: 'secondCtrl'
		})
	})
})()
