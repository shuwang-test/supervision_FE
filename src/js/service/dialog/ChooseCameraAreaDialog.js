;(function() {
	'use strict'
	angular
		.module('app')
		.factory('ChooseCameraAreaDialog', ChooseCameraAreaDialog)
	function ChooseCameraAreaDialog(ngDialog) {
		var ChooseCameraAreaDialogList = []
		var open = function(scope) {
			var options = {
				templateUrl: 'views/dialogs/chooseArea/chooseArea.html',
				className: 'ngdialog-theme-default choose-area',
				overlay: true,
				showClose: false,
				closeByDocument: false,
				scope: scope
			}
			ChooseCameraAreaDialogList.push(ngDialog.open(options))
		}
		var close = function() {
			ChooseCameraAreaDialogList.forEach(function(dialog) {
				if (dialog.close) {
					dialog.close()
				}
			})
			ChooseCameraAreaDialogList = []
		}
		return {
			open: open,
			close: close
		}
	}
})()
