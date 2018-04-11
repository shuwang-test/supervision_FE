;(function() {
	'use strict'

	angular
		.module('app')
		.controller('livingCtrl', function(
			$scope,
			$rootScope,
			$state,
			localStorageService,
			toastr,
			Permission
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
				$rootScope.currentMenu = 3
			}
			$scope.go = go
			function go(menu) {
				switch (menu) {
					case 1:
						$state.go('main.detail.living.attendance')
						break
					case 2:
						$state.go('main.detail.living.supervision')
						break
					case 3:
						$state.go('main.detail.living.safety.first')
						// if (Permission.userHasPermission('安全责任制')) {
						// 	$state.go('main.detail.living.safety.first')
						// 	return
						// }
						// if (Permission.userHasPermission('安全制度详情')) {
						// 	$state.go('main.detail.living.safety.second')
						// 	return
						// }
						// if (Permission.userHasPermission('安全措施状况')) {
						// 	$state.go('main.detail.living.safety.third')
						// 	return
						// }
						// if (Permission.userHasPermission('安全检查状态')) {
						// 	$state.go('main.detail.living.safety.fourth')
						// 	return
						// }
						break
				}
			}
		})
})()
