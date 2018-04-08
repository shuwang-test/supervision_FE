;(function() {
	'use strict'
	angular.module('app').factory('ConstructTypeList', function(Http) {
		var getConstructTypeList = function() {
			return Http.getConstructTypeList().then(function(res) {
				if (res) {
					var constructTypeList = []
					Object.keys(res.data).forEach(function(type, index) {
						constructTypeList[index] = {
							type: type,
							name: res.data[type]
						}
					})
					return {
						constructTypeList: constructTypeList
					}
				}
			})
		}
		return {
			getConstructTypeList: getConstructTypeList
		}
	})
})()
