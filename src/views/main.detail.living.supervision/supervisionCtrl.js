;(function() {
	'use strict'

	angular
		.module('app')
		.controller('supervisionCtrl', function(
			$scope,
			$rootScope,
			$state,
			localStorageService,
			toastr
		) {
			var global = {}
			$scope.chooseMode = chooseMode
			init()
			function init() {
				initGlobal()
				initCurrentMenu()
				initFrameSrc()
			}

			function chooseMode(type) {
				switch (type) {
					case 1:
						$scope.frameSrc = './mpv/mpv.html'
						break
					case 2:
						$scope.frameSrc = './mpb/mpb.html'
						break
				}
			}

			function initGlobal() {
				global.token = localStorageService.get('user').token
				global.projectId = localStorageService.get('projectId')
			}
			function initCurrentMenu() {
				$rootScope.detailThirdMenu = 2
			}
			function initFrameSrc() {
				$scope.frameSrc = './mpv/mpv.html'
			}
		})
})()
