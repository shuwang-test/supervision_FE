;(function() {
	'use strict'

	angular.module('app').factory('MenuList', function() {
		var autoCheck = function(firstMenuList) {
			firstMenuList.forEach(function(firstMenu) {
				if (
					firstMenu.secondMenuList &&
					firstMenu.secondMenuList.length > 0
				) {
					firstMenu.secondMenuList.forEach(function(secondMenu) {
						if (
							secondMenu.thirdMenuList &&
							secondMenu.thirdMenuList.length > 0
						) {
							var unChooseAllThirdMenu = secondMenu.thirdMenuList.every(
								function(thirdMenu) {
									return thirdMenu.check === false
								}
							)
							var chooseOneThirdMenu = secondMenu.thirdMenuList.some(
								function(thirdMenu) {
									return thirdMenu.check === true
								}
							)
							if (unChooseAllThirdMenu) {
								secondMenu.check = false
							}
							if (chooseOneThirdMenu) {
								secondMenu.check = true
							}
						}
					})
					var unChooseAllSecondMenu = firstMenu.secondMenuList.every(
						function(secondMenu) {
							return secondMenu.check === false
						}
					)
					var chooseOneSecondMenu = firstMenu.secondMenuList.some(
						function(secondMenu) {
							return secondMenu.check === true
						}
					)
					if (unChooseAllSecondMenu) {
						firstMenu.check = false
					}
					if (chooseOneSecondMenu) {
						firstMenu.check = true
					}
				}
			})
			return firstMenuList
		}
		var getRawFirstMenuList = function(menuList) {
			var rawFirstMenuList = []
			menuList.forEach(function(rawFirstMenu, index) {
				rawFirstMenuList[index] = {
					id: rawFirstMenu.id,
					name: rawFirstMenu.name,
					check: rawFirstMenu.check,
					powerList: rawFirstMenu.powerList
				}
			})
			rawFirstMenuList.forEach(function(rawFirstMenu, index) {
				rawFirstMenu.rawSecondMenuList = []
				rawFirstMenu.powerList.forEach(function(power, index) {
					rawFirstMenu.rawSecondMenuList[index] = {
						id: power.id,
						name: power.name,
						check: power.check,
						powerList: power.powerList
					}
				})
			})
			rawFirstMenuList.forEach(function(rawFirstMenu) {
				rawFirstMenu.rawSecondMenuList.forEach(function(rawSecondMenu) {
					rawSecondMenu.rawThirdMenuList = []
					rawSecondMenu.powerList.forEach(function(power, index) {
						rawSecondMenu.rawThirdMenuList[index] = {
							id: power.id,
							name: power.name,
							check: power.check
						}
					})
				})
			})
			return rawFirstMenuList
		}

		var getFirstMenuListByRaw = function(rawFirstMenuList) {
			var firstMenuList = []
			rawFirstMenuList.forEach(function(rawFirstMenu, rawFirstIndex) {
				firstMenuList[rawFirstIndex] = {
					id: rawFirstMenu.id,
					name: rawFirstMenu.name,
					check: rawFirstMenu.check,
					secondMenuList: []
				}
				rawFirstMenu.rawSecondMenuList.forEach(function(
					rawSecondMenu,
					rawSecondIndex
				) {
					firstMenuList[rawFirstIndex].secondMenuList[
						rawSecondIndex
					] = {
						id: rawSecondMenu.id,
						name: rawSecondMenu.name,
						check: rawSecondMenu.check,
						thirdMenuList: rawSecondMenu.rawThirdMenuList
					}
				})
			})
			return firstMenuList
		}

		var getFirstMenuList = function(menuList) {
			return getFirstMenuListByRaw(getRawFirstMenuList(menuList))
		}

		return {
			getFirstMenuList: getFirstMenuList,
			autoCheck: autoCheck
		}
	})
})()
