;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living', {
			url: '/living',
			templateUrl: 'views/main.detail.living/living.html',
			controller: 'livingCtrl'
		})
	})
})()
