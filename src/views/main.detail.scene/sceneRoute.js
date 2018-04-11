;(function() {
	'use strict'
	angular.module('app').config(function($stateProvider) {
		$stateProvider.state('main.detail.scene', {
			url: '/scene',
			templateUrl: 'views/main.detail.scene/scene.html',
			controller: 'sceneCtrl'
		})
	})
})()
