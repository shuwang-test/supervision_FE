;(function() {
	'use strict'
	angular.module('app').factory('AddProjectDialog', AddProjectDialog)
	function AddProjectDialog(ngDialog) {
		var addProjectList = []
		var open = function(scope) {
			var options = {
				templateUrl: 'views/dialogs/addProject/addProject.html',
				className: 'ngdialog-theme-default add-project',
				overlay: true,
				showClose: false,
				closeByDocument: false,
				scope: scope
			}
			addProjectList.push(ngDialog.open(options))
		}
		var close = function() {
			addProjectList.forEach(function(addProject) {
				if (addProject.close) {
					addProject.close()
				}
			})
			addProjectList = []
		}
		return {
			open: open,
			close: close
		}
	}
})()
