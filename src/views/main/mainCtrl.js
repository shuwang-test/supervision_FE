;(function() {
	'use strict'
	angular.module('app').controller('mainCtrl', mainCtrl)
	function mainCtrl(
		$scope,
		$rootScope,
		$state,
		toastr,
		localStorageService,
		$timeout,
		Util,
		ngDialog,
		Http,
		Http2,
		AreYouSure,
		$utilFactory,
		Constant,
		Permission
	) {
		$scope.showSetting = true
		$scope.realName = localStorageService.get('user').realName
		$scope.areYouSureTip = '您确定要退出登录吗？'
		$scope.goHome = goHome
		$scope.goToSetting = goToSetting
		$scope.loginOut = loginOut
		$scope.sure = sure
		$scope.cancel = cancel
		$scope.modifyPasswordData = {}
		$rootScope.userHasPermission = userHasPermission

		var global = {}

		function userHasPermission(menu) {
			return Permission.userHasPermission(menu)
		}
		function goHome() {
			$state.go('main.list')
		}
		function goToSetting() {
			$state.go('main.setting.user')
		}
		function loginOut() {
			AreYouSure.open($scope)
		}
		function sure() {
			AreYouSure.close()
			localStorageService.remove('user')
			$state.go('login')
		}
		function cancel() {
			AreYouSure.close()
		}

		$scope.startModifyPassword = startModifyPassword
		function startModifyPassword() {
			openModifyPasswordDialog()
		}

		$scope.certainModifyPassword = certainModifyPassword
		function certainModifyPassword() {
			var oldPass = $scope.modifyPasswordData.oldPass
			var newPass = $scope.modifyPasswordData.newPass
			if (
				!$utilFactory.exist(oldPass) ||
				!$utilFactory.check.checkPassword(newPass)
			) {
				toastr.error('请填入八位字母或数字。')
				return
			}
			if (oldPass === newPass) {
				toastr.error('新密码不能和旧密码一致。')
				return
			}
			var data = {
				oldPass: oldPass,
				newPass: newPass
			}
			var params = {
				method: 'POST',
				data: data,
				handle: handleModifyPassword
			}
			Http2.modifyPassword(params)
		}

		function handleModifyPassword(res) {
			var code = res.data.code
			var message = res.data.message
			if (code === 0) {
				closeModifyPasswordDialog()
				toastr.success(message)
				$timeout(function() {
					localStorageService.remove('user')
					$state.go('login')
				}, Constant.toastrTimeOut)
			} else {
				toastr.error(message)
			}
		}

		function openModifyPasswordDialog() {
			global.modifyPasswordDialog = ngDialog.open({
				templateUrl: 'views/template/modifyPassword.html',
				className: 'ngdialog-theme-default modify-password',
				showClose: false,
				overlay: true,
				closeByDocument: false,
				disableAnimation: false,
				scope: $scope
			})
		}
		$scope.cancelModifyPassword = cancelModifyPassword
		function cancelModifyPassword() {
			closeModifyPasswordDialog()
			$scope.modifyPasswordData = {}
		}

		function closeModifyPasswordDialog() {
			if (global.modifyPasswordDialog) {
				global.modifyPasswordDialog.close()
			}
		}
	}
})()
