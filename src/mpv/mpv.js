$(function() {
	init()
})

function init() {
	myHost = window.location.host
	buildDefaultUnit()
	InitSpvx()
}

//资源树
function buildDefaultUnit() {
	var asynTree = document.getElementById('planTree') // 异步树

	var setting = {
		data: {
			key: {
				name: 'name'
			}
		},
		async: {
			enable: false,
			autoParam: ['uuid', 'NodeType'] // 资源编号，资源名称， 节点类型：1-控制中心 2-区域 3-监控点
		},
		view: {
			showIcon: true //设置 zTree 是否显示节点的图标。
		},
		callback: {
			onExpand: zTreeOnExpand,
			onDblClick: zTreeDblClick
		}
	}

	// 获取默认控制中心
	// $.ajax({
	//   url: "http://192.168.3.18:8080/api/hikSource/getDefaultUnit",
	//   type: "GET",
	//   contentType: "application/json; charset=utf-8",
	//   success: function (nodes) {
	//     if (nodes.errorCode != 0) {
	//       alert("获取默认控制中心失败，" + nodes.errorMessage + ",错误码为：" + nodes.errorCode);
	//     }
	//     else {
	//       var arr = {};
	//       arr.uuid = nodes.data.unitUuid;
	//       arr.name = nodes.data.name;
	//       arr.NodeType = 1;   // 1是控制中心
	//       arr.isParent = true;
	//       arr.expanded = false;
	//       arr.iconSkin = 'data-icon-unit';
	//       childNodes = [];
	//       childNodes.push(arr);
	//       $.fn.zTree.init($("#planTree"), setting, childNodes);
	//     }
	//   }
	// })

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
						var vDesc =
							'根据父中心查询区域失败，' +
							nodes.errorMessage +
							',错误码为：' +
							nodes.errorCode
						alert(vDesc)
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
						var vDesc =
							'根据父中心查询中心失败，' +
							nodes.errorMessage +
							',错误码为：' +
							nodes.errorCode
						alert(vDesc)
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
		} else {
			return
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
						var vDesc =
							'根据区域查询监控点失败，' +
							nodes.errorMessage +
							',错误码为：' +
							nodes.errorCode
						alert(vDesc)
					} else if (nodes.data.total < 1) {
					} else {
						childNodes = []
						for (var i = 0; i < nodes.data.list.length; i++) {
							var arr = {}
							arr.uuid = nodes.data.list[i].cameraUuid
							arr.name = nodes.data.list[i].cameraName
							arr.NodeType = 3 // 3表示监控点
							arr.isParent = false
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
						var vDesc =
							'根据中心查询区域失败，' +
							nodes.errorMessage +
							',错误码为：' +
							nodes.errorCode
						alert(vDesc)
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
	}
}

function zTreeDblClick(event, treeId, treeNode) {
	if (
		treeNode &&
		treeNode.uuid &&
		treeNode.NodeType &&
		treeNode.NodeType == '3'
	) {
		// 双击的是监控点
		var seledCameraUuid = treeNode.uuid
		seledCamerUuid = treeNode.uuid
		$.ajax({
			url:
				'http://192.168.3.18:8080/api/hikSource/getPreviewParamByCameraUuid',
			type: 'POST',
			data: {
				cameraUuid: seledCameraUuid
			},
			success: function(xml) {
				// 调OCX单路预览接口
				var spvxOcx = document.getElementById('spv')
				if (xml.data) {
					var ret = 0
					//var opt = parseInt($("#PlayType option:selected").val(), 10);
					var opt = 0
					switch (opt) {
						case 0: //空闲窗口预览
							ret = spvxOcx.MPV_StartPreview(xml.data)
							break
						case 1: //选中窗口预览
							ret = spvxOcx.MPV_StartPreviewBySelectedWnd(
								xml.data
							)
							break
						case 2: //指定窗口预览
							var vWndIndex = $(
								'#seledWndIndex option:selected'
							).val()
							ret = spvxOcx.MPV_StartPreviewByWndIndex(
								xml.data,
								parseInt(vWndIndex, 10)
							)
							break
						default:
							return
					}
				} else {
					var vDesc =
						'查询预览参数失败，' +
						nodes.errorMessage +
						',错误码为：' +
						nodes.errorCode
					alert(vDesc)
				}
			}
		})
	}
}

//初始化控件
function InitSpvx() {
	var ocxObj = document.getElementById('spv')
	var languageType = 1
	var ret = ocxObj.MPV_Init(languageType)
	if (ret != 0) {
		alert('初始化失败')
	}
	SetLocalParam()
}

//设置本地参数
function SetLocalParam() {
	var ocxObj = document.getElementById('spv')
	var devPxRa = screen.deviceXDPI / screen.logicalXDPI
	var height = $('#spv').height() * devPxRa
	var width = $('#spv').width() * devPxRa
	var xml =
		'<?xml version="1.0" encoding="UTF-8"?> ' +
		'<localParam> ' +
		'<width>' +
		width +
		'</width> ' +
		'<height>' +
		height +
		'</height> ' +
		'<picType>0</picType> ' +
		'<capturePath>C:\\Hikvision\\Snapshot</capturePath> ' +
		'<recordSize>2</recordSize> ' +
		'<recordPath>C:\\Hikvision\\record</recordPath> ' +
		'<limitPreviewTime>1800</limitPreviewTime> ' +
		'<showMsgTip>1</showMsgTip> ' +
		'</localParam>'
	var ret = ocxObj.MPV_SetLocalParam(xml)
	if (ret != 0) {
		alert('设置本地参数失败')
	}
}

//停止所有预览
function stopAllPreview() {
	var ocxObj = document.getElementById('spv')
	var ret = ocxObj.MPV_StopAllPreview()
	if (ret != 0) {
		alert('停止所有预览失败')
	}
}
