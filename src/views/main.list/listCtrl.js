;(function() {
	'use strict'
	angular.module('app').controller('listCtrl', listCtrl)

	function listCtrl(
		$scope,
		$state,
		toastr,
		localStorageService,
		Upload,
		Util,
		Http,
		Loading,
		AddProjectDialog,
		Constant,
		Reg,
		Check,
		ProjectList,
		ConstructTypeList,
		Permission
	) {
		$scope.showSearch = true
		$scope.searchData = {}
		$scope.pageData = {}
		$scope.addProjectData = {
			constructType: {},
			effectPicList: [],
			licenceList: []
		}
		$scope.format = 'yyyy/MM/dd'
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		}
		$scope.startTime = {
			show: false
		}
		$scope.showStartTime = showStartTime
		$scope.pagination = {
			totalItems: 0,
			maxSize: 5,
			aPageNumber: 15,
			currentPage: 1
		}
		$scope.pageChange = pageChange
		$scope.search = search
		$scope.goToPage = goToPage
		$scope.goToDetail = goToDetail
		$scope.addProject = addProject
		$scope.certainAddProject = certainAddProject
		$scope.cancelAddProject = cancelAddProject
		$scope.uploadEffectPic = uploadEffectPic
		$scope.uploadLicence = uploadLicence
		$scope.deleteEffectPic = deleteEffectPic
		$scope.deleteLicence = deleteLicence
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
		function showStartTime() {
			$scope.startTime.show = true
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
		function goToDetail(projectId) {
			localStorageService.set('projectId', projectId)
			if (Permission.userHasPermission('项目详情')) {
				$state.go('main.detail.project')
				return
			}
			if (Permission.userHasPermission('前期阶段')) {
				if (Permission.userHasPermission('项目立项书')) {
					$state.go('main.detail.earlly.proposal')
				} else if (Permission.userHasPermission('可研报告')) {
					$state.go('main.detail.earlly.report')
				} else if (Permission.userHasPermission('初步设计方案及审批')) {
					$state.go('main.detail.earlly.designPlan')
				} else if (Permission.userHasPermission('施工方案及审批')) {
					$state.go('main.detail.earlly.constructPlan')
				} else if (Permission.userHasPermission('规划许可证')) {
					$state.go('main.detail.earlly.planPermission')
				} else if (Permission.userHasPermission('施工许可证')) {
					$state.go('main.detail.earlly.constructPermission')
				}
				return
			}
			if (Permission.userHasPermission('现场状况 ')) {
				if (Permission.userHasPermission('人员出勤状况')) {
					$state.go('main.detail.living.attendance')
				} else if (Permission.userHasPermission('监管状况')) {
					$state.go('main.detail.living.supervision')
				} else if (Permission.userHasPermission('安全状况')) {
					$state.go('main.detail.living.safety')
				}
				return
			}
			if (Permission.userHasPermission('项目进度')) {
				if (Permission.userHasPermission('计划进度')) {
					$state.go('main.detail.progress.planProgress')
				} else if (Permission.userHasPermission('实际进度')) {
					$state.go('main.detail.progress.actualProgress')
				} else if (Permission.userHasPermission('进度对比照')) {
					$state.go('main.detail.progress.compareProgress')
				}
				return
			}
			toastr.warning('抱歉，您没有权限查看。')
		}
		function addProject() {
			AddProjectDialog.open($scope)
		}
		function uploadEffectPic(files, invalidFiles) {
			console.log(files, invalidFiles)
			if (invalidFiles && invalidFiles.length > 0) {
				toastr.error('文件类型错误。')
				return
			}
			if (!files || files.length === 0) {
				toastr.warning('请选择图片。')
				return
			}
			$scope.addProjectData.effectPicList = $scope.addProjectData.effectPicList.concat(
				files
			)
		}
		function uploadLicence(files, invalidFiles) {
			console.log(files, invalidFiles)
			if (invalidFiles && invalidFiles.length > 0) {
				toastr.error('文件类型错误。')
				return
			}
			if (!files || files.length === 0) {
				toastr.warning('请选择图片。')
				return
			}
			$scope.addProjectData.licenceList = $scope.addProjectData.licenceList.concat(
				files
			)
		}
		function deleteEffectPic(effectPic) {
			var index = $scope.addProjectData.effectPicList.indexOf(effectPic)
			$scope.addProjectData.effectPicList.splice(index, 1)
		}
		function deleteLicence(licence) {
			var index = $scope.addProjectData.licenceList.indexOf(licence)
			$scope.addProjectData.licenceList.splice(index, 1)
		}

		function certainAddProject() {
			if (!Check.checkAddProjectData($scope.addProjectData)) {
				return
			} else {
				Loading.open('努力新建中......')
				var url = Constant.domainName + '/api/upload?dir=project'
				var effectPicList = ''
				var licenceList = ''
				$scope.addProjectData.effectPicList.forEach(function(
					effectPic
				) {
					Upload.upload({
						url: url,
						data: {
							file: effectPic
						}
					})
						.then(function(res) {
							effectPicList += res.data.data + ','
							effectPic.hasUploadSuccess = true
							var effectPicFlag = $scope.addProjectData.effectPicList.every(
								function(effectPic) {
									return (
										effectPic.hasUploadSuccess === true ||
										effectPic.hasUploadError === true
									)
								}
							)
							var licenceFlag = $scope.addProjectData.licenceList.every(
								function(licence) {
									return (
										licence.hasUploadSuccess === true ||
										licence.hasUploadError === true
									)
								}
							)
							if (effectPicFlag && licenceFlag) {
								uploadProject(effectPicList, licenceList)
							}
						})
						.catch(function(error) {
							console.log('upload effectPic Error', error)
							effectPic.hasUploadError = true
						})
				})
				$scope.addProjectData.licenceList.forEach(function(licence) {
					Upload.upload({
						url: url,
						data: {
							file: licence
						}
					})
						.then(function(res) {
							licenceList += res.data.data + ','
							licence.hasUploadSuccess = true
							var effectPicFlag = $scope.addProjectData.effectPicList.every(
								function(effectPic) {
									return (
										effectPic.hasUploadSuccess === true ||
										effectPic.hasUploadError === true
									)
								}
							)
							var licenceFlag = $scope.addProjectData.licenceList.every(
								function(licence) {
									return (
										licence.hasUploadSuccess === true ||
										licence.hasUploadError === true
									)
								}
							)
							if (effectPicFlag && licenceFlag) {
								uploadProject(effectPicList, licenceList)
							}
						})
						.catch(function(error) {
							console.log('upload licence Error', error)
							licence.hasUploadError = true
						})
				})
			}
		}
		function cancelAddProject() {
			$scope.addProjectData = {
				constructType: {},
				effectPicList: [],
				licenceList: []
			}
			AddProjectDialog.close()
		}
		function uploadProject(effectPicList, licenceList) {
			console.log(effectPicList, licenceList)
			var content = {
				name: $scope.addProjectData.name,
				num: $scope.addProjectData.num,
				address: $scope.addProjectData.address,
				dutyUnit: $scope.addProjectData.dutyUnit,
				principal: $scope.addProjectData.principal,
				constructType: $scope.addProjectData.constructType.type,
				size: $scope.addProjectData.size,
				sum: $scope.addProjectData.sum,
				constructUnit: $scope.addProjectData.constructUnit,
				use: $scope.addProjectData.use,
				designUnit: $scope.addProjectData.designUnit,
				surveyUnit: $scope.addProjectData.surveyUnit,
				superviseUnit: $scope.addProjectData.superviseUnit,
				ownerUnit: $scope.addProjectData.ownerUnit,
				startDate: $scope.addProjectData.startDate.getTime(),
				effectPic: effectPicList,
				licence: licenceList
			}
			var params = {
				content: JSON.stringify(content)
			}
			var options = {
				params: params,
				handle: handleUploadProject,
				handleError: handleUploadProjectError
			}
			Http.addNewProject(options)
		}
		function handleUploadProject(res) {
			var code = res.data.code
			var message = res.data.message
			if (code === 0) {
				toastr.success(message)
				$scope.addProjectData = {
					constructType: {},
					effectPicList: [],
					licenceList: []
				}
				AddProjectDialog.close()
				getProjectList()
			} else {
				toastr.error(message)
			}
		}
		function handleUploadProjectError(error) {
			toastr.error('新建项目失败，请稍后再试。')
		}
	}
})()
