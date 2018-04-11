;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.progress.planProgress', {
			url: '/planProgress',
			templateUrl:
				'views/main.detail.progress.planProgress/planProgress.html',
			controller: 'planProgressCtrl'
		})
	})
})()
