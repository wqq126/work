export const message = {
	language: '',
	lang: {
		en: {
			label: '英文',
			value: 'en'
		},
		zh_CN: {
			label: '简体中文',
			value: 'zh_CN'
		}
	},
	systemName: "信息发布管理系统",
	mesCenter: "消息中心",
	hello: "您好，",
	changePsw: "修改密码",
	outLogin: "注销登录",
	outCongirm: "是否退出该系统?",
	outContainUpConfirm:"退出将放弃已选素材上传，确定么？",
	oldPassword: "原密码:",
	newPassword: "新密码:",
	confirmPassword: "确认密码:",
	saveChange: "保存",
	cancelChange: "取消",
	btnBack:"返回",
	noOld: "请输入原密码",
	noNew: "请输入新密码",
	noConfirm: "请输入确认密码",
	noMatch: "两次密码输入不一致",
	changeSuccess: "密码修改成功,请重新登录...",
	none:"无",
	sysTipPre:"对不起，您不是",
	sysTipSuf:",无权操作，请联系管理员",
	sysTimeout:"请求超时，请检查网络或者联系管理员",
	upGlobalTip:"单击查看素材上传，双击隐藏该提示",
	upWaiting:"待上传：",
	uploading:"正在上传：",
	upSuccess:"上传成功：",
	upFail:"上传失败：",
	dataEmptyTip:"暂无数据",
	tokenTimeout:"当前账户在别处登录，请重新登录",
	sessionTimeout:"当前账户登录信息已超时，请重新登录",
	//路由菜单
	menu: {
		home: "首页",
		device: "设备管理",
		authority: "权限管理",
		material: "素材管理",
		release: "发布管理",
		examine: "审核管理",
		systemSetup: "系统设置",
	},
	login: {
		select: "请选择",
		selectLang: "选择语言：",
		welocme: "欢迎进入信息发布系统",
		loginBtn: "登录",
		remember: "记住密码",
		userName: "用户名",
		passWord: "密码",
		noName: "请输入用户名",
		noPsw: "请输入密码"
	},
	//设备管理
	deviceGroup: {
		deviceM: '设备管理',
		groupM: "分组管理",
		deviceInfo: "设备信息",
		timingTask: "设备控制",
		addGroup:"增加分组",
		addPeers: "增加同级分组",
		addChildG: "增加下级分组",
		btnDel: "删除",
		No: "序号",
		name: "名称",
		grade: "级别",
		deviceNum: "设备数量",
		operate: "操作",
		edit: "编辑",
		transferDev: "导入设备",
		groupAdd: "分组添加",
		groupEdit: "分组编辑",
		groupName: "分组名称：",
		btnOk: "确定",
		btnCancel: "取消",
		btnRecover:"恢复",
		deviceSel: "已选设备",
		deviceUnSel: "可选设备",
		deviceName: "设备名称",
		deviceIpName:"名称/IP",
		deviceModel: "设备型号",
		btnTransIn: "<< 导入",
		btnTransOut: "移除 >>",
		btnSave: "保存",
		requireName: "请输入名称",
		addSuccess: "添加成功",
		editSuccess: "编辑成功",
		delSuccess: "删除成功",
		delDevice: "删除分组？",
		chooseTransIn: "请选择需要导入的设备",
		chooseTransOut: "请选择需要删除的设备",
		deviceNotChange: "设备没有变化",
		transferSuccess: "设备导入成功",
		all: "全部",
		groupLtOne:"分组不能多于一个",
		defaultGroupTop:"分组未选择，默认为一级分组",
		groupMustOne:"分组必须选择且仅能选择一个",
		selectGroupToDel:"请选择需要删除的分组",
		gradeOne:"一级分组",
		gradeTwo:"二级分组",
		gradeThree:"三级分组",
		gradeFour:"四级分组",
		gradeFif:"五级分组",
		gradeSix:"六级分组",
		//设备信息
		groupSearch: "所在分组：",
		groupAt:"所在分组",
		IPorName: "请输入IP/名称",
		selectGroup: "请选择分组",
		deviceModel:"型号",
		status:"状态",
		remark:"备注",
		online:"在线",
		offline:"离线",
		groupModel_L: "型号：",
		selectModel: "请选择型号",
		changeGroupBtn:"换组",
		changeGroup: "换组",
		search: "搜索",
		detailInfo: "详情",
		btnRefresh:"刷新",
		btnBack: "返回",
		name_L: "名称：",
		model_L: "型号：",
		status_L: "状态：",
		remark_L: "备注：",
		group_L: "分组：",
		storageTotal_L:"总内存：",
		storageAvaiable_L:"可用内存：",
		startMT: "开机时间：",
		endMT: "关机时间：",
		deviceShoot: "设备截图",
		changeGroupTip: "移至",
		deviceNameRequire:"请输入设备名称",
		refreshSuccess:"刷新成功",
		selectDeviceToChange: "请选择需要换组的设备",
		selectGroupToChange: "请选择交换的分组",
		changeGroupConfirm: "确认交换分组？",
		changeGroupSuccess: "交换成功",
		selectDeviceToDel: "请选择需要删除的设备",
		delConfirm: "确认删除已选择的设备？",
		//定时任务
		taskName:"任务名称",
		taskType:"任务类型",
		taskType_L:"任务类型：",
		timingSwitch:"定时开关机",
		stopPlay:"暂停播放",
		placeholderTaskName:"请输入任务名称",
		startTime:"开机时间",
		endTime:"关机时间",
		creator:"创建者",
		circleModel:"循环模式",
		device:"设备",
		taskAdd:"添加任务",
		taskEdit:"编辑任务",
		taskName_L:"任务名称：",
		circulation:"循环模式：",
		btnStop:"暂停",
		cycleOnce:"只执行一次",
		cycleContinus:"每天",
		cycleCustom:"自定义",
		taskContinue:"持续",
		monday:"星期一",
		tuesday:"星期二",
		wednesday:"星期三",
		thursday:"星期四",
		friday:"星期五",
		sateday:"星期六",
		sunday:"星期日",
		chooseDev:"选择设备",
		weeksNotNull:"请选择循环日期",
		startLgend:"关机时间要在开机时间之后",
		taskNameNotNull:"请输入任务名称",
		startNotNull:"请输入开机时间",
		endNotNull:"请输入关机时间",
		delTaskNotNull:"请选择需要删除的任务",
		confirmDelTask:"确认删除选择的定时任务？",
		deviceNotNull:"请选择需要定时的设备",
		pauseTaskConfirm:"确认暂停任务:",
		recoverTaskConfirm:"确认恢复任务:",
		pauseSuccess:" 任务已暂停",
		recoverSuccess:"任务已恢复",
		paused:"暂停",
		working:"执行中",
		ended:"已结束",
		taskHasPaused:"该任务已经暂停，无需处理"
	},
	//素材管理
	material: {
		materialM: "素材管理",
		media: "流媒体",
		mediaMaterial: "多媒体素材",
		placeholderFileName: "请输入文件名",
		type_L: "类型：",
		placeholderType: "请选择类型",
		btnDel: "删除",
		btnPreview:"预览",
		btnUpload: "上传文件",
		btnMedia: "添加流媒体",
		btnSearch: "搜索",
		btnEdit: "编辑",
		download:"下载",
		btnOk: "确定",
		btnCancel: "取消",
		No: "序号",
		fileName: "文件名",
		size: "大小",
		type: "类型",
		duration: "时长",
		duration_L: "时长：",
		uploadTime: "上传日期",
		uploadTime_L: "上传日期：",
		examineStatus: "审核状态",
		using:"使用中",
		unUse:"未使用",
		operate: "操作",
		remark_L: "备注：",
		placeholderMediaList: "请选择流媒体地址",
		mediaAddress_L: "流媒体地址：",
		addressList_L: "地址列表：",
		addressImportType_L: "地址输入方式：",
		mediaName_L: "流媒体名称：",
		importByHand: "手动输入",
		addressList: "地址列表",
		materialEdit: "素材编辑",
		name_L: "名称：",
		size_L: "大小：",
		type_L: "类型：",
		examine_L: "审核：",
		examineSuggest_L: "审核意见：",
		remark_L: "备注信息：",
		nameNotNull: "请输入流媒体名称",
		materialNotNull: "请输入流媒体地址",
		materialNotSel: "请选择流媒体地址",
		materialNameNotNull: "请输入素材名称",
		updateSuccess: "更新成功",
		addSuccess: "添加成功",
		delSuccess: "删除成功",
		unAudit: "未审核",
		passAudit: "通过审核",
		auditFailed: "未通过",
		mediaAdd: "流媒体添加",
		mediaEdit: "流媒体编辑",
		selMaterialToDel:"请选择需要删除的素材",
		selMediaToDel:"请选择需要删除的流媒体",
		delConfirm: "确认删除选中的素材吗？",
		delMediaConfirm: "确认删除选中的流媒体吗？",
		btnBack:"返回",
		uploadStart:"开始上传",
		upLoadContinue:"继续添加",
		upFile:"选择文件",
		location:"位置",
		remark:"备注",
		status:"状态",
		status_L:"状态：",
		filename_L:"文件名称：",
		editFile:"文件编辑",
		waitingUp:"待上传",
		uploading:"上传中",
		uploadSuccess:"上传成功",
		fileExist:"上传失败，文件名已存在",
		upDelConfirm:"确定删除上传",
		stopUpload:"离开页面将退出上传",
		mediaAddressError:"流媒体地址错误，请检查地址是否正确"
	},
	//系统设置
	systemSet: {
		title: "系统设置",
		baseSet: "基本设置",
		playRecord: "播放记录",
		actionLog: "操作日志",
		onlineUpgrade: "在线升级",
		//baseSet
		logTitle: "系统运行日志下载",
		logtext: "点击右侧下载按钮可下载系统运行日志，帮助排查系统运行故障。",
		logBtn: "日志下载",
		downSet:"下载设置",
		leisureTime:"闲暇时下载",
		setWarming:"每次下载优先安排在",
		endWarming:"后下载",
		selectTime:"选择时间",
		channelTitle: "点播直播通道设置",
		channelText: "点用于点播直播视频的接入：设置完成后信息发布素材可应用点播直播视频。",
		channelLable: "点播直播频道：",
		channelBtn: "保存",
		versionInfo: "版本信息",
		webVersion: "前端版本：",
		serverVersion: "后台版本：",
		packVersion: "软件版本：",
		codeVersion: "代码版本：",
		saveFail: "保存失败！",
		getFail: "获取通道失败！",
		downFail: "下载日志失败",
		setSuccess:"设置成功",
		selectWarning:"请选择下载时间！",
		moreBtn:"更多",
		switchSet:"权限开关设置",
		auditSwitch:"审核开关：",
		auditFuc:"审核功能：开启后，所有播放任务需通过审核后才会在终端播放",
		deviceSwitch:"设备分配开关：",
		deviceFuc:"设备分配功能：开启后，用户可绑定设备分组，用户即可操作所绑定分组内的设备",
		taskSwitch:"任务编辑开关：",
		taskFuc:"任务编辑功能: 开启后，所有任务只有创建人员和超级管理员可修改，其他用户只能保存为模板后，重新创建内容相同的任务",
		onFlag:"开启",
		offFlag:"关闭",
		detailed:"详细",
	    takeUp:"收起",
		//ActionLog
		timeSlot: "时间段",
		startDate: "开始日期",
		endDate: "结束日期",
		searchBtn: "搜索",
		deletBtn: "批量删除",
		updateBtn: "刷新",
		exportBtn: "导出",
		orderNum: "序号",
		actionDetail: "操作明细",
		userName: "用户",
		loginIp: "登录IP",
		time: "时间",
		action: "操作",
		singleDel: "删除",
		//播放记录
		taskName:"任务名称",
		publishDate:"发布时间段：",
		layout:"节目",
		Publisher:"发布人",
		publishTime:"发布时间",
		releaseTerminal:"发布终端",
		startTime:"开始时间",
		endTime:"结束时间",

		//弹出信息
		delConfirm: "确认删除所选数据吗 ?",
		delSuccess: "删除成功 !",
		delFail: "删除失败 ！",
		noSelect: "请先选择要删除的数据 !",
		endStart: "结束时间要大于开始时间!",

		//OnlineUpgrade
		model: "型号",
		upgradeBtn: "升级",
		deviceName: "设备名",
		deviceStatus: "状态",
		ifSupportUp: "是否支持升级",
		version: "版本号",
		offLine: "离线",
		onLine: "在线",
		yes: "是",
		no: "否",
		dilogTile: "设备升级",
		onlinePackage: "在线升级包",
		localPackage: "升级包",
		warmText: "请上传或选择一个升级包",
		pleaseSelect: "请选择",
		confirmBtn: "确 定",
		cancelBtn: "取 消",
		scan: "浏 览",
		//弹出提示
		noselectDevice: "请先选择要升级的设备 !",
		noUpStyle: "请至少选择一种升级方式 !",
		upgradeSuccess: "升级成功 ！",
		errorText: "服务器异常，请稍后再试 ！",
		fileTypeWarning:"请选择.lonbon升级包！",
		upGradeLoading: "升级中请稍后...",
		upGradeLoad: "上传升级中,请稍后...",

	},
	//首页
	home: {
		nodata: "无数据统计",
		version: {
			server: "软件版本",
			web: "web版本号"
		},
		material: {
			title: "素材种类",
			subtitle: "素材种类",
			pictures: "图片",
			videos: "视频",
			files: "文档",
			others: "其他",
			total: "总计",
			duan: "段",
			zhang: "张",
			ge: "个",
			fen: "份"
		},
		device: {
			title: "设备状态",
			subtitle: "设备状态",
			active: "活跃",
			free: "空闲",
			off: "离线"
		},
		disk: {
			title: "磁盘使用",
			subtitle: "磁盘使用",
			used: "已用空间",
			available: "可用空间"
		},
		cpu: {
			title: "CPU使用",
			subtitle: "CPU使用",
			used: "已使用",
			unused: "未使用"
		}
	},
  //   wqq开始
//发布管理
  releaseManage: {
		second:'秒',
		pauseTask:'暂停',
		startTask:'开始',
		noname:'暂无名称',
		notSupportedMessage:'视频因格式不支持或者服务器或网络的问题无法加载。',
		empty_data:'暂无数据',
    deleted_deleted:'已取消删除',
    menu: {
      templateManage: '模板管理',
      layoutManage: '节目管理',
      taskManage: '任务管理',
      messageManage:'通知管理'
    },
    operation:'操作',
    delete:'删除',
    okBtn:'确定',
    delete_sure:'确定删除',
    tip:'提示',
    author:'作者',
    state:'状态',
    proportion:'比例',
    edit:'编辑',
    preview:'预览',
    name:'名称',
    template:'模板',
    remark:'备注',
    template_name:'模板名称',
    duration:'持续时间',
    StretchingMode:'拉伸方式',
    HorizontalPosition:'水平位置',
    VerticalPosition:'垂直位置',
    RegionalTime:"区域时间轴",
    effect:'效果',
    speed:'速度',
    backgroundcolor:'背景色',
    webpageUrl:'网址',
    keepaspectratio:'保持宽高比',
    stretching:'拉伸',
    left:'左',
    right:'右',
    center:'居中',
    bottom:'下',
    top:'上',
    effect_none:'无',
    effect_left:'跑马灯向左',
    effect_right:'跑马灯向右',
    effect_top:'跑马灯向上',
    effect_bottom:'跑马灯向下',
		select_template:'请选择模板'

  },
  //节目管理
  layoutManage:{
		layout_template_delete:'取消所选模板',
    back_sure:'确定返回  ?',
	  default_layout:'默认节目',
    save_default_success:'默认节目保存成功',
	  save_default:'存为默认节目',
    cancel_save_default:'取消保存',
    only_one:'请选择一个节目，只能选择一个',
    layout_delete_success:'节目删除成功',
    layout_delete_error:'节目删除失败',
    design_btn:'设计',
    save_default:'设为默认',
    add_layout:'添加节目',
    edit_layout:'修改节目',
    nodata:'暂无数据',
    deletSelect:'请至少选择一个节目',
    layout_name:'节目名称不能为空',
    back:'返回',
    save:'保存',
    update_display:'更新至显示器',
    save_as_template:'另存为模板',
    change_group:'换组',
    preview:'预览',
    search:'搜索',
    add_media_success:'素材增加成功',
    add_media_error:'素材增加失败',
    edit_media_success:'素材编辑成功',
    edit_media_error:'素材编辑失败',
    add_region_success:'区域增加成功',
    add_region_error:'区域增加失败',
    dele_region_error:'区域删除失败',
    dele_region_success:'区域删除成功',
    pre_media:'已经是第一个了',
    next_media:'已经是最后一个了',
    media_order_success:'素材排序成功',
    layout_edit_success:'修改区域成功',
    layout_edit_error:'修改区域失败',
    design:{
      updata_display_success:'更新到显示器成功',
      updata_display_error:'更新到显示器失败'
    },
    edit_layout_success:'节目修改成功',
		layout_weburl:'网址不能为空',
  },
  //节目设计
  layoutDesign:{
    image:'图片',
    live:'流媒体',
    video:'视频',
    text:'文本',
    webpage:'网页',
    background:'背景',
    fontSize:'字号',
    color:'颜色',
    addmedia:'增加素材',
    editmedia:'编辑素材',
    duration_error:'持续时间必须为数字',
    url_error:'URL不合法',
    dbclick_add_time:'可用的时间格式(双击可加入编辑框)'
  },
  //任务管理
  taskManage:{
		video_task:'任务节目中有视频时长为',
		sure_save:'确定保存',
		wait_audit:'等待审核',
		task_cycle_starttime_error:'循环开始时间应在任务开始时间之后',
		task_cycle_endtime_error:'循环结束时间应在任务结束时间之前',
  	tooltipJump:'无权编辑，将进入预览',
    tooltip1:'对不起，您不是',
    tooltip2:'无权操作，请联系管理员',
    broadcast:'已发布',
    finished:'已结束',
    not_beginning:'未发布',
    failure_audit:'未通过审核',
    wait_audit:'待审核',
    through_audit:'通过审核',
    select_plac:'请选择',
    task_title_add:'添加任务',
    task_title_edit:'编辑任务',
    deletSelect:'请至少选择一个任务',
    add_task:'添加任务',
    emergency_stop:'紧急停止',
    task_name:'任务名称',
    task_type:'任务类型',
    task_status:'状态',
    broadcast_state:'发布状态',
    time_slot:'时间段',
    creator:'创建者',
    terminal:'终端',
    layout:'节目',
    operation:'操作',
    selection_device:'选择设备',
    this_task:"本次任务",
    valid_period_to:'有效期到',
    play_button:'播放按照',
    week:'周',
    day:'天',
    Number:'号',
    month:'月',
    once_cycle:'单次循环',
    monday:'周一',
    tuesday:'周二',
    wednesday:'周三',
    thursday:'周四',
    friday:'周五',
    saturday:'周六',
    sunday:'周日',
    cycle_time:'循环时每',
		cycle_time_once:'循环从',
    start:'开始',
    end:'结束',
    continue_to:'持续到每',
		continue_to_once:'持续到',
    cycle:'循环',
    cycle_start:'循环开始',
    cycle_end:'循环结束',
    task_name_no:'任务名称不能为空',
    task_type_no:'任务类型不能为空',
    task_layout_no:'节目不能为空',
    task_start_time:'有效期开始时间不能为空',
    task_end_time:'有效期结束时间不能为空',
    task_end_time_error:'有效期结束时间不能小于开始时间',
    task_cycle_start_time:'循环开始时间不能为空',
    task_cycle_end_time:'循环结束时间不能为空',
    selectGroup:'请选择任务分组',
    nogroup:'未分组',
    endDateError:'结束日期应大于开始日期',
    add_task_success:'任务添加成功',
    edit_task_success:'任务修改成功',
    delete_task_success:'任务删除成功',
    delete_task_error:'任务删除失败',
    select_month_day:'请选择月号',
    select_week_day:'请选择星期',
    select_time_duration:'请选择时间段'

  },
//通知管理
	messageManage:{
		action:{
			resend:'重发',
			details:'详情',
			delete:'删除',
		},
		num:'序号',
		options:'操作',
		post_message:'发布新通知',
		message_content:'通知正文',
		device:'设备分组',
		duration:'持续时长',
		processing:'进行中',
		over:'已结束',
		state:'状态',
		publisher:'发布人员',
		release_date:'发布日期',
		new_message:'新通知',
		choose_dev:'选择设备',
		Choosedev:'发布设备',
		messageContent:'消息正文',
		level:'通知等级',
		Ordinary_notice:'普通通知',
		Important_notice:'重要通知',
		title:'通知标题',
		Release:'发布',
		Cancel:'取消',
		Day:'天',
		Hour:'时',
		Min:'分',
		Notification_title:'通知标题',
		Font_size:'字体大小',
		add_material:'添加素材',
		selected_material:'已选素材',
		close:'关闭',
		Back:'返回',
		Sure:'确定',
		Message_details:'通知详情',
		Search_material:'搜索素材',
		Resend:'确认重新发布吗',
		Limit:'不超过140字',
		Nodata:'暂无数据',
		Resend_fail:'重发失败！',
		Nan:'请输入数字！',
		Nodevice:'请选择带设备的分组！',
		rule:{
			title:'请输入通知标题',
			message:'请输入通知内容',
			level:'请选择通知等级',
			day:'请输入持续时长',
			hour:'请输入持续时长',
			min:'请输入持续时长',
			device:'请选择发布设备',
		},
	},
//模板管理
  templateManage: {
    action: {
      importBn: '导入',
      application: '应用到节目',
      batchDeleting: '批量删除'
    },
    deletSelect: '请至少选择一个模板',
    template_delete_success:'模板删除成功',
    template_delete_error:'模板删除失败',
    use_template_no:'请选择一个模板',
    loading:'正在加载...',
    nomore:'没有更多数据了...'

  },
  // 审核管理
  examineManage:{
    examineManage:'审核管理',
    input_name:'请输入名称',
    type:'类型',
    status:'状态',
    please_select:'请选择',
    search:'搜索',
    change_group:'换组',
    create_time:'创建时间',
    adopt:'通过',
    reject:'驳回',
    reject_reason:'驳回理由',
    adopt_reason:'通过理由',
    reason:'理由',
    aduit_success:'审核成功',
    deletSelect:'请至少选择一个删除项',
    delete_success:'删除成功',
    reason_error:'理由不能为空',
    adopt_sure:'确定通过审核，通过后会推送到设备'
  },
//   wqq结束
	authority: {
		title: "权限管理",
		tabRole: "角色管理",
		tabUser: "用户管理",
		btnDelete: "删除",
		btnEdit: "编辑",
		btnSave: "保存",
		btnCancle: "取消",
		all: "全部",
		firstUser: "初始账户",
		role: {
			index: "序号",
			name: "角色名称",
			authority: "权限",
			operate: "操作",
			btnAdd: "添加角色",
			addTitle: "添加角色",
			editTitle: "编辑角色",
			tips: {
				title: "提示",
				name: "请输入角色名称",
				authority: '请至少选择一项权限',
				addSuccess: '角色添加成功',
				addFailure: '角色添加失败',
				editSuccess: '角色编辑成功',
				editFailure: '角色编辑失败',
				delSuccess: '角色删除成功',
				delFailure: '角色删除失败',
				delConfirm: '确认删除该记录吗?',
				delCheck: '请先勾选需要删除的角色'
			}
		},
		user: {
			index: "序号",
			name: "姓名",
			username: "用户名",
			role: "角色",
			organization: "设备分组",
			password: "登录密码",
			operate: "操作",
			btnAdd: "添加用户",
			addTitle: "添加用户",
			editTitle: "编辑用户",
			tips: {
				title: "提示",
				username: "请输入用户名称",
				password1: '请输入登录密码',
				password2: '请输入6到12位字符',
				fullname: '请选择输入姓名',
				role: '请选择角色',
				organization: '请至少选择一项设备分组',
				addSuccess: '用户添加成功',
				addFailure: '用户添加失败',
				editSuccess: '用户编辑成功',
				editFailure: '用户编辑失败',
				delSuccess: '用户删除成功',
				delFailure: '用户删除失败',
				delConfirm: '确认删除该记录吗?',
				delCheck: '请先勾选需要删除的用户',
				notAdmin: "admin是系统用户，不能删除",
				notAdminEdit: "admin是系统用户，您不能进行编辑"
			}
		}
	}
}
