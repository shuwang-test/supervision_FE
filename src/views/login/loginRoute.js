;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('login', {
			url: '/login',
			templateUrl: 'views/login/login.html',
			controller: 'loginCtrl'
		})
	})
})()
