;(function() {
	'use strict'

	angular
		.module('app')
		.controller('userCtrl', function(
			$scope,
			$rootScope,
			$timeout,
			localStorageService,
			ngDialog,
			toastr,
			$state,
			Http2,
			$httpFactory,
			$handleHttp,
			$utilFactory,
			AreYouSure,
			Loading,
			AddUserDialog
		) {
			var global = {}
			init()
			function init() {
				initGlobal()
				initSettingMenu()
				initPagination()
				initAddOperatorData()
				initEditOperatorData()
				initSearchData()
				getOperatorList()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
			}
			function initSettingMenu() {
				$rootScope.settingMenu = 1
			}
			function initPagination() {
				$scope.pagination = {
					totalItems: 0,
					maxSize: 5,
					aPageNumber: 15,
					currentPage: 1,
					numPages: 0
				}
			}
			function initAddOperatorData() {
				$scope.addOperatorData = {
					role: {}
				}
			}
			function initEditOperatorData() {
				$scope.editOperatorData = {
					password: '没有修改密码',
					passwordAgain: '没有修改密码',
					role: {}
				}
			}
			function initSearchData() {
				$scope.searchData = {}
			}
			function getOperatorList() {
				var params = {
					pageSize: $scope.pagination.aPageNumber,
					pageCurrent: $scope.pagination.currentPage,
					method: 'POST',
					handle: handleGetOperatorList,
					handleError: handleGetOperatorListError
				}
				Loading.open()
				Http2.getOperatorList(params)
			}

			function handleGetOperatorList(res) {
				Loading.close()
				var code = res.data.code
				var message = res.data.message
				if (code === 0) {
					var operatorList = res.data.data.list
					if (operatorList.length == 0) {
						$scope.operatorList = []
						toastr.info('暂无用户。')
						return
					}
					operatorList.forEach(function(operator, index) {
						operator.index = index
						operator.check = false
					})
					$scope.operatorList = operatorList
					$scope.pagination.totalItems = res.data.data.total
					$scope.pagination.numPages = res.data.data.pages
				} else {
					toastr.warning(message)
				}
			}
			function handleGetOperatorListError(error) {
				toastr.error('加载数据出错，请稍后再试。')
			}

			$scope.startSearch = startSearch
			function startSearch() {
				var realName = $scope.searchData.realName
				if (
					!$utilFactory.check.checkChineseCharacter(realName) ||
					!$utilFactory.exist(realName)
				) {
					toastr.error('用户名请输入汉字。')
					return
				}
				initPagination()
				global.realName = realName
				global.isSearching = true
				getOperatorListBySearch()
			}
			function getOperatorListBySearch() {
				var params = {
					pageSize: $scope.pagination.aPageNumber,
					pageCurrent: $scope.pagination.currentPage,
					method: 'POST',
					search: encodeURI(
						JSON.stringify({
							realName: global.realName
						})
					),
					handle: handleGetOperatorList,
					handleError: handleGetOperatorListError
				}
				Loading.open()
				Http2.getOperatorListBySearch(params)
			}
			$scope.clearSearch = clearSearch
			function clearSearch() {
				if (!$utilFactory.exist($scope.searchData.realName)) {
					return
				}
				if (
					!$utilFactory.check.checkChineseCharacter(
						$scope.searchData.realName
					) ||
					!$utilFactory.exist($scope.searchData.realName)
				) {
					initSearchData()
					return
				}
				global.isSearching = false
				initSearchData()
				initPagination()
				getOperatorList()
			}

			$scope.pageChange = pageChange
			function pageChange() {
				if (global.isSearching) {
					getOperatorListBySearch()
				} else {
					getOperatorList()
				}
			}

			$scope.startAddOperator = startAddOperator
			function startAddOperator() {
				AddUserDialog.open($scope)
			}

			$scope.cancelAddOperator = cancelAddOperator
			function cancelAddOperator() {
				AddUserDialog.close()
				initAddOperatorData()
			}

			$scope.certainAddOperator = certainAddOperator
			function certainAddOperator() {
				console.log('addOperatorData', $scope.addOperatorData)
				var realName = $scope.addOperatorData.realName
				var loginName = $scope.addOperatorData.loginName
				var password = $scope.addOperatorData.password
				var passwordAgain = $scope.addOperatorData.passwordAgain
				var role = $scope.addOperatorData.role
				if (
					!$utilFactory.exist(realName) ||
					!$utilFactory.check.checkChineseCharacter(realName) ||
					!$utilFactory.check.checkLoginName(loginName) ||
					!$utilFactory.exist(password) ||
					!$utilFactory.check.checkPassword(password) ||
					!$utilFactory.exist(role.id)
				) {
					toastr.error('请填写正确的用户信息')
					return
				}
				if (password != passwordAgain) {
					toastr.error('两次密码不一致。')
					return
				}
				var data = {
					json: JSON.stringify({
						realName: realName,
						loginName: loginName,
						password: password,
						role: role
					})
				}
				addOperator(data)
			}
			function addOperator(data) {
				$httpFactory.setToken(global.token)
				$httpFactory
					.addOperator(data)
					.then(function(res) {
						console.log('res', res)
						var code = res.data.code
						var message = res.data.message
						if (code === 0) {
							if (message === '处理成功') {
								toastr.success(message)
								AddUserDialog.close()
								initAddOperatorData()
								getOperatorList()
							} else {
								toastr.error(message)
							}
						} else if (code === 2) {
							toastr.error(message)
							localStorageService.remove('user')
							$timeout(function() {
								$state.go('login')
							}, 1500)
						}
					})
					.catch(function(error) {
						console.log('error', error)
						toastr.error('添加失败，请您稍后再试。')
					})
			}

			$scope.chooseAll = chooseAll
			function chooseAll($event) {
				$scope.operatorList.forEach(function(item) {
					item.check = $scope.hasChooseAll
				})
			}

			function openEditOperatorDialog() {
				global.editOperatorDialog = ngDialog.open({
					templateUrl: 'views/template/editOperator.html',
					className: 'ngdialog-theme-default add-operator',
					showClose: false,
					overlay: true,
					closeByDocument: false,
					scope: $scope
				})
			}
			function closeEditOperatorDialog() {
				if (
					global.editOperatorDialog &&
					global.editOperatorDialog.close
				) {
					global.editOperatorDialog.close()
				}
			}

			$scope.startEditOperator = startEditOperator
			function startEditOperator(operator) {
				$scope.editOperatorData.id = operator.id
				$scope.editOperatorData.loginName = operator.loginName
				$scope.editOperatorData.realName = operator.realName
				$scope.roleList.forEach(function(item) {
					if (item.id === operator.role.id) {
						$scope.editOperatorData.role = item
					}
				})
				console.log('editOperatorData', $scope.editOperatorData)
				openEditOperatorDialog()
			}
			$scope.cancelEditOperator = cancelEditOperator
			function cancelEditOperator() {
				initEditOperatorData()
				closeEditOperatorDialog()
			}
			$scope.certainEditOperator = certainEditOperator
			function certainEditOperator() {
				console.log('addOperatorData', $scope.editOperatorData)
				var id = $scope.editOperatorData.id
				var realName = $scope.editOperatorData.realName
				var loginName = $scope.editOperatorData.loginName
				var password = $scope.editOperatorData.password
				var passwordAgain = $scope.editOperatorData.passwordAgain
				var role = $scope.editOperatorData.role
				if (
					!$utilFactory.exist(realName) ||
					!$utilFactory.check.checkChineseCharacter(realName) ||
					!$utilFactory.check.checkLoginName(loginName) ||
					!$utilFactory.exist(role.id)
				) {
					toastr.error('请填写正确的用户信息')
					return
				}
				if (
					password != '没有修改密码' &&
					(!$utilFactory.exist(password) ||
						!$utilFactory.check.checkPassword(password))
				) {
					toastr.error('请填写正确的用户信息')
					return
				}
				if (password != passwordAgain) {
					toastr.error('两次密码不一致')
					return
				}
				if (password === '没有修改密码') {
					password = null
				}
				var data = {
					json: JSON.stringify({
						id: id,
						realName: realName,
						loginName: loginName,
						role: role
					})
				}
				editOperator(data)
			}
			function editOperator(data) {
				$httpFactory.setToken(global.token)
				$httpFactory
					.addOperator(data)
					.then(function(res) {
						var code = res.data.code
						var message = res.data.message
						if (code === 0) {
							if (message === '处理成功') {
								toastr.success(message)
								closeEditOperatorDialog()
								initEditOperatorData()
								getOperatorList()
							} else {
								toastr.error(message)
							}
						} else if (code === 2) {
							toastr.error(message)
							localStorageService.remove('user')
							$timeout(function() {
								$state.go('login')
							}, 1500)
						}
					})
					.catch(function(error) {
						console.log('error', error)
						toastr.error('修改失败，请您稍后再试。')
					})
			}

			$scope.startDelete = startDelete
			function startDelete(operator) {
				$scope.areYouSureTip =
					'您确定删除用户' + operator.realName + '?'
				global.idList = [
					{
						id: operator.id
					}
				]
				AreYouSure.open($scope)
			}
			$scope.sure = function() {
				var data = {
					json: JSON.stringify(global.idList)
				}
				$handleHttp.handleHttp(
					{
						data: data
					},
					'deleteOperator',
					handleDeleteOperator,
					'删除失败，请您稍后再试'
				)
			}
			$scope.cancel = function() {
				AreYouSure.close()
			}

			function handleDeleteOperator(res) {
				var message = res.data.message
				toastr.success(message)
				AreYouSure.close()
				getOperatorList()
			}

			$scope.startBatchDelete = startBatchDelete
			function startBatchDelete() {
				var idList = []
				$scope.operatorList.forEach(function(item) {
					if (item.check === true) {
						idList.push({
							id: item.id
						})
					}
				})
				if (idList.length === 0) {
					toastr.warning('请选择您要删除的用户。')
					return
				}
				$scope.areYouSureTip = '您确定删除选定的用户吗？'
				global.idList = idList
				AreYouSure.open($scope)
			}

			$scope.startBindProject = startBindProject
			function startBindProject(operator) {
				localStorageService.set('id', operator.id)
				openBindProjectDialog(operator)
			}
			function openBindProjectDialog(operator) {
				global.bindProjectDialog = ngDialog.open({
					templateUrl: 'views/template/bindProject.html',
					className: 'ngdialog-theme-default bind-project',
					showClose: true,
					overlay: true,
					closeByDocument: false,
					controllerAs: 'bindProjectCtrl',
					data: operator
				})
			}
			function closeBindProjectDialog() {
				if (
					global.bindProjectDialog &&
					global.bindProjectDialog.close
				) {
					global.bindProjectDialog.close()
				}
			}
		})
})()
