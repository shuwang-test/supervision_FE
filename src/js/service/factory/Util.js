;(function() {
	'use strict'
	angular.module('app').factory('Util', Util)
	function Util() {
		var exist = function(a) {
			return !(a === null || a === undefined || a === '')
		}
		return {
			exist: exist
		}
	}
})()
