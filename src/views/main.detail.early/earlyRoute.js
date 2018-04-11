;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.early', {
			url: '/early',
			templateUrl: 'views/main.detail.early/early.html',
			controller: 'earlyCtrl'
		})
	})
})()
