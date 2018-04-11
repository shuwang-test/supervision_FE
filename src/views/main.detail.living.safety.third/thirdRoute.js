;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living.safety.third', {
			url: '/third',
			templateUrl: 'views/main.detail.living.safety.third/third.html',
			controller: 'thirdCtrl'
		})
	})
})()
