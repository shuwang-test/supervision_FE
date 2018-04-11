;(function() {
	'use strict'
	angular
		.module('app')
		.factory('Http2', function(
			$http,
			$timeout,
			$state,
			localStorageService,
			toastr,
			Loading,
			Constant
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
			var send = function(params) {
				var urlFragment = params.urlFragment
				var method = params.method
				var data = params.data
				var handle = params.handle
				var handleError = params.handleError
				if (urlFragment != 'api/login') {
					//调用非登录接口，设置请求头
					setDefaultsHeaders()
				}
				var url = Constant.domainName + urlFragment
				if (!method) {
					method = 'GET'
				}
				var req
				if (typeof data === 'object') {
					req = {
						url: url,
						method: method,
						params: data
					}
				} else if (typeof data === 'undefined') {
					req = {
						url: url,
						method: method
					}
				}
				console.log('url', url)
				console.log('method', method)
				console.log('data', data)
				$http(req)
					.then(function(res) {
						console.log('res', res)
						if (res.data.code === 2) {
							Loading.close()
							toastr.warning('token过期，请重新登录。')
							$timeout(function() {
								localStorageService.remove('user')
								$state.go('login')
							}, Constant.toastrTimeOut)
						} else {
							handle(res)
						}
					})
					.catch(function(error) {
						console.log('http error：', error)
						Loading.close()
						if (handleError) {
							handleError()
						} else {
							toastr.error('操作失败，请您稍后再试。')
						}
					})
			}
			return {
				login: function(params) {
					params.urlFragment = 'api/login'
					send(params)
				},
				getPermissionList: function(params) {
					params.urlFragment =
						'api/power/role/list?content=' + params.content
					send(params)
				},
				modifyPassword: function(params) {
					params.urlFragment = 'api/modifyPass'
					send(params)
				},
				getConstructTypeList: function(params) {
					params.urlFragment = 'api/enum/arr/project/constructType'
					send(params)
				},
				getProjectList: function(params) {
					params.urlFragment =
						'api/project/list?search=' +
						params.search +
						'&pageSize=' +
						params.pageSize +
						'&pageCurrent=' +
						params.pageCurrent
					send(params)
				},
				addProject: function(params) {
					params.urlFragment = 'api/project/insert'
					send(params)
				},
				getProjectDetail: function(params) {
					params.urlFragment =
						'api/project/get?id=' + params.projectId
					send(params)
				},
				getOperatorList: function(params) {
					var pageSize = params.pageSize
					var pageCurrent = params.pageCurrent
					params.urlFragment =
						'api/operator/list?pageSize=' +
						pageSize +
						'&pageCurrent=' +
						pageCurrent
					send(params)
				},
				getOperatorListBySearch: function(params) {
					var pageSize = params.pageSize
					var pageCurrent = params.pageCurrent
					var search = params.search
					params.urlFragment =
						'api/operator/list?pageSize=' +
						pageSize +
						'&pageCurrent=' +
						pageCurrent +
						'&search=' +
						search
					send(params)
				},
				getContractList: function(params) {
					params.urlFragment =
						'api/contract/list?search=' +
						params.search +
						'&pageSize=' +
						params.pageSize +
						'&pageCurrent=' +
						params.pageCurrent
					send(params)
				},
				getContractTypeList: function(params) {
					params.urlFragment = 'api/enum/arr/contract/type'
					send(params)
				},
				createContract: function(params) {
					params.urlFragment = 'api/contract/insert'
					send(params)
				},
				getContract: function(params) {
					params.urlFragment = 'api/contract/get?id=' + params.id
					send(params)
				},
				getContractSubList: function(params) {
					params.urlFragment =
						'api/contractSub/list?search=' +
						params.search +
						'&pageSize=' +
						params.pageSize +
						'&pageCurrent=' +
						params.pageCurrent
					send(params)
				},
				getContractSub: function(params) {
					params.urlFragment = 'api/contractSub/get?id=' + params.id
					send(params)
				}
			}
		})
})()
