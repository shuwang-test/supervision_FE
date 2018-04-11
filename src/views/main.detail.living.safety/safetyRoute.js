;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living.safety', {
			abstract: true,
			url: '/safety',
			templateUrl: 'views/main.detail.living.safety/safety.html',
			controller: 'safetyCtrl'
		})
	})
})()
