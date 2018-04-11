;(function() {
	// 'use strict'
	angular.module('app').controller('projectCtrl', projectCtrl)
	function projectCtrl(
		$scope,
		$rootScope,
		$timeout,
		$state,
		toastr,
		Upload,
		localStorageService,
		Util,
		Http,
		AreYouSure,
		ProjectDetail,
		PhotoSwipe,
		ChooseCameraAreaDialog,
		Check,
		Constant,
		Loading
	) {
		$scope.format = 'yyyy/MM/dd'
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		}
		$scope.showStartTime = showStartTime
		$scope.projectData = {}
		$scope.showImage = showImage
		$scope.editInfo = editInfo
		$scope.cancelEdit = cancelEdit
		$scope.uploadEffectPic = uploadEffectPic
		$scope.uploadLicence = uploadLicence
		$scope.deleteEffectPic = deleteEffectPic
		$scope.deleteLicence = deleteLicence
		$scope.chooseCamera = chooseCamera
		$scope.saveInfo = saveInfo
		$scope.certainChooseCamera = certainChooseCamera
		$scope.cancelChooseCamera = cancelChooseCamera
		init()
		function init() {
			$rootScope.currentMenu = 1
			getProjectDetail()
		}

		function getProjectDetail() {
			var projectId = localStorageService.get('projectId')
			ProjectDetail.getProjectDetail(projectId).then(function(res) {
				if (res) {
					$scope.project = res
					getProjectData($scope.project)
				}
			})
		}
		function getProjectData(project) {
			Object.keys(project).forEach(function(prop) {
				if (prop === 'startDate') {
					$scope.projectData[prop] = new Date(project[prop])
				} else {
					$scope.projectData[prop] = project[prop]
				}
			})
			$scope.projectData.effectPicList = []
			$scope.projectData.licenceList = []
		}

		function showStartTime() {
			$scope.startTime.show = true
		}

		function showImage(index, type) {
			var selector = type === 1 ? 'img.effect' : 'img.licence'
			var imgList = document.querySelectorAll(selector)
			var src = imgList[index].src
			var width = imgList[index].naturalWidth
			var height = imgList[index].naturalHeight
			console.log(imgList, src, width, height)
			PhotoSwipe.openPhotoSwipe(src, width, height)
		}
		function editInfo() {
			$scope.editing = true
		}
		function cancelEdit() {
			$scope.editing = false
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
			$scope.projectData.effectPicList = $scope.projectData.effectPicList.concat(
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
			$scope.projectData.licenceList = $scope.projectData.licenceList.concat(
				files
			)
		}
		function deleteEffectPic(effectPic) {
			var index = $scope.projectData.effectPicList.indexOf(effectPic)
			$scope.projectData.effectPicList.splice(index, 1)
		}
		function deleteLicence(licence) {
			var index = $scope.projectData.licenceList.indexOf(licence)
			$scope.projectData.licenceList.splice(index, 1)
		}

		function chooseCamera() {
			ChooseCameraAreaDialog.open($scope)
			$timeout(function() {
				buildDefaultUnit()
			}, 300)
		}
		function saveInfo() {
			if (!Check.checkModifyProjectData($scope.projectData)) {
				return
			}

			Loading.open()
			var url = Constant.domainName + '/api/upload?dir=project'
			var effectPicList = ''
			var licenceList = ''
			$scope.projectData.effectPicList.forEach(function(effectPic) {
				Upload.upload({
					url: url,
					data: {
						file: effectPic
					}
				})
					.then(function(res) {
						effectPicList += res.data.data
						effectPic.hasUploadSuccess = true
						var effectPicFlag = $scope.projectData.effectPicList.every(
							function(effectPic) {
								return (
									effectPic.hasUploadSuccess === true ||
									effectPic.hasUploadError === true
								)
							}
						)
						var licenceFlag = $scope.projectData.licenceList.every(
							function(licence) {
								return (
									licence.hasUploadSuccess === true ||
									licence.hasUploadError === true
								)
							}
						)
						if (effectPicFlag && licenceFlag) {
							updateProject(effectPicList, licenceList)
						}
					})
					.catch(function(error) {
						console.log('upload effectPic Error', error)
						effectPic.hasUploadError = true
					})
			})

			$scope.projectData.licenceList.forEach(function(licence) {
				Upload.upload({
					url: url,
					data: {
						file: licence
					}
				})
					.then(function(res) {
						licenceList += res.data.data
						licence.hasUploadSuccess = true
						var effectPicFlag = $scope.projectData.effectPicList.every(
							function(effectPic) {
								return (
									effectPic.hasUploadSuccess === true ||
									effectPic.hasUploadError === true
								)
							}
						)
						var licenceFlag = $scope.projectData.licenceList.every(
							function(licence) {
								return (
									licence.hasUploadSuccess === true ||
									licence.hasUploadError === true
								)
							}
						)
						if (effectPicFlag && licenceFlag) {
							updateProject(effectPicList, licenceList)
						}
					})
					.catch(function(error) {
						console.log('upload licence Error', error)
						licence.hasUploadError = true
					})
			})
		}

		function updateProject(effectPicList, licenceList) {
			var content = {
				id: localStorageService.get('projectId'),
				name: $scope.projectData.name,
				num: $scope.projectData.num,
				address: $scope.projectData.address,
				dutyUnit: $scope.projectData.dutyUnit,
				principal: $scope.projectData.principal,
				size: $scope.projectData.size,
				sum: $scope.projectData.sum,
				constructUnit: $scope.projectData.constructUnit,
				use: $scope.projectData.use,
				designUnit: $scope.projectData.designUnit,
				surveyUnit: $scope.projectData.surveyUnit,
				superviseUnit: $scope.projectData.superviseUnit,
				ownerUnit: $scope.projectData.ownerUnit,
				startDate: $scope.projectData.startDate.getTime(),
				effectPic: effectPicList,
				licence: licenceList,
				cameraAreaName: $scope.projectData.cameraAreaName,
				cameraAreaUuid: $scope.projectData.cameraAreaUuid
			}
			var params = {
				content: JSON.stringify(content)
			}
			var options = {
				params: params,
				handle: handleUpdateProject,
				handleError: handleUpdateProjectError
			}
			Http.updateProject(options)
		}

		function handleUpdateProject(res) {
			var code = res.data.code
			var message = res.data.message
			if (code === 0) {
				toastr.success(message)
				$scope.editing = false
				getProjectDetail()
			} else {
				toastr.error(message)
			}
		}
		function handleUpdateProjectError(error) {
			toastr.error('保存失败，请稍后再试。')
		}

		function certainChooseCamera() {
			if ($('.radio_true_full').length == 0) {
				toastr.error('请选择一个项目部')
				return
			}
			var nodeId = $('.radio_true_full')
				.parent()
				.attr('id')
			var tree = $.fn.zTree.getZTreeObj('planTree')
			var node = tree.getNodeByTId(nodeId)
			// alert(node.uuid) //cameraAreaUuid
			// alert(node.name) //cameraAreaName
			$scope.projectData.cameraAreaName = node.name
			$scope.projectData.cameraAreaUuid = node.uuid
			ChooseCameraAreaDialog.close()
		}
		function cancelChooseCamera() {
			$scope.projectData.cameraAreaName = $scope.project.cameraAreaName
			ChooseCameraAreaDialog.close()
		}

		//资源树
		function buildDefaultUnit() {
			var asynTree = document.getElementById('planTree') // 异步树

			var setting = {
				data: {
					key: {
						name: 'name'
					}
				},
				async: {
					enable: false,
					autoParam: ['uuid', 'NodeType'] // 资源编号，资源名称， 节点类型：1-控制中心 2-区域 3-监控点
				},
				view: {
					showIcon: true //设置 zTree 是否显示节点的图标。
				},
				check: {
					enable: true,
					chkStyle: 'radio',
					radioType: 'all'
				},
				callback: {
					onExpand: zTreeOnExpand,
					beforeCheck: zTreeBeforeClick
				}
			}

			function zTreeBeforeClick(treeId, treeNode) {
				if (treeNode.NodeType != 2) toastr.warning('只能选择区域')
				return treeNode.NodeType == 2
			}

			// 获取默认控制中心
			$.ajax({
				url: Constant.domainName + 'api/hikSource/getDefaultUnit',
				type: 'GET',
				// contentType: 'application/json; charset=utf-8',
				success: function(nodes) {
					if (nodes.errorCode != 0) {
						toastr.error(
							'获取默认控制中心失败，' +
								nodes.errorMessage +
								',错误码为：' +
								nodes.errorCode
						)
					} else {
						var arr = {}
						arr.uuid = nodes.data.unitUuid
						arr.name = nodes.data.name
						arr.NodeType = 1 // 1是控制中心
						arr.isParent = true
						arr.expanded = false
						arr.iconSkin = 'data-icon-unit'
						childNodes = []
						childNodes.push(arr)
						$.fn.zTree.init($('#planTree'), setting, childNodes)
					}
				}
			})
		}

		function zTreeOnExpand(event, treeId, treeNode) {
			//expandNode = treeNode;
			if (!treeNode.expanded) {
				treeNode.expanded = true
				var resUuid = treeNode.uuid

				// 先查中心或区域
				if (treeNode.NodeType == 2) {
					// 点击的是区域，查区域
					$.ajax({
						url:
							Constant.domainName +
							'api/hikSource/getRegionsByParentUuid',
						type: 'POST',
						data: {
							pageNo: 1,
							pageSize: 400,
							parentUuid: resUuid,
							allChildren: 0
						},
						success: function(nodes) {
							if (nodes.errorCode != 0) {
								var vDesc =
									'根据父中心查询区域失败，' +
									nodes.errorMessage +
									',错误码为：' +
									nodes.errorCode
								toastr.error(vDesc)
							} else if (nodes.data.total < 1) {
							} else {
								childNodes = []
								for (
									var i = 0;
									i < nodes.data.list.length;
									i++
								) {
									var arr = {}
									arr.uuid = nodes.data.list[i].regionUuid
									arr.name = nodes.data.list[i].name
									arr.NodeType = 2 // 2表示区域
									arr.isParent = true
									arr.iconSkin = 'data-icon-region'
									childNodes.push(arr)
								}
								var tree = $.fn.zTree.getZTreeObj('planTree')
								tree.addNodes(treeNode, childNodes)
							}
						}
					}) // end ajax
				} else if (treeNode.NodeType == 1) {
					// 点击的是控制中心，查控制中心
					$.ajax({
						url:
							Constant.domainName +
							'api/hikSource/getUnitsByParentUuid',
						type: 'POST',
						data: {
							pageNo: 1,
							pageSize: 400,
							parentUuid: resUuid,
							allChildren: 0
						},
						success: function(nodes) {
							if (nodes.errorCode != 0) {
								var vDesc =
									'根据父中心查询中心失败，' +
									nodes.errorMessage +
									',错误码为：' +
									nodes.errorCode
								toastr.error(vDesc)
							} else if (nodes.data.total < 1) {
							} else {
								childNodes = []
								for (
									var i = 0;
									i < nodes.data.list.length;
									i++
								) {
									var arr = {}
									arr.uuid = nodes.data.list[i].unitUuid
									arr.name = nodes.data.list[i].name
									arr.NodeType = 1 // 1表示中心
									arr.isParent = true
									arr.iconSkin = 'data-icon-unit'
									childNodes.push(arr)
								}
								var tree = $.fn.zTree.getZTreeObj('planTree')
								tree.addNodes(treeNode, childNodes)
							}
						}
					}) // end ajax
				} else {
					return
				}
				if (treeNode.NodeType == 1) {
					// 当前点击的是中心，查区域
					$.ajax({
						url:
							Constant.domainName +
							'api/hikSource/getRegionsByUnitUuid',
						type: 'POST',
						data: {
							pageNo: 1,
							pageSize: 400,
							parentUuid: resUuid,
							allChildren: 0
						},
						success: function(nodes) {
							if (nodes.errorCode != 0) {
								var vDesc =
									'根据中心查询区域失败，' +
									nodes.errorMessage +
									',错误码为：' +
									nodes.errorCode
								toastr.error(vDesc)
							} else if (nodes.data.total < 1) {
							} else {
								childNodes = []
								for (
									var i = 0;
									i < nodes.data.list.length;
									i++
								) {
									var arr = {}
									arr.uuid = nodes.data.list[i].regionUuid
									arr.name = nodes.data.list[i].name
									arr.NodeType = 2 // 2表示区域
									arr.isParent = true
									arr.iconSkin = 'data-icon-region'
									childNodes.push(arr)
								}
								var tree = $.fn.zTree.getZTreeObj('planTree')
								tree.addNodes(treeNode, childNodes)
							}
						}
					}) // end ajax
				}
			}
		}
	}
})()
