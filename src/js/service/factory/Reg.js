;(function() {
	'use strict'
	angular.module('app').factory('Reg', function() {
		var isNumber = function(a) {
			return /^[0-9]+$/.test(a)
		}
		var isImage = function(a) {
			return /^.*\.(jpg|gif|png|bmp|jpeg)$/i.test(a)
		}
		var isDocument = function(a) {
			return /^.*\.(doc|docx|word|pdf)$/i.test(a)
		}
		var isCharactor = function(a) {
			return /^[\u4e00-\u9fa50-9a-zA-Z]+$/.test(a)
		}
		return {
			isNumber: isNumber,
			isImage: isImage,
			isDocument: isDocument
		}
	})
})()
