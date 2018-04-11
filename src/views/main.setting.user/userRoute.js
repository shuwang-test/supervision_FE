;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.setting.user', {
			url: '/user',
			templateUrl: 'views/main.setting.user/user.html',
			controller: 'userCtrl'
		})
	})
})()
