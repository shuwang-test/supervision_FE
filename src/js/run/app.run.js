;(function() {
	'use strict'
	angular.module('app').run(appRun)
	function appRun(
		$state,
		$rootScope,
		localStorageService,
		toastr,
		Constant,
		$timeout
	) {
		/**
		 * 查看当前接口地址
		 */
		console.log('domainName', Constant.domainName)
		/**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         f
		 * 登录检查
		 * 本地获取不到存取的用户，跳转到登录页面不作处理，跳转到其他页面需要返回登录页面
		 * 本地获取到存取的用户，跳转到其他页面不作处理，跳转到登录页面需要进入主界面
		 */
		$rootScope.$on('$stateChangeStart', function(event, toState) {
			// console.log(toState)
			if (!localStorageService.get('user')) {
				if (toState.url != '/login') {
					event.preventDefault() //阻止路由跳转(不执行当前路由控制器里的代码)
					toastr.warning('请先登录！')
					$state.go('login')
				}
			} else {
				if (toState.url === '/login') {
					event.preventDefault()
					$state.go('main.list')
				}
			}
		})
	}
})()
