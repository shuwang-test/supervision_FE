;(function() {
	'use strict'
	angular
		.module('app')
		.controller('auditCtrl', function(
			$scope,
			$rootScope,
			$timeout,
			$state,
			toastr,
			ngDialog,
			Upload,
			localStorageService,
			Constant,
			Http2,
			Permission,
			Loading,
			$utilFactory
		) {
			{
				$rootScope.currentMenu = 6

				$scope.searchData = {}
				$scope.goToPageData = {}
				$scope.user = localStorageService.get('user')
				$scope.projectId = localStorageService.get('projectId')
				initPagination()
				getContractList()
				$scope.toDetail = toDetail
				$scope.toSign = toSign
				$scope.toPay = toPay
				$scope.closeContractDetail = closeContractDetail
				$scope.createContract = createContract
				$scope.closeCreateContract = closeCreateContract
				$scope.ensureCreateContract = ensureCreateContract

				$scope.startSearch = startSearch
				$scope.clearSearch = clearSearch

				$scope.goToPage = goToPage
			}

			function initPagination() {
				$scope.pagination = {
					totalItems: 0,
					maxSize: 5,
					aPageNumber: 10,
					currentPage: 1
				}
			}

			function getContractList() {
				var params = {
					search: encodeURI(
						JSON.stringify({
							name: $scope.searchData.name
						})
					),
					pageSize: $scope.pagination.aPageNumber,
					pageCurrent: $scope.pagination.currentPage,
					handle: getContractListSuccess,
					handleError: getContractListFail
				}
				Loading.open('努力加载中......')
				Http2.getContractList(params)
			}

			function getContractListSuccess(res) {
				Loading.close()
				if (res.data.code === 0) {
					$scope.contractList = res.data.data.list
					if ($scope.contractList.length == 0) {
						toastr.info('暂无合同。')
						return
					}
					$scope.contractList.forEach(function(item, index) {
						$scope.contractList[index] = {
							index: index + 1,
							id: item.id,
							name: item.name,
							num: item.num,
							typeName: item.typeName,
							sum: item.sum,
							status: item.status,
							createDate: $utilFactory.getDate(item.createDate),
							statusName: item.statusName
						}
					})
					console.log('contractList', $scope.contractList)
					$scope.pagination.totalItems = res.data.data.total
					$scope.pagination.numPages = res.data.data.pages
				} else {
					toastr.warning(res.data.message)
				}
			}

			function getContractListFail(error) {
				toastr.error('加载数据出错，请稍后再试。')
			}

			//查看--查看合同详情及会签过程
			function toDetail(contract) {
				var params = {
					id: contract.id,
					handle: toDetailSuccess,
					handleError: toDetailFail
				}
				Http2.getContract(params)
			}

			function toDetailSuccess(res) {
				if (res.data.code === 0) {
					$scope.contract = res.data.data
					$scope.countersignList = $scope.contract.countersignList
					$scope.countersignList.forEach(function(item, index) {
						$scope.countersignList[index] = {
							index: index + 1,
							userName: item.userName,
							sourceUserName: item.sourceUserName,
							statusName: item.statusName,
							createDate: $utilFactory.getDate(item.createDate),
							updateDate: $utilFactory.getDate(item.updateDate),
							opinion: item.opinion
						}
					})
					$scope.contractDetailDialog = ngDialog.open({
						templateUrl: 'views/template/contractDetail.html',
						className: 'ngdialog-theme-default contract',
						showClose: false,
						overlay: true,
						closeByDocument: false,
						scope: $scope
					})
				} else {
					toastr.warning(res.data.message)
				}
			}

			function toDetailFail(error) {
				toastr.error('加载数据出错，请稍后再试。')
			}

			//会签（审计）---发起会签（发起审计）
			function toSign(contract) {
				if (contract.status != 1 && contract.status != 4) {
					//状态1是发起会签，状态4是发起审计
					console.log('return,status=' + contract.status)
					return
				}
				console.log('toSign,status=' + contract.status)
			}

			//支付--发起支付
			function toPay(contract) {
				if (contract.status != 7) {
					//状态7是发起支付
					console.log('return,status=' + contract.status)
					return
				}
				console.log('toPay,status=' + contract.status)
			}

			function closeContractDetail() {
				if ($scope.contractDetailDialog) {
					$scope.contractDetailDialog.close()
				}
			}

			function createContract() {
				$scope.contractData = {}
				getConstructType()
				$scope.createContractDialog = ngDialog.open({
					templateUrl: 'views/template/addContract.html',
					className: 'ngdialog-theme-default contract',
					showClose: false,
					overlay: true,
					closeByDocument: false,
					scope: $scope
				})
			}

			function closeCreateContract() {
				if ($scope.createContractDialog) {
					$scope.createContractDialog.close()
				}
			}

			function ensureCreateContract() {
				console.log($scope.contractData)
				var name = $scope.contractData.name
				var num = $scope.contractData.num
				var userId = $scope.user.id
				var sum = $scope.contractData.sum
				var type = $scope.contractData.type
					? $scope.contractData.type.type
					: null
				if (
					!$utilFactory.check.checkChineseCharacter(name) ||
					!$utilFactory.check.checkNumber(num) ||
					!$utilFactory.check.checkNumber(sum)
				) {
					toastr.error('请填写正确的合同信息！')
					return
				}

				if (
					!$utilFactory.exist(name) ||
					!$utilFactory.exist(num) ||
					!$utilFactory.exist(sum) ||
					!$utilFactory.exist(type)
				) {
					toastr.warning('请填写完整的合同信息！')
					return
				}

				var content = {
					projectId: $scope.projectId,
					name: name,
					userId: userId,
					num: num,
					sum: sum,
					type: type
				}
				var data = {
					content: JSON.stringify(content)
				}
				var params = {
					method: 'POST',
					data: data,
					handle: ensureCreateContractSuccess
				}
				Http2.createContract(params)
			}

			function ensureCreateContractSuccess(res) {
				Loading.close()
				if (res.data.code === 0) {
					toastr.success(res.data.message)
					closeCreateContract()
					getContractList()
				} else {
					toastr.warning(res.data.message)
				}
			}

			function getConstructType() {
				var params = {
					handle: getContractTypeListSuccess
				}
				Http2.getContractTypeList(params)
			}

			function getContractTypeListSuccess(res) {
				$scope.contractTypeList = []
				Object.keys(res.data).forEach(function(item, index, array) {
					$scope.contractTypeList[index] = {
						type: item,
						title: res.data[item]
					}
				})
			}

			function startSearch() {
				if (!$scope.showSearch) {
					$scope.showSearch = !$scope.showSearch
					return
				}
				if (!$utilFactory.exist($scope.searchData.name)) {
					$scope.showSearch = false
					return
				}
				getContractList()
			}

			function clearSearch() {
				if (!$scope.showSearch) {
					return
				}
				$scope.searchData = {}
				initPagination()
				getContractList()
			}

			function goToPage() {
				if (!$utilFactory.exist($scope.goToPageData.page)) {
					toastr.warning('请填写要跳转到哪一页！')
					return
				}
				if (!$utilFactory.check.checkNumber($scope.goToPageData.page)) {
					toastr.warning('页数请输入数字')
					return
				}
				$scope.pagination.currentPage = $scope.goToPageData.page
				getContractList()
			}
		})
})()
