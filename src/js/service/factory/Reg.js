;(function() {
	'use strict'
	angular.module('app').factory('Reg', function() {
		var isNumber = function(a) {
			return /^[0-9]+$/.test(a)
		}
		return {
			isNumber: isNumber
		}
	})
})()
