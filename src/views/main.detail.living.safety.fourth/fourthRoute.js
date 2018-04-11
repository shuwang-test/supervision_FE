;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living.safety.fourth', {
			url: '/fourth',
			templateUrl: 'views/main.detail.living.safety.fourth/fourth.html',
			controller: 'fourthCtrl'
		})
	})
})()
