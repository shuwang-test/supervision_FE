/**
 * 配置toastr模块
 */
;(function() {
	'use strict'
	angular.module('app').config(function(toastrConfig, Constant) {
		angular.extend(toastrConfig, {
			closeButton: true,
			progressBar: true,
			autoDismiss: false,
			containerId: 'toast-container',
			maxOpened: 0,
			newestOnTop: true,
			positionClass: 'toast-top-center',
			preventDuplicates: false,
			preventOpenDuplicates: false,
			target: 'body',
			timeOut: Constant.toastrTimeOut
		})
	})
})()
