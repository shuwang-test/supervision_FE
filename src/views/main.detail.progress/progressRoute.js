;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.progress', {
			url: '/progress',
			templateUrl: 'views/main.detail.progress/progress.html',
			controller: 'progressCtrl'
		})
	})
})()
