;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.early.proposal', {
			url: '/proposal',
			templateUrl: 'views/main.detail.early.proposal/proposal.html',
			controller: 'proposalCtrl'
		})
	})
})()
