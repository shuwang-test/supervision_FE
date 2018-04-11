;(function() {
	'use strict'
	angular.module('app').factory('$httpFactory', function($http, Constant) {
		$http.defaults.headers.post = {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		}
		var domainName = Constant.domainName
		function send(url, method, data) {
			if (!method) {
				method = 'GET'
			}
			var req
			if (typeof data === 'object') {
				req = {
					url: url,
					method: method,
					params: data
				}
			} else if (typeof data === 'undefined') {
				req = {
					url: url,
					method: method
				}
			}
			console.log(url, '--', method, '--', data)
			return $http(req)
		}
		var service = {
			setToken: function(token) {
				$http.defaults.headers.common.token = token
			},
			login: function(data) {
				var url = domainName + '/api/login'
				return send(url, 'POST', data)
			},
			modifyPassword: function(data) {
				var url = domainName + '/api/modifyPass'
				return send(url, 'POST', data)
			},
			getProjectList: function(content, pageSize, pageCurrent) {
				var url =
					domainName +
					'/api/project/list?search=' +
					content +
					'&pageSize=' +
					pageSize +
					'&pageCurrent=' +
					pageCurrent
				return send(url)
			},
			getConstructType: function() {
				var url = domainName + '/api/enum/arr/project/constructType'
				return send(url)
			},
			addNewProject: function(data) {
				var url = domainName + '/api/project/insert'
				return send(url, 'POST', data)
			},
			getProjectDetail: function(projectId) {
				var url = domainName + '/api/project/get?id=' + projectId
				return send(url)
			},
			saveProjectDetail: function(data) {
				var url = domainName + '/api/project/update'
				return send(url, 'POST', data)
			},
			getProposalList: function(projectId) {
				var url =
					domainName +
					'/api/prepare/proposal/find?projectId=' +
					projectId
				return send(url)
			},
			uploadProposal: function(data) {
				var url = domainName + '/api/prepare/proposal/save'
				return send(url, 'POST', data)
			},
			deleteProposal: function(data) {
				var url = domainName + '/api/prepare/proposal/delete'
				return send(url, 'POST', data)
			},
			getReportList: function(projectId) {
				var url =
					domainName +
					'/api/prepare/report/find?projectId=' +
					projectId
				return send(url)
			},
			uploadReport: function(data) {
				var url = domainName + '/api/prepare/report/save'
				return send(url, 'POST', data)
			},
			deleteReport: function(data) {
				var url = domainName + '/api/prepare/report/delete'
				return send(url, 'POST', data)
			},
			getDesignList: function(projectId) {
				var url =
					domainName +
					'/api/prepare/designApproval/find?projectId=' +
					projectId
				return send(url)
			},
			uploadDesign: function(data) {
				var url = domainName + '/api/prepare/designApproval/save'
				return send(url, 'POST', data)
			},
			deleteDesign: function(data) {
				var url = domainName + '/api/prepare/designApproval/delete'
				return send(url, 'POST', data)
			},
			getConstructList: function(projectId) {
				var url =
					domainName +
					'/api/prepare/constructApproval/find?projectId=' +
					projectId
				return send(url)
			},
			uploadConstruct: function(data) {
				var url = domainName + '/api/prepare/constructApproval/save'
				return send(url, 'POST', data)
			},
			deleteConstruct: function(data) {
				var url = domainName + '/api/prepare/constructApproval/delete'
				return send(url, 'POST', data)
			},
			getPlanList: function(projectId) {
				var url =
					domainName +
					'/api/prepare/planPermission/find?projectId=' +
					projectId
				return send(url)
			},
			uploadPlan: function(data) {
				var url = domainName + '/api/prepare/planPermission/save'
				return send(url, 'POST', data)
			},
			deletePlan: function(data) {
				var url = domainName + '/api/prepare/planPermission/delete'
				return send(url, 'POST', data)
			},
			getConstructPermissionList: function(projectId) {
				var url =
					domainName +
					'/api/prepare/constructPermission/find?projectId=' +
					projectId
				return send(url)
			},
			uploadConstructPermission: function(data) {
				var url = domainName + '/api/prepare/constructPermission/save'
				return send(url, 'POST', data)
			},
			deleteConstructPermission: function(data) {
				var url = domainName + '/api/prepare/constructPermission/delete'
				return send(url, 'POST', data)
			},
			getSafetyManager: function(projectId) {
				var url =
					domainName +
					'/api/siteCondition/safety/manager/find?projectId=' +
					projectId
				return send(url)
			},
			uploadSafetyManager: function(data) {
				var url = domainName + '/api/siteCondition/safety/manager/save'
				return send(url, 'POST', data)
			},
			getDutyList: function(projectId) {
				var url =
					domainName +
					'/api/siteCondition/safety/duty/find?projectId=' +
					projectId
				return send(url)
			},
			uploadDuty: function(data) {
				var url = domainName + '/api/siteCondition/safety/duty/save'
				return send(url, 'POST', data)
			},
			deleteDuty: function(data) {
				var url = domainName + '/api/siteCondition/safety/duty/delete'
				return send(url, 'POST', data)
			},
			getDutyDetailList: function(projectId) {
				var url =
					domainName +
					'/api/siteCondition/safety/duty/detail/find?projectId=' +
					projectId
				return send(url)
			},
			uploadDutyDetail: function(data) {
				var url =
					domainName + '/api/siteCondition/safety/duty/detail/save'
				return send(url, 'POST', data)
			},
			deleteDutyDetail: function(data) {
				var url =
					domainName + '/api/siteCondition/safety/duty/detail/delete'
				return send(url, 'POST', data)
			},
			getMeasureList: function(projectId) {
				var url =
					domainName +
					'/api/siteCondition/safety/measure/find?projectId=' +
					projectId
				return send(url)
			},
			uploadMeasure: function(data) {
				var url = domainName + '/api/siteCondition/safety/measure/save'
				return send(url, 'POST', data)
			},
			deleteMeasure: function(data) {
				var url =
					domainName + '/api/siteCondition/safety/measure/delete'
				return send(url, 'POST', data)
			},
			getStatusList: function(projectId) {
				var url =
					domainName +
					'/api/siteCondition/safety/status/find?projectId=' +
					projectId
				return send(url)
			},
			uploadStatus: function(data) {
				var url = domainName + '/api/siteCondition/safety/status/save'
				return send(url, 'POST', data)
			},
			deleteStatus: function(data) {
				var url = domainName + '/api/siteCondition/safety/status/delete'
				return send(url, 'POST', data)
			},
			getProgressPlanList: function(projectId) {
				var url =
					domainName +
					'/api/progress/plan/find?projectId=' +
					projectId
				return send(url)
			},
			uploadProgressPlan: function(data) {
				var url = domainName + '/api/progress/plan/save'
				return send(url, 'POST', data)
			},
			deleteProgressPlan: function(data) {
				var url = domainName + '/api/progress/plan/delete'
				return send(url, 'POST', data)
			},
			getProgressRealList: function(projectId) {
				var url =
					domainName +
					'/api/progress/real/find?projectId=' +
					projectId
				return send(url)
			},
			uploadProgressReal: function(data) {
				var url = domainName + '/api/progress/real/save'
				return send(url, 'POST', data)
			},
			deleteProgressReal: function(data) {
				var url = domainName + '/api/progress/real/delete'
				return send(url, 'POST', data)
			},
			getProgressCompareList: function(projectId) {
				var url =
					domainName +
					'/api/progress/compare/find?projectId=' +
					projectId
				return send(url)
			},
			uploadProgressCompare: function(data) {
				var url = domainName + '/api/progress/compare/save'
				return send(url, 'POST', data)
			},
			deleteProgressCompare: function(data) {
				var url = domainName + '/api/progress/compare/delete'
				return send(url, 'POST', data)
			},
			getRoleList: function() {
				var url = domainName + '/api/role/list'
				return send(url, 'POST')
			},
			getOperatorList: function(pageSize, pageCurrent) {
				var url =
					domainName +
					'/api/operator/list?pageSize=' +
					pageSize +
					'&pageCurrent=' +
					pageCurrent
				return send(url, 'POST')
			},
			addOperator: function(data) {
				var url = domainName + '/api/operator/save'
				return send(url, 'POST', data)
			},
			deleteOperator: function(param) {
				var data = param.data
				var url = domainName + '/api/operator/del'
				return send(url, 'POST', data)
			},
			getBindProjectList: function(param) {
				var id = param.id
				var pageCurrent = param.pageCurrent
				var pageSize = param.pageSize
				var url =
					domainName +
					'/api/operator/findBindProject?id=' +
					id +
					'&pageCurrent=' +
					pageCurrent +
					'&pageSize=' +
					pageSize
				return send(url)
			},
			getUnBindProjectList: function(param) {
				var id = param.id
				var pageCurrent = param.pageCurrent
				var pageSize = param.pageSize
				var url =
					domainName +
					'/api/operator/findNoBindProject?id=' +
					id +
					'&pageCurrent=' +
					pageCurrent +
					'&pageSize=' +
					pageSize
				return send(url)
			},
			bindProject: function(param) {
				var data = param.data
				var url = domainName + '/api/operator/addBindProject'
				return send(url, 'POST', data)
			},
			unBindProject: function(param) {
				var data = param.data
				var url = domainName + '/api/operator/removeBindProject'
				return send(url, 'POST', data)
			},
			menuList: function(param) {
				var content = param.content
				var url = domainName + '/api/power/role/list?content=' + content
				return send(url)
			},
			addRole: function(param) {
				var data = param.data
				var url = domainName + '/api/power/role/set'
				return send(url, 'POST', data)
			},
			deleteRole: function(param) {
				var data = param.data
				var url = domainName + '/api/role/del'
				return send(url, 'POST', data)
			}
		}
		return service
	})
})()
