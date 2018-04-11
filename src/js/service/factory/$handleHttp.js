;(function() {
	'use strict'

	angular
		.module('app')
		.factory('$handleHttp', function(
			$httpFactory,
			AreYouSure,
			toastr,
			$timeout,
			$state,
			localStorageService
		) {
			var user = localStorageService.get('user')
			// if (!user) {
			// 	$state.go('login')
			// 	return
			// }

			function handleHttp(param, name, handle, errorTip) {
				errorTip = errorTip ? errorTip : '加载失败，请稍后再试。'
				if (name != 'login') {
					var user = localStorageService.get('user')
					$httpFactory.setToken(user.token)
				}
				$httpFactory[name](param)
					.then(function(res) {
						console.log(name, 'res', res)
						var code = res.data.code
						var message = res.data.message
						if (code === 0) {
							handle(res)
						} else if (code === 2) {
							toastr.error(message)
							$timeout(function() {
								localStorageService.remove('user')
								$state.go('login')
							}, 1500)
						} else {
							AreYouSure.close()
							toastr.error(message)
						}
					})
					.catch(function(error) {
						console.log('error', error)
						toastr.error(errorTip)
					})
			}
			return {
				handleHttp: handleHttp
			}
		})
})()
