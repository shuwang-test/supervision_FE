;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.list', {
			url: '/list',
			templateUrl: 'views/main.list/list.html',
			controller: 'listCtrl'
		})
	})
})()
