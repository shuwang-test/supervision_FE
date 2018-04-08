;(function() {
	'use strict'
	angular
		.module('app')
		.config(function(
			$stateProvider,
			$urlRouterProvider,
			$locationProvider
		) {
			$locationProvider.hashPrefix('')
			$urlRouterProvider.otherwise('/login')
		})
})()
