;(function() {
	'use strict'
	angular.module('app').controller('mainCtrl', mainCtrl)
	function mainCtrl(
		$scope,
		$state,
		toastr,
		localStorageService,
		Util,
		Http,
		AreYouSure
	) {
		$scope.realName = localStorageService.get('user').realName
		$scope.areYouSureTip = '您确定要退出登录吗？'
		$scope.loginOut = loginOut
		$scope.sure = sure
		$scope.cancel = cancel

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
	}
})()
