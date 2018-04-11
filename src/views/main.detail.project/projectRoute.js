;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.project', {
			url: '/project',
			templateUrl: 'views/main.detail.project/project.html',
			controller: 'projectCtrl'
		})
	})
})()
