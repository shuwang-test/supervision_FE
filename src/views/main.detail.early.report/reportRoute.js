;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.early.report', {
			url: '/report',
			templateUrl: 'views/main.detail.early.report/report.html',
			controller: 'reportCtrl'
		})
	})
})()
