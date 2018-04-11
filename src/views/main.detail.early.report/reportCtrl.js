// ;(function() {
// 	'use strict'
// 	angular.module('app').controller('reportCtrl', reportCtrl)
// 	function reportCtrl(
// 		$scope,
// 		$rootScope,
// 		$timeout,
// 		$state,
// 		toastr,
// 		localStorageService,
// 		Util,
// 		Http,
// 		AreYouSure
// 	) {
// 		init()
// 		function init() {
// 			$rootScope.earlyCurrentMenu = 2
// 		}
// 	}
// })()

;(function() {
	'use strict'

	angular
		.module('app')
		.controller('reportCtrl', function(
			$scope,
			$rootScope,
			toastr,
			Constant,
			$httpFactory,
			$photoSwipeFactory,
			localStorageService,
			Upload,
			$timeout,
			$utilFactory,
			Loading,
			$state
		) {
			var global = {}
			init()
			function init() {
				$rootScope.earlyCurrentMenu = 2
				initGlobal()
				initList()
				initDetailSecondMenu()
				initReportList()
			}
			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
				global.uploadImageListLength = 0
				global.uploadWordListLength = 0
			}
			function initDetailSecondMenu() {
				$rootScope.detailSecondMenu = 2
			}
			function initList() {
				$scope.imageList = []
				$scope.wordList = []
				$scope.uploadImageList = []
				$scope.uploadWordList = []
			}
			function initReportList() {
				getReportList(
					global.projectId,
					handleGetReportList,
					handleGetReportListError
				)
			}
			function getReportList(projectId, handle, handleError) {
				$httpFactory.setToken(global.token)
				$httpFactory
					.getReportList(projectId)
					.then(handle)
					.catch(handleError)
			}

			function handleGetReportList(res) {
				console.log('res', res)
				var code = res.data.code
				var message = res.data.message
				if (code === 0) {
					var data = res.data.data
					if (data.length === 0) {
						toastr.info('暂无文件')
					}
					data.forEach(function(item, index) {
						if ($utilFactory.check.checkImage(item.url)) {
							$scope.imageList.push({
								id: item.id,
								select: false,
								src: item.url
							})
						} else if ($utilFactory.check.checkWord(item.url)) {
							$scope.wordList.push({
								id: item.id,
								select: false,
								href: item.url,
								name: item.name,
								userName: item.userName,
								createDate: $utilFactory.getDate(
									item.createDate
								)
							})
						}
					})
				} else if (code === 2) {
					toastr.warning(message)
					$timeout(function() {
						localStorageService.remove('user')
						$state.go('login')
					}, 1500)
				}
			}
			function handleGetReportListError(error) {
				console.log(error)
				toastr.error('加载数据出错，请您稍后再试。')
			}

			$scope.startEditing = startEditing
			function startEditing() {
				if (
					$scope.imageList.length === 0 &&
					$scope.wordList.length === 0
				) {
					toastr.info('请先上传文件。')
					return
				}
				$scope.editing = true
			}
			$scope.cancelEditing = cancelEditing
			function cancelEditing() {
				$scope.editing = false
				$scope.imageList.forEach(function(item, index) {
					item.select = false
				})
				$scope.wordList.forEach(function(item, index) {
					item.select = false
				})
			}

			$scope.chooseAll = chooseAll
			function chooseAll() {
				var flag1 = $scope.imageList.every(function(item) {
					return item.select === true
				})
				var flag2 = $scope.wordList.every(function(item) {
					return item.select === true
				})

				$scope.imageList.forEach(function(item) {
					if (flag1 && flag2) {
						item.select = false
					} else {
						item.select = true
					}
				})
				$scope.wordList.forEach(function(item) {
					if (flag1 && flag2) {
						item.select = false
					} else {
						item.select = true
					}
				})
			}

			$scope.chooseImage = function(index) {
				if (!$scope.editing) {
					return
				}
				$scope.imageList[index].select = !$scope.imageList[index].select
			}
			$scope.chooseWord = function(index) {
				if (!$scope.editing) {
					return
				}
				$scope.wordList[index].select = !$scope.wordList[index].select
			}
			$scope.showImage = showImage
			function showImage(index) {
				if ($scope.editing) {
					return
				}
				var img = document.querySelectorAll(
					'img.detail-second-first-img'
				)[index]
				var src = img.src
				var width = img.naturalWidth
				var height = img.naturalHeight
				$photoSwipeFactory.openPhotoSwipe(src, width, height)
			}
			$scope.deleteImageAndWord = deleteImageAndWord
			function deleteImageAndWord() {
				var ids = []
				$scope.imageList.forEach(function(item) {
					if (item.select === true) {
						ids.push(item.id)
					}
				})
				$scope.wordList.forEach(function(item) {
					if (item.select === true) {
						ids.push(item.id)
					}
				})
				console.log('ids', ids)
				if (ids.length === 0) {
					toastr.warning('请选择您要删除的图片或文档')
					return
				}
				var data = {
					content: {
						ids: ids
					}
				}
				deleteReport(data)
			}

			function deleteReport(data) {
				$httpFactory.setToken(global.token)
				$httpFactory
					.deleteReport(data)
					.then(function(res) {
						var code = res.data.code
						var message = res.data.message
						if (code === 0) {
							toastr.info(message)
							$scope.editing = false
							initList()
							initReportList()
						} else if (code === 2) {
							toastr.warning(message)
							$timeout(function() {
								localStorageService.remove('user')
								$state.go('login')
							}, 1500)
						}
					})
					.catch(function(error) {
						console.log(error)
						toastr.error('删除失败，请您稍后再试。')
					})
			}

			$scope.change = change
			function change(files, invalidFile) {
				console.log(files, invalidFile)
				if (files.length == 0 && invalidFile.length == 0) {
					return
				}
				if (invalidFile.length > 0) {
					toastr.error('文件类型错误')
					return
				}
				files.forEach(function(item) {
					if (item.size == 0) {
						toastr.error('请您不要上传空文件。')
						return
					}
					if ($utilFactory.check.checkImage(item.name)) {
						$scope.uploadImageList.push(item)
					} else if ($utilFactory.check.checkWord(item.name)) {
						$scope.uploadWordList.push(item)
					}
				})
				console.log('imageList', $scope.uploadImageList)
				console.log('wordList', $scope.uploadWordList)
				Loading.open('上传中,请稍后......')
				var fileList = $scope.uploadImageList.concat(
					$scope.uploadWordList
				)
				console.log('fileList', fileList)
				fileList.forEach(function(item, index) {
					var url = Constant.domainName + '/api/upload?dir=project'
					Upload.upload({
						url: url,
						data: {
							file: item
						}
					})
						.then(function(res) {
							console.log('res', res)
							item.hasUpload = true
							item.url = res.data.data
							var flag = fileList.every(function(item) {
								return (
									item.hasUpload === true ||
									item.uploadError === true
								)
							})
							if (flag) {
								var urlList = []
								fileList.forEach(function(item) {
									if ($utilFactory.exist(item.url)) {
										urlList.push({
											url: item.url
										})
									}
								})
								console.log('urlList', urlList)
								var content = {
									projectId: global.projectId,
									data: urlList
								}
								var data = {
									content: content
								}
								uploadReport(data)
							}
						})
						.catch(function(error) {
							console.log(error)
							item.uploadError = true
							item.url = null
						})
				})
			}

			function uploadReport(data) {
				$httpFactory.setToken(global.token)
				$httpFactory
					.uploadReport(data)
					.then(function(res) {
						var code = res.data.code
						var message = res.data.message
						Loading.close()
						if (code === 0) {
							toastr.success('上传成功。')
							initList()
							initReportList()
						} else if (code === 2) {
							toastr.warning(message)
							localStorageService.remove('user')
							$timeout(function() {
								$state.go('login')
							}, 1500)
						}
					})
					.catch(function(error) {
						console.log(error)
						toastr.error('上传出错，请您稍后再试。')
					})
			}
		})
})()
