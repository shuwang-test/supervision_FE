;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.early.planPermission', {
			url: '/planPermission',
			templateUrl:
				'views/main.detail.early.planPermission/planPermission.html',
			controller: 'planPermissionCtrl'
		})
	})
})()
