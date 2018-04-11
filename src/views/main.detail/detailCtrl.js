;(function() {
	'use strict'
	angular.module('app').controller('detailCtrl', detailCtrl)
	function detailCtrl(
		$scope,
		$rootScope,
		$location,
		$state,
		$timeout,
		toastr,
		localStorageService,
		Util,
		Http,
		AreYouSure,
		ProjectDetail,
		Loading,
		Permission
	) {
		$scope.showSummary = showSummary
		$scope.go = go
		init()
		function init() {
			$rootScope.currentMenu = 1
			getProjectDetail()
		}
		function showSummary() {
			if ($scope.hasShowSummary) {
				return
			} else {
				if ($scope.showSummaryInfo === true) {
					$scope.showSummaryInfo = false
				} else {
					$scope.hasShowSummary = true
					$scope.showSummaryInfo = true
					$timeout(function() {
						$scope.hasShowSummary = false
					}, 300)
				}
			}
		}
		function getProjectDetail() {
			var projectId = localStorageService.get('projectId')
			ProjectDetail.getProjectDetail(projectId).then(function(res) {
				if (res) {
					$scope.project = res
				}
			})
		}

		function go(currentMenu) {
			switch (currentMenu) {
				case 1:
					$state.go('main.detail.project')
					break
				case 2:
					if (Permission.userHasPermission('项目立项书')) {
						$state.go('main.detail.early.proposal')
						return
					}
					if (Permission.userHasPermission('可研报告')) {
						$state.go('main.detail.early.report')
						return
					}
					if (Permission.userHasPermission('初步设计方案及审批')) {
						$state.go('main.detail.early.designPlan')
						return
					}
					if (Permission.userHasPermission('施工方案及审批')) {
						$state.go('main.detail.early.consturctPlan')
						return
					}
					if (Permission.userHasPermission('规划许可证')) {
						$state.go('main.detail.early.planPermission')
						return
					}
					if (Permission.userHasPermission('施工许可证')) {
						$state.go('main.detail.early.constructPermission')
						return
					}
					toastr.warning('抱歉，您没有权限访问。')
					break
				case 3:
					if (Permission.userHasPermission('人员出勤状况')) {
						$state.go('main.detail.living.attendance')
						return
					}
					if (Permission.userHasPermission('监管状况')) {
						$state.go('main.detail.living.supervision')
						return
					}
					if (Permission.userHasPermission('安全状况')) {
						$state.go('main.detail.living.safety.first')
						return
					}
					toastr.warning('抱歉，您没有权限访问。')
					break
				case 4:
					if (Permission.userHasPermission('计划进度')) {
						$state.go('main.detail.progress.planProgress')
						return
					}
					if (Permission.userHasPermission('实际进度')) {
						$state.go('main.detail.progress.actualProgress')
						return
					}
					if (Permission.userHasPermission('进度对比照')) {
						$state.go('main.detail.progress.compareProgress')
						return
					}
					toastr.warning('抱歉，您没有权限访问。')
					break
			}
		}

		// 	function getRoleMenuList() {
		// 		var options = {
		// 			roleId: localStorageService.get('user').role.id
		// 		}
		// 		Loading.open('菜单加载中......')
		// 		Http.getRoleMenuList(options).then(function(res) {
		// 			if (res) {
		// 				var menuList = []
		// 				res.data.data.forEach(function(menu, index) {
		// 					menuList[index] = {
		// 						name: menu.name,
		// 						id: menu.id,
		// 						power: menu.power
		// 					}
		// 				})
		// 				$scope.menuList = menuList
		// 				console.log(menuList[0].power)
		// 				var absUrl =
		// 					$location.protocol() +
		// 					'://' +
		// 					$location.host() +
		// 					':' +
		// 					$location.port() +
		// 					menuList[0].power
		// 				console.log(absUrl)
		// 				window.location = absUrl
		// 			}
		// 		})
		// 	}

		// 	function go(menu) {
		// 		console.log(menu)
		// 		localStorageService.set('parentId', menu.id)
		// 		if (menu.name === '项目详情') {
		// 			$state.go('main.detail.project')
		// 		} else if (menu.name === '前期阶段') {
		// 			$state.go('main.detail.early')
		// 		} else if (menu.name === '现场状况') {
		// 			$state.go('main.detail.living')
		// 		} else if (menu.name === '项目进度 ') {
		// 			$state.go('main.detail.progress')
		// 		} else if (menu.name === '') {
		// 			$state.go('main.detail.early')
		// 		} else if (menu.name === '') {
		// 			$state.go('main.detail.early')
		// 		} else if (menu.name === '') {
		// 			$state.go('main.detail.early')
		// 		} else {
		// 			$state.go('main.detail.early')
		// 		}
		// 	}
	}
})()
