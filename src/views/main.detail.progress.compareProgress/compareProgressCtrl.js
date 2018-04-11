;(function() {
	'use strict'

	angular
		.module('app')
		.controller('compareProgressCtrl', function(
			$scope,
			$rootScope,
			toastr,
			Constant,
			$httpFactory,
			$photoSwipeFactory,
			localStorageService,
			Upload,
			$timeout,
			$utilFactory,
			$state,
			Loading
		) {
			init()
			function init() {
				$rootScope.detailFourthMenu = 3
			}

			$scope.monthList = [
				{
					name: '2013年4月份',
					dayList: [
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						22,
						23,
						24,
						25,
						26,
						27,
						28,
						29,
						30
					],
					width: 14 * 30,
					left: 0
				},
				{
					name: '2013年5月份',
					dayList: [
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						22,
						23,
						24,
						25,
						26,
						27,
						28,
						29,
						30,
						31
					],
					width: 14 * 31,
					left: 14 * 30
				},
				{
					name: '2013年6月份',
					dayList: [
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						22,
						23,
						24,
						25,
						26,
						27,
						28,
						29,
						30
					],
					width: 14 * 30,
					left: 14 * 61
				},
				{
					name: '2013年6月份',
					dayList: [
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						22,
						23,
						24,
						25,
						26,
						27,
						28,
						29,
						30
					],
					width: 14 * 30,
					left: 14 * 91
				}
			]
			$scope.progressList = [
				{
					plan: {
						left: 280,
						width: 140
					},
					actual: {
						left: 140,
						width: 280
					}
				},
				{
					plan: {
						left: 560,
						width: 520
					},
					actual: {
						left: 520,
						width: 560
					}
				}
			]
		})
})()
