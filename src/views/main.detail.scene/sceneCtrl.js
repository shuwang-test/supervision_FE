;(function() {
	'use strict'
	angular.module('app').controller('sceneCtrl', sceneCtrl)
	function sceneCtrl(
		$scope,
		$rootScope,
		$timeout,
		$state,
		toastr,
		localStorageService,
		Util,
		Http,
		AreYouSure
	) {
		init()
		function init() {
			$rootScope.currentMenu = 3
		}
	}
})()
