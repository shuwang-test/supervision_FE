;(function() {
	'use strict'

	angular
		.module('app')
		.controller('bindProjectCtrl', function(
			$handleHttp,
			$scope,
			toastr,
			ngDialog,
			localStorageService,
			Http,
			$utilFactory
		) {
			var global = {}
			init()
			function init() {
				initGlobal()
				initPagination1()
				initPagination2()
				initPageData()
				initBindProjectList()
				initUnBindProjectList()
			}
			function initGlobal() {
				global.id = localStorageService.get('id')
			}
			function initPagination1() {
				$scope.pagination1 = {
					totalItems: 0,
					maxSize: 5,
					aPageNumber: 10,
					currentPage: 1,
					numPages: 0
				}
			}
			$scope.pagination1.pageChange = function() {
				initBindProjectList()
			}
			$scope.goToPage1 = goToPage1
			function goToPage1() {
				if (!$utilFactory.check.checkNumber($scope.pageData.page1)) {
					toastr.error('页数必须是数字。')
					return
				}
				if ($scope.pageData.page1 > $scope.pagination1.numPages) {
					toastr.error('页数超过限制')
					return
				}
				$scope.pagination1.currentPage = $scope.pageData.page1
				initBindProjectList()
			}

			function initPagination2() {
				$scope.pagination2 = {
					totalItems: 0,
					maxSize: 5,
					aPageNumber: 10,
					currentPage: 1,
					numPages: 0
				}
			}
			$scope.pagination2.pageChange = function() {
				initUnBindProjectList()
			}

			$scope.goToPage2 = goToPage2
			function goToPage2() {
				if (!$utilFactory.check.checkNumber($scope.pageData.page2)) {
					toastr.error('页数必须是数字。')
					return
				}
				if ($scope.pageData.page2 > $scope.pagination2.numPages) {
					toastr.error('页数超过限制')
					return
				}
				$scope.pagination2.currentPage = $scope.pageData.page2
				initUnBindProjectList()
			}

			function initPageData() {
				$scope.pageData = {}
			}
			function initBindProjectList() {
				$handleHttp.handleHttp(
					{
						id: global.id,
						pageCurrent: $scope.pagination1.currentPage,
						pageSize: $scope.pagination1.aPageNumber
					},
					'getBindProjectList',
					handleGetBindProjectList
				)
			}

			function initUnBindProjectList() {
				$handleHttp.handleHttp(
					{
						id: global.id,
						pageCurrent: $scope.pagination2.currentPage,
						pageSize: $scope.pagination2.aPageNumber
					},
					'getUnBindProjectList',
					handleGetUnBindProjectList
				)
			}

			function handleGetBindProjectList(res) {
				var message = res.data.message
				$scope.bindProjectList = res.data.data.list
				$scope.pagination1.totalItems = res.data.data.total
				$scope.pagination1.numPages = res.data.data.pages
			}

			function handleGetUnBindProjectList(res) {
				var message = res.data.message
				$scope.unBindProjectList = res.data.data.list
				$scope.pagination2.totalItems = res.data.data.total
				$scope.pagination2.numPages = res.data.data.pages
			}

			$scope.bindProject = bindProject
			function bindProject(project) {
				var content = {
					userId: global.id,
					projectId: project.id
				}
				var data = {
					content: JSON.stringify(content)
				}
				$handleHttp.handleHttp(
					{
						data: data
					},
					'bindProject',
					handleBindProject
				)
			}
			function handleBindProject(res) {
				var message = res.data.message
				initBindProjectList()
				initUnBindProjectList()
			}
			$scope.unBindProject = unBindProject
			function unBindProject(project) {
				var content = {
					userId: global.id,
					projectId: project.id
				}
				var data = {
					content: JSON.stringify(content)
				}
				$handleHttp.handleHttp(
					{
						data: data
					},
					'unBindProject',
					handleUnBindProject
				)
			}
			function handleUnBindProject(res) {
				var message = res.data.message
				initBindProjectList()
				initUnBindProjectList()
			}

			$scope.showProjectDetail = showProjectDetail
			function showProjectDetail(project) {
				var params = {
					projectId: project.id,
					handle: handleGetProjectDetail
				}
				Http.getProjectDetail(params)
			}
			function handleGetProjectDetail(res) {
				var code = res.data.code
				var message = res.data.message
				if (code === 0) {
					$scope.project = res.data.data
					$scope.project.startDate = $utilFactory.getDate(
						res.data.data.startDate
					)
				} else {
					toastr.error(message)
				}
				openProjectDetailDialog()
			}

			function openProjectDetailDialog() {
				global.projectDetailDialog = ngDialog.open({
					templateUrl: 'views/template/projectDetail.html',
					className: 'ngdialog-theme-default add-project',
					showClose: true,
					overlay: true,
					closeByDocument: true,
					scope: $scope
				})
			}
		})
})()
