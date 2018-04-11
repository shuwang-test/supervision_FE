;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.early.constructPermission', {
			url: '/constructPermission',
			templateUrl:
				'views/main.detail.early.constructPermission/constructPermission.html',
			controller: 'constructPermissionCtrl'
		})
	})
})()
