Date.prototype.format = function(fmt) {
	var o = {
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		'H+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		S: this.getMilliseconds() //毫秒
	}
	var week = {
		'0': '\u65e5',
		'1': '\u4e00',
		'2': '\u4e8c',
		'3': '\u4e09',
		'4': '\u56db',
		'5': '\u4e94',
		'6': '\u516d'
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(this.getFullYear() + '').substr(4 - RegExp.$1.length)
		)
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(RegExp.$1.length > 1
				? RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468'
				: '') + week[this.getDay() + '']
		)
	}

	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1
					? o[k]
					: ('00' + o[k]).substr(('' + o[k]).length)
			)
		}
	}
	return fmt
}

$(function() {
	init()
})

function init() {
	myHost = window.location.host
	setDefaultRecordSearchDate()
	buildDefaultUnit()
	InitSpb()
}

//设置默认时间 今天0:00到现在
function setDefaultRecordSearchDate() {
	var now = new Date()
	document.getElementById('endTime').value = now.format('yyyy-MM-dd HH:mm:ss')
	now.setDate(now.getDate() - 2)
	now.setHours(0)
	now.setMinutes(0)
	now.setSeconds(0)
	now.setMilliseconds(0)
	document.getElementById('startTime').value = now.format(
		'yyyy-MM-dd HH:mm:ss'
	)
}

//资源树
function buildDefaultUnit() {
	var setting = {
		data: {
			key: {
				name: 'name'
			}
		},
		async: {
			enable: false,
			autoParam: ['uuid', 'NodeType', 'planType'] // 资源编号， 节点类型(1-控制中心 2-区域 3-监控点 4-录像计划)， 录像计划ID
		},
		view: {
			showIcon: true //设置 zTree 是否显示节点的图标。
		},
		callback: {
			onExpand: zTreeOnExpand,
			onDblClick: zTreeDblClick
		}
	}

	$.ajax({
		url: 'http://192.168.3.18:8080/api/hikSource/getRegionsByUuids',
		type: 'POST',
		data: {
			regionUuids: 'c5ae449b143d4ac59ee332f5f204dbb1' //todo project.cameraIndexCode
		},
		success: function(nodes) {
			if (nodes.errorCode != 0) {
				var vDesc =
					'根据区域查询监控点失败，' +
					nodes.errorMessage +
					',错误码为：' +
					nodes.errorCode
				alert(vDesc)
			} else if (nodes.data.total < 1) {
			} else {
				childNodes = []
				for (var i = 0; i < nodes.data.length; i++) {
					var arr = {}
					arr.uuid = nodes.data[i].regionUuid
					arr.name = nodes.data[i].name
					arr.NodeType = 2 // 2表示区域
					arr.isParent = true
					arr.iconSkin = 'data-icon-region'
					childNodes.push(arr)
				}
				$.fn.zTree.init($('#planTree'), setting, childNodes)
			}
		}
	})
}

