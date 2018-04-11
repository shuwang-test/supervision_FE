;(function() {
	'use strict'
	angular.module('app').constant('Constant', {
		// domainName: 'http://192.168.3.115:80/supervise/',
		//接口地址(刘伟台式机)
		// domainName: 'http://192.168.3.151:8080/',
		//接口地址(刘伟笔记本)
		domainName: 'http://192.168.3.18:8080/',
		//接口地址(小白菜)
		// domainName: 'http://localhost:8080/',
		// domainName: 'http://121.40.195.52:8080/supervise/',
		toastrTimeOut: 1500, //toastr提示1500ms后关闭
		localStorageExpireTime: 60 //localStorageService失效时间60min
	})
})()
