;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.setting.role', {
			url: '/role',
			templateUrl: 'views/main.setting.role/role.html',
			controller: 'roleCtrl'
		})
	})
})()
