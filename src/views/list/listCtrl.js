;(function() {
	'use strict'
	angular.module('app').controller('listCtrl', listCtrl)

	function listCtrl(
		$scope,
		$state,
		toastr,
		localStorageService,
		Util,
		Http,
		Loading,
		AddProjectDialog,
		Constant,
		Reg,
		Check,
		ProjectList,
		ConstructTypeList
	) {
		$scope.showSearch = true
		$scope.searchData = {}
		$scope.pageData = {}
		$scope.addProjectData = {
			constructType: {}
		}
		$scope.pagination = {
			totalItems: 0,
			maxSize: 5,
			aPageNumber: 15,
			currentPage: 1
		}
		$scope.pageChange = pageChange
		$scope.search = search
		$scope.goToPage = goToPage
		$scope.addProject = addProject
		$scope.certainAddProject = certainAddProject
		$scope.cancelAddProject = cancelAddProject
		init()
		function init() {
			getConstructTypeList()
			getProjectList()
		}
		function getProjectList() {
			Loading.open()
			var search = encodeURI(
				JSON.stringify({
					name: $scope.searchData.name
				})
			)
			var pageSize = $scope.pagination.aPageNumber
			var pageCurrent = $scope.pagination.currentPage
			ProjectList.getProjectList(search, pageSize, pageCurrent).then(
				function(res) {
					if (res) {
						$scope.projectList = res.projectList
						$scope.pagination.totalItems = res.totalItems
						$scope.pagination.numPages = res.numPages
						if ($scope.projectList.length === 0) {
							toastr.warning('暂无项目。')
						}
					}
				}
			)
		}
		function getConstructTypeList() {
			ConstructTypeList.getConstructTypeList().then(function(res) {
				if (res) {
					$scope.constructTypeList = res.constructTypeList
				}
			})
		}
		function pageChange() {
			getProjectList()
		}
		function search() {
			$scope.pagination.currentPage = 1
			getProjectList()
		}
		function goToPage() {
			if (!Reg.isNumber($scope.pageData.page)) {
				toastr.warning('页数请输入数字。')
			} else {
				$scope.pagination.currentPage = $scope.pageData.page
				getProjectList()
			}
		}
		function addProject() {
			AddProjectDialog.open($scope)
		}
		function certainAddProject() {
			if (Check.checkAddProjectData($scope.addProjectData)) {
			}
		}
		function cancelAddProject() {
			AddProjectDialog.close()
		}
	}
})()
