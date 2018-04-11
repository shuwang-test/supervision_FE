;(function() {
	'use strict'
	angular.module('app').factory('Http', Http)
	function Http(
		$http,
		$timeout,
		$state,
		localStorageService,
		toastr,
		Constant,
		Loading,
		AreYouSure
	) {
		var setDefaultsHeaders = function() {
			$http.defaults.headers.post = {
				'Content-Type':
					'application/x-www-form-urlencoded;charset=utf-8'
			}
			$http.defaults.headers.common.token = localStorageService.get(
				'token'
			)
		}
		var send = function(options, url, method) {
			var url = Constant.domainName + url
			var params = options.params
			var handle = options.handle
			var handleError = options.handleError
			if (!method) {
				method = 'GET'
			}
			var req = {
				url: url,
				method: method
			}
			if (typeof params === 'object') {
				req.params = params
			}
			console.log(url, method, params)
			setDefaultsHeaders()
			return $http(req)
				.then(function(res) {
					console.log(url, 'res', res)
					Loading.close()
					AreYouSure.close()
					if (res.data.code === 2) {
						toastr.warning(res.data.message)
						$timeout(function() {
							localStorageService.remove('user')
							$state.go('login')
						}, Constant.toastrTimeOut)
					} else {
						handle && handle(res)
						return res
					}
				})
				.catch(function(error) {
					console.log(url, 'http error:', error)
					Loading.close()
					AreYouSure.close()
					if (handleError) {
						handleError()
					} else {
						toastr.error('连接服务器出错，请您稍后再试。')
					}
				})
		}

		return {
			login: function(options) {
				var url = 'api/login'
				return send(options, url, 'POST')
			},
			getProjectList: function(options) {
				var url =
					'api/project/list?search=' +
					options.search +
					'&pageSize=' +
					options.pageSize +
					'&pageCurrent=' +
					options.pageCurrent
				return send(options, url)
			},
			addNewProject: function(options) {
				var url = 'api/project/insert'
				return send(options, url, 'POST')
			},
			updateProject: function(options) {
				var url = 'api/project/update'
				return send(options, url, 'POST')
			},
			getConstructTypeList: function() {
				var url = 'api/enum/arr/project/constructType'
				return send({}, url)
			},
			getProjectDetail: function(options) {
				var url = 'api/project/get?id=' + options.projectId
				return send(options, url)
			},
			getProposalList: function(options) {
				var url =
					'api/prepare/proposal/find?projectId=' + options.projectId
				return send(options, url)
			},
			getPermissionList: function(options) {
				var url = 'api/power/role/list?content=' + options.content
				return send(options, url)
			},
			getRoleMenuList: function(options) {
				var url
				if (options.parentId) {
					url =
						'api/power/findMenu?roleId=' +
						options.roleId +
						'&parentId=' +
						options.parentId
				} else {
					url = 'api/power/findMenu?roleId=' + options.roleId
				}
				return send(options, url)
			},
			getProgressList: function(options) {
				var url = 'api/progress/find?content=' + options.content
				return send(options, url)
			}
		}
	}
})()
