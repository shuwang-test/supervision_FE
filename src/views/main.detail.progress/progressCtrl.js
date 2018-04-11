;(function() {
	'use strict'

	angular
		.module('app')
		.controller('progressCtrl', function(
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
				// initShowMenu()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
			}
			function initCurrentMenu() {
				$rootScope.currentMenu = 4
			}
			function initShowMenu() {
				$scope.showMenu1 = Permission.userHasPermission('计划进度')
				$scope.showMenu2 = Permission.userHasPermission('实际进度')
				$scope.showMenu3 = Permission.userHasPermission('进度比照图')
			}
			$scope.go = go
			function go(menu) {
				switch (menu) {
					case 1:
						$state.go('main.detail.progress.planProgress')
						break
					case 2:
						$state.go('main.detail.progress.actualProgress')
						break
					case 3:
						$state.go('main.detail.progress.compareProgress')
						break
				}
			}
		})
})()
