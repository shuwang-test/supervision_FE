;(function() {
	'use strict'

	angular
		.module('app')
		.controller('safetyCtrl', function(
			$scope,
			$rootScope,
			$state,
			localStorageService,
			toastr,
			$httpFactory,
			$utilFactory,
			$timeout
		) {
			var global = {}
			init()
			function init() {
				initGlobal()
				initCurrentMenu()
				initSafetyManagerData()
				initSafetyManager()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
			}
			function initCurrentMenu() {
				$rootScope.detailThirdMenu = 3
			}
			function initSafetyManagerData() {
				$scope.isFocus = false
				$scope.safetyManagerData = {}
			}
			function initSafetyManager() {
				getSafetyManager()
			}
			function getSafetyManager() {
				$httpFactory.setToken(global.token)
				$httpFactory
					.getSafetyManager(global.projectId)
					.then(function(res) {
						console.log('res', res)
						var code = res.data.code
						var message = res.data.message
						if (code === 0) {
							if (!$utilFactory.exist(res.data.data)) {
								toastr.info('暂无法人、责任人信息')
								$scope.safetyManager = {}
							} else {
								$scope.safetyManager = res.data.data
							}
						} else if (code === 2) {
							toastr.warning(message)
							$timeout(function() {
								localStorageService.remove('user')
								$state.go('login')
							}, 1500)
						}
					})
					.catch(function(error) {
						console.log('error', error)
						toastr.error('加载数据出错，请您稍后再试。')
					})
			}

			$scope.goToDetailThirdThirdMenu = goToDetailThirdThirdMenu
			function goToDetailThirdThirdMenu(menu) {
				$rootScope.detailThirdThirdMenu = menu
				switch (menu) {
					case 1:
						$state.go('main.detail.living.safety.first')
						break
					case 2:
						$state.go('main.detail.living.safety.second')
						break
					case 3:
						$state.go('main.detail.living.safety.third')
						break
					case 4:
						$state.go('main.detail.living.safety.fourth')
						break
				}
			}
			$scope.startEditing = startEditing
			function startEditing() {
				$scope.parentEditing = true
				$scope.isFocus = true
				$scope.safetyManagerData.responsiblePerson =
					$scope.safetyManager.responsiblePerson
				$scope.safetyManagerData.legalPerson =
					$scope.safetyManager.legalPerson
			}
			$scope.cancelEditing = cancelEditing
			function cancelEditing() {
				$scope.parentEditing = false
				$scope.isFocus = false
				initSafetyManagerData()
			}
			$scope.saveInfo = saveInfo
			function saveInfo() {
				if (!$scope.parentEditing) {
					return
				}
				var responsiblePerson =
					$scope.safetyManagerData.responsiblePerson
				var legalPerson = $scope.safetyManagerData.legalPerson
				console.log(
					'responsiblePerson',
					responsiblePerson,
					'legalPerson',
					legalPerson
				)
				if (
					!$utilFactory.exist(responsiblePerson) ||
					!$utilFactory.exist(legalPerson)
				) {
					toastr.error('请填写正确的信息。')
					return
				}
				if (
					!$utilFactory.check.checkChineseCharacter(
						responsiblePerson
					) ||
					!$utilFactory.check.checkChineseCharacter(legalPerson)
				) {
					toastr.error('请填写正确的信息。')
					return
				}
				var content = {
					projectId: global.projectId,
					legalPerson: legalPerson,
					responsiblePerson: responsiblePerson
				}
				var data = {
					content: content
				}
				uploadSafetyManager(data)
			}

			function uploadSafetyManager(data) {
				$httpFactory.setToken(global.token)
				$httpFactory
					.uploadSafetyManager(data)
					.then(function(res) {
						console.log('res', res)
						var code = res.data.code
						var message = res.data.message
						if (code === 0) {
							$scope.parentEditing = false
							$scope.isFocus = false
							toastr.success(message)
							initSafetyManager()
						} else if (code === 2) {
							toastr.warning(message)
							$timeout(function() {
								$state.go('login')
								localStorageService.remove('user')
							}, 1500)
						}
					})
					.catch(function(error) {
						console.log('error', error)
						toastr.error('保存失败，请您稍后再试。')
					})
			}
		})
})()
