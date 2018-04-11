;(function() {
	'use strict'
	angular.module('app').directive('flagLeft', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, eles, attrs) {
				$timeout(function() {
					var parent = document.querySelector(
						'.detail-view>div>.menu>ul>li'
					)
					var left =
						parent.getBoundingClientRect().width / 2 - 10 + 'px'
					eles.css({
						left: left
					})
				})
			}
		}
	})
})()
