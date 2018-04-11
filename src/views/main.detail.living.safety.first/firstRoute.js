;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living.safety.first', {
			url: '/first',
			templateUrl: 'views/main.detail.living.safety.first/first.html',
			controller: 'firstCtrl'
		})
	})
})()
