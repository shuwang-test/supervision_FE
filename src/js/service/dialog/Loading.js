;(function() {
	'use strict'
	angular.module('app').factory('Loading', Loading)
	function Loading(ngDialog, $timeout) {
		var loadingList = []
		var open = function(loadingTip) {
			loadingTip = loadingTip ? loadingTip : '拼命加载中......'
			var options = {
				templateUrl: 'views/dialogs/loading/loading.html',
				className: 'ngdialog-theme-default loading',
				overlay: false,
				showClose: false,
				closeByDocument: false,
				disableAnimation: true,
				controller: [
					'$scope',
					function($scope) {
						$scope.loadingTip = loadingTip
					}
				]
			}
			loadingList.push(ngDialog.open(options))
		}
		var close = function() {
			loadingList.forEach(function(loading) {
				if (loading.close) {
					$timeout(function() {
						loading.close()
					}, 10)
				}
			})
			loadingList = []
		}
		return {
			open: open,
			close: close
		}
	}
})()
