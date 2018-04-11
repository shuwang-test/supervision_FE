;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.progress.compareProgress', {
			url: '/compareProgress',
			templateUrl:
				'views/main.detail.progress.compareProgress/compareProgress.html',
			controller: 'compareProgressCtrl'
		})
	})
})()
