;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.progress.actualProgress', {
			url: '/actualProgress',
			templateUrl:
				'views/main.detail.progress.actualProgress/actualProgress.html',
			controller: 'actualProgressCtrl'
		})
	})
})()
