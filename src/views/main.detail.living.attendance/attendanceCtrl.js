;(function() {
	'use strict'

	angular
		.module('app')
		.controller('attendanceCtrl', function(
			$scope,
			$rootScope,
			$state,
			localStorageService,
			toastr
		) {
			var global = {}
			init()
			function init() {
				initGlobal()
				initCurrentMenu()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
			}
			function initCurrentMenu() {
				$rootScope.detailThirdMenu = 1
			}
		})
})()
