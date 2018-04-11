;(function() {
	'use strict'

	angular.module('app').factory('Permission', function(localStorageService) {
		var getPowerList = function(firstMenuList) {
			var powerList = []
			firstMenuList.forEach(function(firstMenu) {
				powerList.push({
					powerId: firstMenu.id,
					check: firstMenu.check
				})
				if (firstMenu.secondMenuList) {
					firstMenu.secondMenuList.forEach(function(secondMenu) {
						powerList.push({
							powerId: secondMenu.id,
							check: secondMenu.check
						})
						if (secondMenu.thirdMenuList) {
							secondMenu.thirdMenuList.forEach(function(
								thirdMenu
							) {
								powerList.push({
									powerId: thirdMenu.id,
									check: thirdMenu.check
								})
							})
						}
					})
				}
			})
			return powerList
		}
		var getPermissionList = function(firstMenuList) {
			var permissionList = []
			firstMenuList.forEach(function(firstMenu) {
				permissionList.push({
					name: firstMenu.name,
					id: firstMenu.id,
					check: firstMenu.check
				})
				if (firstMenu.secondMenuList) {
					firstMenu.secondMenuList.forEach(function(secondMenu) {
						permissionList.push({
							name: secondMenu.name,
							id: secondMenu.id,
							check: secondMenu.check
						})
						if (secondMenu.thirdMenuList) {
							secondMenu.thirdMenuList.forEach(function(
								thirdMenu
							) {
								permissionList.push({
									name: thirdMenu.name,
									id: thirdMenu.id,
									check: thirdMenu.check
								})
							})
						}
					})
				}
			})
			return permissionList
		}
		var setPermissionList = function(permissionList) {
			localStorageService.set('permissionList', permissionList)
		}
		var userHasPermission = function(name) {
			var permissionList = localStorageService.get('permissionList')
			for (var i = 0; i < permissionList.length; i++) {
				if (permissionList[i].name === name) {
					return permissionList[i].check
				}
			}
			console.log('没有找到菜单：' + name)
			return false
		}
		return {
			getPowerList: getPowerList,
			getPermissionList: getPermissionList,
			setPermissionList: setPermissionList,
			userHasPermission: userHasPermission
		}
	})
})()
