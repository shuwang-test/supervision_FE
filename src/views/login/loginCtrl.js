;(function() {
	'use strict'
	angular.module('app').controller('loginCtrl', loginCtrl)
	function loginCtrl(
		$scope,
		$state,
		toastr,
		localStorageService,
		Util,
		Http,
		Constant,
		MenuList,
		Permission
	) {
		$scope.login = login
		$scope.loginStatus = '登录'
		$scope.loginData = {}
		function login() {
			if ($scope.loginStatus === '登录中...') {
				return
			}
			if (!Util.exist($scope.loginData.loginName)) {
				toastr.error('请填写登录名。')
			} else if (!Util.exist($scope.loginData.password)) {
				toastr.error('请填写密码')
			} else {
				$scope.loginStatus = '登录中...'
				var options = {
					params: {
						loginName: $scope.loginData.loginName,
						password: $scope.loginData.password
					},
					handle: hanldleLogin,
					handleError: handleLoginError
				}
				Http.login(options)
			}
		}
		function hanldleLogin(res) {
			$scope.loginStatus = '登录'
			if (res.data.code === 0) {
				localStorageService.set(
					'user',
					res.data.data,
					Constant.localStorageExpireTime
				)
				localStorageService.set('token', res.data.data.token)
				var options = {
					content: encodeURI(
						JSON.stringify({
							id: localStorageService.get('user').id,
							idType: 1
						})
					)
				}
				Http.getPermissionList(options).then(function(res) {
					if (res) {
						var menuList = res.data.data.powerList
						var firstMenuList = MenuList.getFirstMenuList(menuList)
						var permissionList = Permission.getPermissionList(
							firstMenuList
						)
						Permission.setPermissionList(permissionList)
						console.log('permissionList', permissionList)
						$state.go('main.list')
					}
				})
			} else {
				toastr.error(res.data.message)
			}
		}
		function handleLoginError(error) {
			$scope.loginStatus = '登录'
			toastr.error('登录失败，请您稍后再试。')
		}
		document.onkeyup = function(event) {
			var event = event || window.event
			if (event.keyCode === 13 && $scope.loginStatus === '登录') {
				login()
			} else {
				return
			}
		}
		$scope.$on('$stateChangeStart', function(event, toState) {
			document.onkeyup = null
		})
	}
})()
