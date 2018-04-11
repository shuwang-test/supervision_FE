;(function() {
	'use strict'
	angular.module('app').factory('Util', Util)
	function Util() {
		var exist = function(a) {
			return !(a === null || a === undefined || a === '')
		}
		var getDate = function(a) {
			var date = new Date(a)
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var day = date.getDate()
			return year + '/' + month + '/' + day
		}
		return {
			exist: exist,
			getDate: getDate
		}
	}
})()
