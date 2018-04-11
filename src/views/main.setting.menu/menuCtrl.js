;(function() {
	'use strict'

	angular
		.module('app')
		.controller('main.setting.third', function(
			$scope,
			$rootScope,
			$state,
			toastr,
			$httpFactory,
			localStorageService,
			$loadingFactory,
			$utilFactory
		) {
			var global = {}
			init()
			function init() {
				initGlobal()
				initSettingMenu()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
			}
			function initSettingMenu() {
				$rootScope.settingMenu = 3
			}
		})
})()
