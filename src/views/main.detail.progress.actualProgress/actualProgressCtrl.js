;(function() {
	'use strict'
	angular
		.module('app')
		.controller('actualProgressCtrl', function(
			$scope,
			$rootScope,
			$state,
			toastr,
			Constant,
			localStorageService,
			Upload,
			Http,
			Util,
			Loading
		) {
			init()
			function init() {
				$rootScope.detailFourthMenu = 2
			}
		})
})()
