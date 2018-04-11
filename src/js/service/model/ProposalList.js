;(function() {
	'use strict'
	angular.module('app').factory('ProposalList', function(Http, Reg, toastr) {
		var getProposalList = function(projectId) {
			var options = {
				projectId: projectId
			}
			return Http.getProposalList(options).then(function(res) {
				if (res) {
					if (res.data.code === 0) {
						var imageList = []
						var wordList = []
						res.data.data
					} else {
						toastr.warning(res.data.message)
					}
				}
			})
		}
		return {
			getProposalList: getProposalList
		}
	})
})()
