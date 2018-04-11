;(function() {
	'use strict'
	angular
		.module('app')
		.controller('planProgressCtrl', function(
			$scope,
			$rootScope,
			$state,
			toastr,
			Constant,
			localStorageService,
			Upload,
			Http,
			Util,
			Loading
		) {
			init()
			function init() {
				$rootScope.detailFourthMenu = 1
				getProgressList()
			}
			$scope.format = 'yyyy/MM/dd'
			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			}
			$scope.showStartTime = showStartTime
			$scope.showEndTime = showEndTime
			$scope.edit = edit
			$scope.cancel = cancel
			$scope.addProgress = addProgress

			function showStartTime(progress) {
				progress.showStartTime = true
			}
			function showEndTime(progress) {
				progress.showEndTime = true
			}
			function edit(progress) {
				progress.editing = true
			}
			function cancel(progress) {
				if (progress.isAdd) {
					var index = $scope.progressList.indexOf(progress)
					$scope.progressList.splice(index, 1)
				} else {
					progress.editing = false
					progress.showStartTime = false
					progress.showEndtTime = false
					progress.progressData = {
						name: progress.name,
						planStartDate: progress.planStartDate,
						planEndDate: progress.planEndDate
					}
				}
			}

			function addProgress(progress) {
				var index = $scope.progressList.indexOf(progress)
				var newProgress = {
					isAdd: true,
					showStartTime: false,
					showEndTime: false,
					editing: true,
					name: '',
					planStartDate: '未设置',
					planEndDate: '未设置'
				}
				newProgress.progressData = {
					name: newProgress.name,
					planStartDate: newProgress.planStartDate,
					planEndDate: newProgress.planEndDate
				}
				$scope.progressList.splice(index + 1, 0, newProgress)
			}

			function getProgressList() {
				var options = {
					content: encodeURI(
						JSON.stringify({
							projectId: localStorageService.get('projectId')
						})
					)
				}
				Http.getProgressList(options).then(function(res) {
					if (res) {
						var code = res.data.code
						var message = res.data.message
						if (code === 0) {
							var progressList = []
							res.data.data.forEach(function(progress, index) {
								progressList[index] = {
									isAdd: false,
									showStartTime: false,
									showEndTime: false,
									editing: false,
									name: progress.name,
									code: progress.code,
									id: progress.id,
									planStartDate: progress.planStartDate
										? Util.getDate(progress.planStartDate)
										: '未设置',
									planEndDate: progress.planEndDate
										? Util.getDate(progress.planEndDate)
										: '未设置'
								}
								progressList[index].progressData = {
									name: progressList[index].name,
									planStartDate:
										progressList[index].planStartDate,
									planEndDate: progressList[index].planEndDate
								}
							})
							$scope.progressList = progressList
							console.log(progressList)
						}
					}
				})
			}
		})
})()
