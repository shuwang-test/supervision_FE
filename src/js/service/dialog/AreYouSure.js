;(function() {
	'use strict'
	angular.module('app').factory('AreYouSure', AreYouSure)
	function AreYouSure(ngDialog) {
		var areYouSureList = []
		var open = function(scope) {
			var options = {
				templateUrl: 'views/dialogs/areYouSure/areYouSure.html',
				className: 'ngdialog-theme-default are-you-sure',
				overlay: true,
				showClose: false,
				closeByDocument: false,
				disableAnimation: false,
				scope: scope
			}
			areYouSureList.push(ngDialog.open(options))
		}
		var close = function() {
			areYouSureList.forEach(function(loading) {
				if (loading.close) {
					loading.close()
				}
			})
			areYouSureList = []
		}
		return {
			open: open,
			close: close
		}
	}
})()
