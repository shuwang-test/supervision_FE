;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.early.designPlan', {
			url: '/designPlan',
			templateUrl: 'views/main.detail.early.designPlan/designPlan.html',
			controller: 'designPlanCtrl'
		})
	})
})()
