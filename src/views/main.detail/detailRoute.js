;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail', {
			abstract: true,
			url: '/detail',
			templateUrl: 'views/main.detail/detail.html',
			controller: 'detailCtrl'
		})
	})
})()
