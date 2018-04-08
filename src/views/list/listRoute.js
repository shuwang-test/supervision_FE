;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.list', {
			url: '/list',
			templateUrl: 'views/list/list.html',
			controller: 'listCtrl'
		})
	})
})()