function zTreeOnExpand(event, treeId, treeNode) {
	//expandNode = treeNode;
	if (!treeNode.expanded) {
		treeNode.expanded = true
		var resUuid = treeNode.uuid

		// 先查中心或区域
		if (treeNode.NodeType == 2) {
			// 点击的是区域，查区域
			$.ajax({
				url:
					'http://192.168.3.18:8080/api/hikSource/getRegionsByParentUuid',
				type: 'POST',
				data: {
					pageNo: 1,
					pageSize: 400,
					parentUuid: resUuid,
					allChildren: 0
				},
				success: function(nodes) {
					if (nodes.errorCode != 0) {
						var vDsc =
							'getRegionsByParentUuid : ' +
							jVal.errorMessage +
							',错误码：' +
							jVal.errorCode
						alert(vDsc)
					} else if (nodes.data.total < 1) {
					} else {
						childNodes = []
						for (var i = 0; i < nodes.data.list.length; i++) {
							var arr = {}
							arr.uuid = nodes.data.list[i].regionUuid
							arr.name = nodes.data.list[i].name
							arr.NodeType = 2 // 2表示区域
							arr.isParent = true
							arr.iconSkin = 'data-icon-region'
							childNodes.push(arr)
						}
						var tree = $.fn.zTree.getZTreeObj('planTree')
						tree.addNodes(treeNode, childNodes)
					}
				}
			}) // end ajax
		} else if (treeNode.NodeType == 1) {
			// 点击的是控制中心，查控制中心
			$.ajax({
				url:
					'http://192.168.3.18:8080/api/hikSource/getUnitsByParentUuid',
				type: 'POST',
				data: {
					pageNo: 1,
					pageSize: 400,
					parentUuid: resUuid,
					allChildren: 0
				},
				success: function(nodes) {
					if (nodes.errorCode != 0) {
						var vDsc =
							'getUnitsByParentUuid : ' +
							jVal.errorMessage +
							',错误码：' +
							jVal.errorCode
						alert(vDsc)
					} else if (nodes.data.total < 1) {
					} else {
						childNodes = []
						for (var i = 0; i < nodes.data.list.length; i++) {
							var arr = {}
							arr.uuid = nodes.data.list[i].unitUuid
							arr.name = nodes.data.list[i].name
							arr.NodeType = 1 // 1表示中心
							arr.isParent = true
							arr.iconSkin = 'data-icon-unit'
							childNodes.push(arr)
						}
						var tree = $.fn.zTree.getZTreeObj('planTree')
						tree.addNodes(treeNode, childNodes)
					}
				}
			}) // end ajax
		}

		// 再查区域或监控点
		if (treeNode.NodeType == 2) {
			// 当前点击的是区域，查监控点
			$.ajax({
				url:
					'http://192.168.3.18:8080/api/hikSource/getCamerasByRegionUuids',
				type: 'POST',
				data: {
					pageNo: 1,
					pageSize: 400,
					regionUuids: resUuid
				},
				success: function(nodes) {
					if (nodes.errorCode != 0) {
						var vDsc =
							'getCamerasByRegionUuids : ' +
							jVal.errorMessage +
							',错误码：' +
							jVal.errorCode
						alert(vDsc)
					} else if (nodes.data.total < 1) {
					} else {
						childNodes = []
						for (var i = 0; i < nodes.data.list.length; i++) {
							var arr = {}
							arr.uuid = nodes.data.list[i].cameraUuid
							arr.name = nodes.data.list[i].cameraName
							arr.NodeType = 3 // 3表示监控点
							arr.isParent = true
							arr.iconSkin = 'data-icon-camera1'
							childNodes.push(arr)
						}
						var tree = $.fn.zTree.getZTreeObj('planTree')
						tree.addNodes(treeNode, childNodes)
					}
				}
			}) // end ajax
		} else if (treeNode.NodeType == 1) {
			// 当前点击的是中心，查区域
			$.ajax({
				url:
					'http://192.168.3.18:8080/api/hikSource/getRegionsByUnitUuid',
				type: 'POST',
				data: {
					pageNo: 1,
					pageSize: 400,
					parentUuid: resUuid,
					allChildren: 0
				},
				success: function(nodes) {
					if (nodes.errorCode != 0) {
						var vDsc =
							'getRegionsByUnitUuid : ' +
							jVal.errorMessage +
							',错误码：' +
							jVal.errorCode
						alert(vDsc)
					} else if (nodes.data.total < 1) {
					} else {
						childNodes = []
						for (var i = 0; i < nodes.data.list.length; i++) {
							var arr = {}
							arr.uuid = nodes.data.list[i].regionUuid
							arr.name = nodes.data.list[i].name
							arr.NodeType = 2 // 2表示区域
							arr.isParent = true
							arr.iconSkin = 'data-icon-region'
							childNodes.push(arr)
						}
						var tree = $.fn.zTree.getZTreeObj('planTree')
						tree.addNodes(treeNode, childNodes)
					}
				}
			}) // end ajax
		}

		if (treeNode.NodeType == 3) {
			// 当前点击的是监控点，查录像计划
			cameraUuid = treeNode.uuid
			$.ajax({
				url:
					'http://192.168.3.18:8080/api/hikSource/getRecordPlansByCameraUuids',
				type: 'POST',
				data: {
					pageNo: 1,
					pageSize: 15,
					cameraUuids: cameraUuid
				},
				success: function(nodes) {
					if (nodes.errorCode != 0) {
						var vDsc =
							'getRecordPlansByCameraUuids : ' +
							jVal.errorMessage +
							',错误码：' +
							jVal.errorCode
						alert(vDsc)
					} else if (nodes.data.total < 1) {
					} else {
						childNodes = []
						for (var i = 0; i < nodes.data.list.length; i++) {
							var arr = {}
							arr.planType = nodes.data.list[i].planType
							if (nodes.data.list[i].enabled != 0) {
								continue
							}

							if (arr.planType == 1) {
								arr.name = '设备存储'
								arr.iconSkin = 'data-icon-device-store'
							} else if (arr.planType == 3) {
								arr.name = 'CVR存储'
								arr.iconSkin = 'data-icon-cvr-store'
							} else if (arr.planType == 4) {
								arr.name = 'CVM存储'
								arr.iconSkin = 'data-icon-cvm-store'
							} else {
								continue
							}

							arr.uuid = nodes.data.list[i].recordPlanUuid
							arr.NodeType = 4 // 4表示录像计划
							arr.isParent = false
							childNodes.push(arr)
						}

						if (childNodes.length > 0) {
							var tree = $.fn.zTree.getZTreeObj('planTree')
							tree.addNodes(treeNode, childNodes)
						}
					}
				}
			}) // end ajax
		}
	}
}

