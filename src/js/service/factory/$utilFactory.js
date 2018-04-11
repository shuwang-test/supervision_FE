;(function() {
	'use strict'
	angular.module('app').factory('$utilFactory', function($state) {
		function exist(a) {
			return !(a === undefined || a === null || a === '')
		}

		function goHome() {
			$state.go('main.list')
		}

		var isChineseCharacter = /^[\u4e00-\u9fa50-9a-zA-Z]+$/
		var isPassword = /^[0-9a-zA-Z]{8,16}$/
		var isLoginName = /^[a-zA-Z]{1,}$/
		var isNumber = /^[0-9]+$/
		var isImg = /^.*\.(jpg|gif|png|bmp|jpeg)$/i
		var isWord = /^.*\.(doc|docx|word|pdf)$/i
		function checkChineseCharacter(a) {
			return isChineseCharacter.test(a)
		}
		function checkNumber(a) {
			return isNumber.test(a)
		}
		function checkImage(a) {
			return isImg.test(a)
		}
		function checkWord(a) {
			return isWord.test(a)
		}
		function checkLoginName(a) {
			return isLoginName.test(a)
		}
		function checkPassword(a) {
			return isPassword.test(a)
		}

		function getDate(a) {
			var date = new Date(a)
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var day = date.getDate()
			return year + '/' + month + '/' + day
		}
		return {
			exist: exist,
			goHome: goHome,
			getDate: getDate,
			check: {
				checkChineseCharacter: checkChineseCharacter,
				checkNumber: checkNumber,
				checkImage: checkImage,
				checkWord: checkWord,
				checkLoginName: checkLoginName,
				checkPassword: checkPassword
			}
		}
	})
})()
