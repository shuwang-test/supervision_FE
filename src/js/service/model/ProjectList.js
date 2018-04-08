;(function() {
	'use strict'
	angular.module('app').factory('ProjectList', function(Http) {
		var getProjectList = function(search, pageSize, pageCurrent) {
			var options = {
				search: search,
				pageSize: pageSize,
				pageCurrent: pageCurrent
			}
			return Http.getProjectList(options).then(function(res) {
				if (res) {
					if (res.data.code === 0) {
						var projectList = []
						res.data.data.list.forEach(function(project, index) {
							projectList[index] = {
								id: project.id,
								name: project.name,
								status: project.status,
								dutyUnit: project.dutyUnit,
								constructTypeName: project.constructTypeName
							}
						})
						return {
							projectList: projectList,
							totalItems: res.data.data.total,
							numPages: res.data.data.pages
						}
					} else {
						toastr.warning(res.data.message)
					}
				}
			})
		}
		return {
			getProjectList: getProjectList
		}
	})
})()
