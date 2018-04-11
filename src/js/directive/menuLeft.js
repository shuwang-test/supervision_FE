;(function() {
	'use strict'
	angular.module('app').directive('menuLeft', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, eles, attrs) {
				$timeout(function() {
					var parent = document.querySelector(
						'.detail>.menu>ul>li.active'
					)
					var left = parent.getBoundingClientRect().left + 10 + 'px'
					eles.css({
						left: left
					})
				})
			}
		}
	})
})()
