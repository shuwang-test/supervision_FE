;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.early.constructPlan', {
			url: '/constructPlan',
			templateUrl:
				'views/main.detail.early.constructPlan/constructPlan.html',
			controller: 'constructPlanCtrl'
		})
	})
})()
