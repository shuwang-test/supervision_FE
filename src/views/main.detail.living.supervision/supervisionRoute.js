;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living.supervision', {
			url: '/supervision',
			templateUrl:
				'views/main.detail.living.supervision/supervision.html',
			controller: 'supervisionCtrl'
		})
	})
})()
