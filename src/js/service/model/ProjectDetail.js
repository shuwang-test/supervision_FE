;(function() {
	'use strict'
	angular
		.module('app')
		.factory('ProjectDetail', function(Http, toastr, Util) {
			var getProjectDetail = function(projectId) {
				var options = {
					projectId: projectId
				}
				return Http.getProjectDetail(options).then(function(res) {
					if (res) {
						if (res.data.code === 0) {
							res.data.data.startDate = Util.getDate(
								res.data.data.startDate
							)
							return res.data.data
						} else {
							toastr.warning(res.data.message)
						}
					}
				})
			}
			return {
				getProjectDetail: getProjectDetail
			}
		})
})()
