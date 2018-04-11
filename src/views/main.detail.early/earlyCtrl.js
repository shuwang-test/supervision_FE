;(function() {
	'use strict'
	angular.module('app').controller('earlyCtrl', earlyCtrl)
	function earlyCtrl(
		$scope,
		$rootScope,
		$location,
		$timeout,
		$state,
		toastr,
		localStorageService,
		Util,
		Http,
		AreYouSure,
		Loading,
		Permission
	) {
		$scope.go = go
		init()
		function init() {
			$rootScope.currentMenu = 2
		}

		function go(menu) {
			switch (menu) {
				case 1:
					$state.go('main.detail.early.proposal')
					break
				case 2:
					$state.go('main.detail.early.report')
					break
				case 3:
					$state.go('main.detail.early.designPlan')
					break
				case 4:
					$state.go('main.detail.early.constructPlan')
					break
				case 5:
					$state.go('main.detail.early.planPermission')
					break
				case 6:
					$state.go('main.detail.early.constructPermission')
					break
			}
		}

		// function getRoleMenuList() {
		// 	var options = {
		// 		roleId: localStorageService.get('user').role.id,
		// 		parentId: localStorageService.get('parentId')
		// 	}
		// 	Loading.open('菜单加载中......')
		// 	Http.getRoleMenuList(options).then(function(res) {
		// 		if (res) {
		// 			var menuList = []
		// 			res.data.data.forEach(function(menu, index) {
		// 				menuList[index] = {
		// 					name: menu.name,
		// 					id: menu.id,
		// 					power: menu.power
		// 				}
		// 			})
		// 			$scope.menuList = menuList
		// 			console.log(menuList[0].power)
		// 			var absUrl =
		// 				$location.protocol() +
		// 				'://' +
		// 				$location.host() +
		// 				':' +
		// 				$location.port() +
		// 				menuList[0].power
		// 			console.log(absUrl)
		// 			window.location = absUrl
		// 		}
		// 	})
		// }

		// function go(earlyCurrentMenu) {
		// 	switch (earlyCurrentMenu) {
		// 		case 1:
		// 			$state.go('main.detail.early.proposal')
		// 			break
		// 		case 2:
		// 			$state.go('main.detail.early.report')
		// 			break
		// 		case 3:
		// 			$state.go('main.detail.early.designPlan')
		// 			break
		// 		case 4:
		// 			$state.go('main.detail.early.constructPlan')
		// 			break
		// 		case 5:
		// 			$state.go('main.detail.early.planPermission')
		// 			break
		// 		case 6:
		// 			$state.go('main.detail.early.constructPermission')
		// 			break
		// 	}
		// }
	}
})()
