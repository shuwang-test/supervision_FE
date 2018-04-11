;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.setting', {
			url: '/setting',
			templateUrl: 'views/main.setting/setting.html',
			controller: 'settingCtrl'
		})
	})
})()
