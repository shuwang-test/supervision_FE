;(function() {
	'use strict'
	angular.module('app').factory('Check', function(Reg, Util, toastr) {
		var checkAddProjectData = function(addProjectData) {
			var name = addProjectData.name
			var address = addProjectData.address
			var dutyUnit = addProjectData.dutyUnit
			var principal = addProjectData.principal
			var constructType = addProjectData.constructType.type
			var size = addProjectData.size
			var sum = addProjectData.sum
			var num = addProjectData.num
			var use = addProjectData.use
			var constructUnit = addProjectData.constructUnit
			var designUnit = addProjectData.designUnit
			var surveyUnit = addProjectData.surveyUnit
			var superviseUnit = addProjectData.superviseUnit
			var ownerUnit = addProjectData.ownerUnit
			var startDate = addProjectData.startDate
			var effectPicList = addProjectData.effectPicList
			var licenceList = addProjectData.licenceList
			if (
				!Util.exist(name) ||
				!Util.exist(address) ||
				!Util.exist(dutyUnit) ||
				!Util.exist(principal) ||
				!Util.exist(constructType) ||
				!Util.exist(size) ||
				!Util.exist(sum) ||
				!Util.exist(num) ||
				!Util.exist(use) ||
				!Util.exist(constructUnit) ||
				!Util.exist(designUnit) ||
				!Util.exist(surveyUnit) ||
				!Util.exist(superviseUnit) ||
				!Util.exist(ownerUnit) ||
				!Util.exist(startDate) ||
				!Util.exist(effectPicList) ||
				!Util.exist(licenceList)
			) {
				toastr.error('请填写完整的项目信息')
				return false
			}
		}
		return {
			checkAddProjectData: checkAddProjectData
		}
	})
})()