function zTreeDblClick(event, treeId, treeNode) {
	if (
		treeNode &&
		treeNode.uuid &&
		treeNode.NodeType &&
		treeNode.NodeType == '4'
	) {
		// 双击的是录像计划
		var recPlanUuid = treeNode.uuid
		var planType = treeNode.planType
		$.ajax({
			url:
				'http://192.168.3.18:8080/api/hikSource/getPlaybackParamByPlanUuid',
			type: 'POST',
			data: {
				planType: planType,
				recordPlanUuid: recPlanUuid
			},
			success: function(xml) {
				// 调OCX单路预览接口
				if (xml.data) {
					var startTime = document.getElementById('startTime').value
					var endTime = document.getElementById('endTime').value
					var spbOcx = document.getElementById('spb')

					var ret = 0
					//var opt = parseInt($("#PlayType option:selected").val(), 10);
					var opt = 0
					switch (opt) {
						case 0:
							ret = spbOcx.MPB_StartPlayBack(
								xml.data,
								startTime,
								endTime
							)
							break
						case 1:
							ret = spbOcx.MPB_StartPlayBackBySelectedWnd(
								xml.data,
								startTime,
								endTime
							)
							break
						case 2:
							var vWndIndex = $(
								'#seledWndIndex option:selected'
							).val()
							ret = spbOcx.MPB_StartPlayBackByWndIndex(
								xml.data,
								startTime,
								endTime,
								parseInt(vWndIndex, 10)
							)
							break
						default:
							return
					}

					if (ret != 0) {
						alert('回放失败：' + xml.data)
					}
				} else {
					alert('查询回放参数失败')
				}
			}
		})
	}
}

//初始化控件
function InitSpb() {
	var ocxObj = document.getElementById('spb')
	var languageType = 1
	var ret = ocxObj.MPB_Init(languageType)
	if (ret != 0) {
		alert('初始化失败')
	}
	SetLocalParam()
}

//设置本地参数
function SetLocalParam() {
	var ocxObj = document.getElementById('spb')
	var xml =
		'<?xml version="1.0" encoding="UTF-8"?> ' +
		'<localParam> ' +
		'<picType>1</picType> ' +
		'<capturePath>C:\\Hikvision\\Snapshot</capturePath> ' +
		'<recordSize>2</recordSize> ' +
		'<recordPath>C:\\Hikvision\\record</recordPath> ' +
		'<showMsgTip>1</showMsgTip> ' +
		'</localParam>'
	var ret = ocxObj.MPB_SetLocalParam(xml)
	if (ret != 0) {
		alert('设置本地参数失败')
	}
}

//停止所有回放
function stopAllPlayback() {
	var ocxObj = document.getElementById('spb')
	var ret = ocxObj.MPB_StopAllPlayback()
	if (ret != 0) {
		alert('停止所有回放失败')
	}
}
