;(function() {
	'use strict'

	angular
		.module('app')
		.controller('roleCtrl', function(
			$scope,
			$rootScope,
			$state,
			toastr,
			ngDialog,
			$handleHttp,
			$httpFactory,
			localStorageService,
			$utilFactory,
			AreYouSure,
			MenuList,
			Permission
		) {
			var global = {}
			init()
			function init() {
				initGlobal()
				initAddRoleData()
				initEditRoleData()
				initSettingMenu()
				initMenuList()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
			}
			function initAddRoleData() {
				$scope.addRoleData = {}
			}
			function initEditRoleData() {
				$scope.editRoleData = {}
			}
			function initSettingMenu() {
				$rootScope.settingMenu = 2
			}
			function initMenuList() {
				var content = encodeURI(
					JSON.stringify({
						type: 3
					})
				)
				$handleHttp.handleHttp(
					{
						content: content
					},
					'menuList',
					handleGetMenuList
				)
			}
			function handleGetMenuList(res) {
				var menuList = res.data.data.powerList
				$scope.firstMenuList = MenuList.getFirstMenuList(menuList)
				console.log('firstMenuList', $scope.firstMenuList)
			}

			$scope.chooseFirst = chooseFirst
			function chooseFirst(firstMenu) {
				firstMenu.secondMenuList.forEach(function(secondMenu, index) {
					secondMenu.check = firstMenu.check
					if (secondMenu.thirdMenuList) {
						secondMenu.thirdMenuList.forEach(function(thirdMenu) {
							thirdMenu.check = firstMenu.check
						})
					}
				})
				MenuList.autoCheck($scope.firstMenuList)
			}
			$scope.chooseSecond = chooseSecond
			function chooseSecond(secondMenu) {
				if (secondMenu.thirdMenuList) {
					secondMenu.thirdMenuList.forEach(function(thirdMenu) {
						thirdMenu.check = secondMenu.check
					})
				}
				MenuList.autoCheck($scope.firstMenuList)
			}
			$scope.chooseThird = chooseThird
			function chooseThird(thirdMenu) {
				MenuList.autoCheck($scope.firstMenuList)
			}
			$scope.showSecondMenu = showSecondMenu
			function showSecondMenu(firstMenu) {
				firstMenu.show = !first.show
			}
			$scope.showThirdMenu = showThirdMenu
			function showThirdMenu(secondMenu) {
				secondMenu.show = !secondMenu.show
			}

			$scope.startAddRole = startAddRole
			function startAddRole() {
				openAddRoleDialog()
			}
			$scope.certainAddRole = certainAddRole
			function certainAddRole() {
				var roleName = $scope.addRoleData.roleName
				var powerList = Permission.getPowerList($scope.firstMenuList)
				console.log('powerList', powerList, 'roleName', roleName)
				if (
					!$utilFactory.exist(roleName) ||
					!$utilFactory.check.checkChineseCharacter(roleName)
				) {
					toastr.error('角色名称需要是中文汉字。')
					return
				}
				var data = {
					content: JSON.stringify({
						type: 1,
						roleName: roleName,
						powerList: powerList
					})
				}
				$handleHttp.handleHttp(
					{
						data: data
					},
					'addRole',
					handleAddRole
				)
			}
			function handleAddRole(res) {
				var message = res.data.message
				toastr.success(message)
				$scope.initRoleList()
				closeAddRoleDialog()
			}

			$scope.cancelAddRole = cancelAddRole
			function cancelAddRole() {
				initAddRoleData()
				closeAddRoleDialog()
			}

			function openAddRoleDialog() {
				global.addRoleDialog = ngDialog.open({
					templateUrl: 'views/template/addRole.html',
					className: 'ngdialog-theme-default add-role',
					showClose: false,
					overlay: true,
					closeByDocument: false,
					scope: $scope,
					onOpenCallback: initMenuList
				})
			}
			function closeAddRoleDialog() {
				if (global.addRoleDialog && global.addRoleDialog.close) {
					global.addRoleDialog.close()
				}
			}

			function openEditRoleDialog() {
				global.editRoleDialog = ngDialog.open({
					templateUrl: 'views/template/editRole.html',
					className: 'ngdialog-theme-default add-role',
					showClose: false,
					overlay: true,
					closeByDocument: false,
					scope: $scope,
					onOpenCallback: initRoleMenuList
				})
			}
			function closeEditRoleDialog() {
				if (global.editRoleDialog && global.editRoleDialog.close) {
					global.editRoleDialog.close()
				}
			}
			$scope.startEditRole = startEditRole
			function startEditRole(role) {
				global.roleId = role.id
				$scope.editRoleData.roleName = role.name
				openEditRoleDialog()
			}
			$scope.cancelEditRole = cancelEditRole
			function cancelEditRole() {
				closeEditRoleDialog()
			}
			function initRoleMenuList() {
				var content = encodeURI(
					JSON.stringify({
						idType: 2,
						id: global.roleId
					})
				)
				$handleHttp.handleHttp(
					{
						content: content
					},
					'menuList',
					handleGetMenuList
				)
			}

			$scope.certainEditRole = certainEditRole
			function certainEditRole() {
				var roleName = $scope.editRoleData.roleName
				var powerList = Permission.getPowerList($scope.firstMenuList)
				console.log('powerList', powerList, 'roleName', roleName)
				if (
					!$utilFactory.exist(roleName) ||
					!$utilFactory.check.checkChineseCharacter(roleName)
				) {
					toastr.error('角色名称需要是中文汉字。')
					return
				}
				var data = {
					content: JSON.stringify({
						type: 2,
						roleId: global.roleId,
						roleName: roleName,
						powerList: powerList
					})
				}
				$handleHttp.handleHttp(
					{
						data: data
					},
					'addRole',
					handleEditRole
				)
			}
			function handleEditRole(res) {
				var message = res.data.message
				toastr.success(message)
				$scope.initRoleList()
				closeEditRoleDialog()
			}

			$scope.startDeleteRole = startDeleteRole
			function startDeleteRole(role) {
				global.roleId = role.id
				$scope.areYouSureTip = '您确定要删除角色' + role.name + '?'
				AreYouSure.open($scope)
			}
			$scope.sure = function() {
				var data = {
					json: JSON.stringify([
						{
							id: global.roleId
						}
					])
				}
				$handleHttp.handleHttp(
					{
						data: data
					},
					'deleteRole',
					function(res) {
						var message = res.data.message
						toastr.success(message)
						AreYouSure.close()
						$scope.initRoleList()
					}
				)
			}
			$scope.cancel = function() {
				AreYouSure.close()
			}
		})
})()
