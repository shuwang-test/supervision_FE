;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.audit', {
			url: '/audit',
			templateUrl: 'views/main.detail.audit/audit.html',
			controller: 'auditCtrl'
		})
	})
})()
