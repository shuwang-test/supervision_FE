;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.living.attendance', {
			url: '/attendance',
			templateUrl: 'views/main.detail.living.attendance/attendance.html',
			controller: 'attendanceCtrl'
		})
	})
})()
