;(function() {
	'use strict'

	angular
		.module('app')
		.controller('settingCtrl', function(
			$scope,
			$rootScope,
			$state,
			toastr,
			$httpFactory,
			localStorageService,
			Loading,
			$utilFactory
		) {
			var global = {}
			init()
			function init() {
				initGlobal()
				initRoleList()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
			}
			$scope.initRoleList = initRoleList
			function initRoleList() {
				$httpFactory.setToken(global.token)
				$httpFactory.getRoleList().then(function(res) {
					console.log('res', res)
					var data = res.data.data.list
					var roleList = []
					data.forEach(function(item, index) {
						roleList[index] = {}
						roleList[index].id = item.id
						roleList[index].name = item.name
					})
					$scope.roleList = roleList
					console.log('roleList', $scope.roleList)
				})
			}
			$scope.goSettingMenu = goSettingMenu
			function goSettingMenu(menu) {
				$rootScope.settingMenu = menu
				switch (menu) {
					case 1:
						$state.go('main.setting.user')
						break
					case 2:
						$state.go('main.setting.role')
						break
					// case 3:
					// 	$state.go('main.setting.menu')
					// 	break
				}
			}
		})
})()
