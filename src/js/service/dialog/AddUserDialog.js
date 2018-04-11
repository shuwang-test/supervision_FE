;(function() {
	'use strict'
	angular.module('app').factory('AddUserDialog', AddUserDialog)
	function AddUserDialog(ngDialog) {
		var addUserDialogList = []
		var open = function(scope) {
			var options = {
				templateUrl: 'views/dialogs/addUser/addUser.html',
				className: 'ngdialog-theme-default add-user',
				overlay: true,
				showClose: false,
				closeByDocument: false,
				scope: scope
			}
			addUserDialogList.push(ngDialog.open(options))
		}
		var close = function() {
			addUserDialogList.forEach(function(addProject) {
				if (addProject.close) {
					addProject.close()
				}
			})
			addUserDialogList = []
		}
		return {
			open: open,
			close: close
		}
	}
})()
