<template>
	<div class="deviceInfo">
		<el-row>
			<el-row class='item operateBox'>
				<!--请输入IP/名称-->
				<el-input v-model="deviceIpN" @keydown.enter.native='searchDev' :placeholder="$t('message.deviceGroup.IPorName')" prefix-icon="el-icon-search"></el-input>
				<!--所在分组：-->
				<label for="">{{this.$t('message.deviceGroup.groupSearch')}}</label>
				<el-select v-model="group" @change='searchDevByGroupOrModel' :placeholder="$t('message.deviceGroup.selectGroup')">
					<el-option v-for="groupTmp in groupArr" :key='groupTmp.id' :label="groupTmp.displayGroup" :value="groupTmp.id"></el-option>
				</el-select>
				<label for="">{{this.$t('message.deviceGroup.groupModel_L')}}</label>
				<el-select v-model="devType" @change="searchDevByGroupOrModel" :placeholder="$t('message.deviceGroup.selectModel')">
					<el-option v-for='(device, index) in deviceTypeList' v-if='device.deviceModel' :key='index' :label="device.deviceModel" :value="device.deviceModel"></el-option>
				</el-select>
				<!--删除-->
				<el-button type="primary" class='mybtn-primary' @click="delDevice">{{this.$t('message.deviceGroup.btnDel')}}</el-button>
				<!--换组-->
				<el-button type="primary" class='mybtn-primary' @click="changeGroupBatch">{{this.$t('message.deviceGroup.changeGroupBtn')}}</el-button>
				<!--搜索-->
				<el-button id='search' type="primary" class='mybtn-primary' @click="searchDev">{{this.$t('message.deviceGroup.search')}}</el-button>
			</el-row>

		</el-row>
		<el-table ref="multipleTable" :data="deviceArr" highlight-current-row v-loading="listLoading" height="calc(100% - 90px - 2.5em)" style="width: 100%;" @selection-change="deviceSel">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column type="index" :index='getTabIndex' :label="$t('message.deviceGroup.No')" width="70">
			</el-table-column>
			<el-table-column :label="$t('message.deviceGroup.name')" show-overflow-tooltip prop='display' style="width:8%">
			</el-table-column>
			<el-table-column prop="clientAddress" label="IP" width='150'>
			</el-table-column>
			<el-table-column prop="deviceModel" :label="$t('message.deviceGroup.deviceModel')" style="width:8%;">
			</el-table-column>
			<el-table-column prop="loggedIn" :label="$t('message.deviceGroup.status')" width="100">
				<template slot-scope="scope">
					<span class='offline' v-if='scope.row.loggedIn==0'>{{$t('message.deviceGroup.offline')}}</span>
					<span v-else class='online'>{{$t('message.deviceGroup.online')}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='description' show-overflow-tooltip :label="$t('message.deviceGroup.remark')" style="width:13%">
				<template slot-scope='scope'>
					<!--<el-tooltip v-if='scope.row.description' :content='scope.row.description' class="item" effect="dark" placement='top' >
						<div class='cell'>{{scope.row.description}}</div>
					</el-tooltip>-->
					<span>{{scope.row.description}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="groups" :label="$t('message.deviceGroup.groupAt')" style="width:8%">
				<template slot-scope='scope'>
					<el-tooltip v-if='scope.row.groups' :content='scope.row.groups' class="item" effect="dark" placement='top' >
						<div class='cell'>{{scope.row.groups}}</div>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="timeOn" :label="$t('message.deviceGroup.startTime')" style="width:6%;">
				<template slot-scope="scope">
        <el-popover trigger="hover" placement="top" effect="dark">
        	<p v-for="(timeTask, index) in scope.row.timeInfo">
        		<span>{{ timeTask.task_name}}:{{timeTask.task_start}}-{{timeTask.task_end}}
        		<span v-if='timeTask.task_type==0'>({{$t('message.deviceGroup.cycleOnce')}})</span>
        		<span v-else-if='timeTask.task_type==1'>({{$t('message.deviceGroup.cycleContinus')}})</span>
        		<span v-else>({{getCycleWeek(timeTask.days)}})</span>
        		</span>
        	</p>
          <div slot="reference" class="name-wrapper">
            {{getTaskTime(scope.row.timeInfo, 1)}}
          </div>
        </el-popover>
      </template>
			</el-table-column>
			<el-table-column prop="timeOff" :label="$t('message.deviceGroup.endTime')" style="width:6%;">
				<template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
        	<p v-for="(timeTask, index) in scope.row.timeInfo">
        		<span>{{ timeTask.task_name}}:{{timeTask.task_start}}-{{timeTask.task_end}}
        		<span v-if='timeTask.task_type == 0'>({{$t('message.deviceGroup.cycleOnce')}})</span>
        		<span v-else-if='timeTask.task_type == 1'>({{$t('message.deviceGroup.cycleContinus')}})</span>
        		<span v-else>({{getCycleWeek(timeTask.days)}})</span>
        		</span>
        	</p>
          <div slot="reference" class="name-wrapper">
            {{getTaskTime(scope.row.timeInfo, 0)}}
          </div>
        </el-popover>
      </template>
			</el-table-column>
			<el-table-column :label="$t('message.deviceGroup.operate')" width="350">
				<template slot-scope="scope">
					<!--详情-->
					<el-button @click="detailInfo(scope.row.id, scope.row.groups)" type="text" class='tableBtn' size="medium">{{$t('message.deviceGroup.detailInfo')}}</el-button>
					<!--编辑-->
					<el-button @click="editDevice(scope.row.id, scope.row.groups)" type="text" class='tableBtn' size="medium">{{$t('message.deviceGroup.edit')}}</el-button>
					<!--换组-->
					<el-button @click="changeGroup(scope.row)" type="text" class='tableBtn' size="medium">{{$t('message.deviceGroup.changeGroup')}}</el-button>
					<!--删除-->
					<el-button @click="del(scope.row.id)" type="text" class='tableBtn' size="medium">{{$t('message.deviceGroup.btnDel')}}</el-button>
				</template>
			</el-table-column>
			<div slot='empty'>
				<p>{{emptyDataTip}}</p>
			</div>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination background layout="total,sizes,prev, pager, next,jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30, 50]" :page-size="limit" :current-page="page" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--TODO-->
		<div id='widthTest'>{{title}}</div>
		<!--设备详情-->
		<el-dialog :title="devDetailTitle" :close-on-click-modal='false' :class='{hide:showTitle}' @close='initDetailBox' @opened='openDetail' id='deviceDetail' :visible.sync="centerDialogVisible" :modal='firstLoad' width="40%" center>
			<el-row v-if='!editFlag' class='refresh'>
				<el-button icon='el-icon-refresh' id='refreshBtn' @click="refreshDevice" :loading='refreshBtn'>{{this.$t('message.deviceGroup.btnRefresh')}}</el-button>
				<!--<span class='refreshBtn' @click="refreshDevice" :disabled='refreshBtn'>
					<img src="../../../static/images/refresh.png" :alt="$t('message.deviceGroup.btnRefresh')"/>{{this.$t('message.deviceGroup.btnRefresh')}}</span>-->
			</el-row>
			<el-row :gutter='15'>
				<!--名称-->
				<el-col :span='10' class='ellipsis' :offset='2'><span>{{this.$t('message.deviceGroup.name_L')}}</span>
					<!--<el-tooltip v-show='editFlag' class="item" effect="dark" :content="deviceInfo.display" placement="top">
						<el-input v-model='deviceInfo.display'></el-input>
					</el-tooltip>
					<el-tooltip v-show='!editFlag' class="item" effect="dark" :content="deviceInfo.display" placement="top">
						<div class='inline' v-text='deviceInfo.display'></div>
					</el-tooltip>-->
					
					<el-tooltip v-if='showDisplayTitle' v-show='editFlag' class="item" effect="dark" :content="deviceInfo.display" placement="top">
						<el-input v-model='deviceInfo.display'></el-input>
					</el-tooltip>
					<el-input v-else-if='editFlag' v-model.trim='deviceInfo.display'></el-input>
					<div class='inlineLeft' v-else v-text='deviceInfo.display'></div>
					<el-tooltip v-if='showDisplayTitle' v-show='!editFlag' class="item" effect="dark" :content="deviceInfo.display" placement="top">
						<div class='inlineLeft' v-text='deviceInfo.display'></div>
					</el-tooltip>
				</el-col>
				<el-col :span='12'><span class='labelLeft'>&nbsp;&nbsp;&nbsp;&nbsp;IP：</span><div class='inline' v-text='deviceInfo.clientAddress'></div></el-col>
				</el-row　>
				<el-row :gutter='15'>
					<!--型号：-->
					<el-col id='DeviceModel' :span='10' class='ellipsis' :offset='2'><span>{{this.$t('message.deviceGroup.model_L')}}</span><span v-text='deviceInfo.deviceModel'></span></el-col>
					<!--状态:-->
					<el-col :span='12'><span class='labelLeft'>{{this.$t('message.deviceGroup.status_L')}}</span>
						<div class='inline offline' v-if='deviceInfo.loggedIn==0'>{{$t('message.deviceGroup.offline')}}</div>
						<div class='inline online' v-else>{{$t('message.deviceGroup.online')}}</div>
					</el-col>
				</el-row>
				<el-row :gutter='15'>
					<!--备注：-->
					<el-col :span='10' :offset='2' class='ellipsis'><span>{{this.$t('message.deviceGroup.remark_L')}}</span>
						<el-tooltip v-if='showRemarkTile' v-show='editFlag' class="item" effect="dark" :content="deviceInfo.description" placement="top">
							<el-input v-model='deviceInfo.description'></el-input>
						</el-tooltip>
						<el-input v-else-if='editFlag' v-model.trim='deviceInfo.description'></el-input>
						<div class='inlineLeft' v-else v-text='deviceInfo.description'></div>
						<el-tooltip v-if='showRemarkTile' v-show='!editFlag' class="item" effect="dark" :content="deviceInfo.description" placement="top">
							<div class='inlineLeft' v-text='deviceInfo.description'></div>
						</el-tooltip>
					</el-col>
					<!--分组:-->
					<!--<el-tooltip class="item" effect="dark" :content="deviceInfo.groupName" placement="top">
						<el-col :span='12'><span>{{this.$t('message.deviceGroup.group_L')}}</span><div class='inline ellipsis' v-text='deviceInfo.groupName'></div></el-col>
					</el-tooltip>-->
					
					<el-col :span='12' class='ellipsis'>
						<span class='labelLeft'>{{this.$t('message.deviceGroup.group_L')}}</span>
						<!--<el-tooltip class="item" effect="dark" :content="deviceInfo.groupName" placement="top">
							<div class='inline' v-text='deviceInfo.groupName'></div>
						</el-tooltip>-->
						
						<el-tooltip v-if='showGroupTitle' class="item" effect="dark" :content="deviceInfo.groupName" placement="top">
							<div class='inline' v-text='deviceInfo.groupName'></div>
						</el-tooltip>
						<div v-else class='inline' v-text='deviceInfo.groupName'></div>
					</el-col>
				</el-row>
				<el-row :gutter='15'>
					<!--总存储：-->
					<el-col :span='10' :offset='2'><span>{{this.$t('message.deviceGroup.storageTotal_L')}}</span><span v-text='deviceInfo.storageTotalSpace + "GB"'></span></el-col>
					<!--状态:-->
					<el-col :span='12'><span class='labelLeft'>{{this.$t('message.deviceGroup.storageAvaiable_L')}}</span>
						<span v-text='deviceInfo.storageAvailableSpace + "GB"'></span>
					</el-col>
				</el-row>
				<el-row :gutter='15'>
					<!--开机时间：-->
					<el-col :span='10' class='ellipsis' :offset='2'><span>{{this.$t('message.deviceGroup.startMT')}}</span>
						<span v-if='deviceInfo.timeOn==""'>{{this.$t('message.none')}}</span>
						<el-tooltip v-else-if='showGroupTitle' class="item" effect="dark" :content="deviceInfo.timeOn" placement="top">
							<div class='inline' v-text='deviceInfo.timeOn'></div>
						</el-tooltip>
						<div v-else class='inline' v-text='deviceInfo.timeOn'></div>
					</el-col>
					<!--关机时间：-->
					<el-col :span='12' class='ellipsis'><span class='labelLeft'>{{this.$t('message.deviceGroup.endMT')}}</span>
						<span v-if='deviceInfo.timeOff==""'>{{this.$t('message.none')}}</span>
						<el-tooltip v-else-if='showGroupTitle' class="item" effect="dark" :content="deviceInfo.timeOff" placement="top">
							<div class='inline' v-text='deviceInfo.timeOff'></div>
						</el-tooltip>
						<div v-else class='inline' v-text='deviceInfo.timeOff'></div>
					</el-col>
				</el-row>
				<!--<el-row :gutter='15'>
					
				</el-row>-->
				<el-row id="videoBox">
					<img :src="deviceBg" :style='screenShot' :alt="$t('message.deviceGroup.deviceShoot')" />
				</el-row>

				<span slot="footer" class="dialog-footer">
					<el-button v-if='editFlag' type="primary" @click="editSave" class='mybtn-primary'>{{this.$t('message.deviceGroup.btnSave')}}</el-button>
					<!--<el-button v-else type="primary" @click="refreshDevice" :loading='refreshBtn' class='mybtn-primary'>{{this.$t('message.deviceGroup.btnRefresh')}}</el-button>-->
			    	<el-button type="primary" @click="centerDialogVisible = false" class='mybtn-primary'>{{this.$t('message.deviceGroup.btnBack')}}</el-button>
				</span>
		</el-dialog>

		<!--换组-->
		<el-dialog :title="$t('message.deviceGroup.changeGroup')" :close-on-click-modal='false' @close='initChangeBox' id='changeGroup' :visible.sync="changeGroupFlag" width="30%" height="60%" center>
			<!--当前分组：-->
			<el-tooltip class="item" effect="dark" :content="groupName" placement="top">
				<el-row class='groupInfo'>{{this.$t('message.deviceGroup.groupSearch')}}&nbsp;<span v-text='groupName'></span>
				</el-row>
			</el-tooltip>
			<el-row style='text-align:center;'>
				<img src="../../../static/images/changeDown.png" alt="" /><span class='imgTip'>{{this.$t('message.deviceGroup.changeGroupTip')}}</span>
			</el-row>
			<el-tree :data="groupInfo" show-checkbox node-key="id" check-strictly @check='changeGroupBtn' ref="tree" accordion highlight-current :props="defaultProps">
			</el-tree>

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="changeGroupSave" class='mybtn-primary'>{{this.$t('message.deviceGroup.btnOk')}}</el-button>
				<el-button type="primary" @click="changeGroupFlag = false" class='mybtn-primary'>{{this.$t('message.deviceGroup.btnCancel')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		http
	} from "../../api/config";
	export default {
		name: 'deviceInfo',
		data() {
			return {
				//分组筛选ID
				group: '',
				//用于筛选的名称或IP
				filterDeviceIpN: '',
				//名称或者IP
				deviceIpN: '',
				//设备型号
				devType: '',
				selDevice: [],
				deviceArr: [],
				deviceTypeList: [],
				//设备群组
				groupArr: [],
				total: 0,
				limit: 20,
				page: 1,
				devDetailTitle:'',
				userId: localStorage.getItem("userId"),
				listLoading: true,
				//详情弹出框
				centerDialogVisible: true,
				editFlag: false,
				deviceInfo: {
					id: 0,
					display: "",
					clientAddress: '',
					deviceModel: '',
					loggedIn: 0,
					lastAccessed: '',
					defaultLayoutId: 0,
					description: "",
					thumb: '',
					runtime: '',
					timeOn: '',
					timeOff: '',
					groupName: '',
					storageTotalSpace:'',
					storageAvailableSpace:'0'
				},
				deviceBg: '',
				screenShot: {
					height: '200px',
					width: '200px'
				},
				groupInfo: [],
				//换组的设备ID
				deviceId: '0',
				groupName: '',
				//换组弹框
				changeGroupFlag: false,
				//树插件默认配置
				defaultProps: {
					children: 'child',
					label: 'displayGroup'
				},
				//刷新按钮的显示与隐藏
				refreshBtn: false,
				title:'',
				showTitle:true,
				showRemarkTile:false,
				showGroupTitle:false,
				showDisplayTitle:false,
				showTaskStart:false,
				showTaskEnd:false,
				emptyDataTip:"",
				firstLoad:false,
				cycleDateArr:[
					this.$t('message.deviceGroup.monday'),
					this.$t('message.deviceGroup.tuesday'),
					this.$t('message.deviceGroup.wednesday'),
					this.$t('message.deviceGroup.thursday'),
					this.$t('message.deviceGroup.friday'),
					this.$t('message.deviceGroup.sateday'),
					this.$t('message.deviceGroup.sunday')
				],
			}
		},
		methods: {
			getDeviceList() {
				let ListConfig = {
					url: http.deviceList,
					type: 'GET',
					data: {
						limit: this.limit,
						page: this.page
					}
				}
				let searchStr = this.filterDeviceIpN;
				if(searchStr) {
					if(this.f_check_IP(searchStr)) {
						ListConfig.data.clientAddress = this.deviceIpN;
					} else {
						ListConfig.data.display = this.deviceIpN;
					}
				}
				if(this.group) {
					ListConfig.data.displayGroupId = this.group;
					ListConfig.data.isGroup = 'yes';
				}
				if(this.devType != this.$t('message.deviceGroup.all')) {
					ListConfig.data.deviceModel = this.devType;
				}
				this.LonbonAjax(ListConfig).then((res) => {
					var data = res.data;
					this.total = data.total;
					this.deviceArr = data.data;
					this.listLoading = false;
					this.emptyDataTip = this.$t('message.dataEmptyTip');
				}, (err) => {
					this.listLoading = false;
					this.deviceArr = [];
					if(400 != err.errorCode) {
						this.$message.error(err.message);
					} else if (this.page > 1) {
						this.page -= 1;
						this.getDeviceList();
					}
					this.total = 0;
					this.emptyDataTip = this.$t('message.dataEmptyTip');
				})
			},
			deviceSel(val) {
				this.selDevice = val;
			},
			//初始化详情框
			initDetailBox() {
				this.deviceInfo.groupName = '';
				this.deviceInfo.deviceModel = '';
				this.deviceInfo.lastAccessed = '';
				this.deviceInfo.defaultLayoutId = 0;
				this.deviceInfo.description = "";
				this.deviceInfo.thumb = '';
				this.deviceInfo.runtime = '';
				this.deviceInfo.timeOn = '';
				this.deviceInfo.timeOff = '';
				this.centerDialogVisible = false;
				this.editFlag = false;
			},
			/*搜索*/
			searchDev() {
				this.page = 1;
				this.filterDeviceIpN = this.deviceIpN;
				this.getDeviceList();
			},
			/*下拉框修改*/
			searchDevByGroupOrModel() {
				this.page = 1;
				this.filterDeviceIpN = this.deviceIpN;
				this.getDeviceList();
			},
			handleSizeChange(limit) {
				this.deviceIpN = this.filterDeviceIpN;
				this.limit = limit;
				this.getDeviceList();
			},
			handleCurrentChange(page) {
				this.deviceArr = [];
				this.emptyDataTip = "";
				this.page = page;
				this.deviceIpN = this.filterDeviceIpN;
				this.getDeviceList();
			},
			getTabIndex(index) {
				return(this.page - 1) * this.limit + 1 + index;
			},
			//换组初始化
			initChangeBox() {
				this.groupName = '';
				this.deviceId = '';
			},
			/*改变分组*/
			changeGroup(row) {
				this.deviceId = row.id;
				this.groupName = row.groups;
				this.changeGroupFlag = true;
				if(this.$refs.tree) {
					this.$refs.tree.setCheckedKeys([]);
				}
			},
			//分组复选框改变事件
			changeGroupBtn(node, nodes) {
				if(this.$refs.tree) {
					this.$refs.tree.setCheckedKeys([node.id]);
				}
			},
			//刷新设备截图
			refreshDevice() {
				this.refreshBtn = true;
				let url = http.refreshDevice;
				let id = this.deviceInfo.id;
				var options = {
					url: url,
					type: 'POST',
					data: {
						displayId: id
					}
				}
				let $this = this;
				this.LonbonAjax(options).then(function(res) {
					setTimeout(function() {
						$this.refreshBtn = false;
						$this.$message.success($this.$t('message.deviceGroup.refreshSuccess'));
						if ($this.centerDialogVisible) {
							$this.detailInfo(id, $this.deviceInfo.groupName);
						}
					}, 3000);
				}, function(err) {
					$this.refreshBtn = false;
					$this.$message.error(err.message);
				})
			},
			//批量交换分组
			changeGroupBatch() {
				let deviceArr = this.selDevice;
				if(1 > deviceArr.length) {
					//请选择需要换组的设备
					this.$message.warning(this.$t('message.deviceGroup.selectDeviceToChange'));
					return;
				}
				let ids = [];
				let names = [];
				deviceArr.forEach((device, index) => {
					ids.push(device.id);
					//判断分组是否重复
					if($.inArray(device.groups, names) < 0) {
						names.push(device.groups);
					}
				})
				this.groupName = names.join(',');
				let displayGroupId = ids.join(',');
				this.deviceId = displayGroupId;
				this.changeGroupFlag = true;
				if(this.$refs.tree) {
					this.$refs.tree.setCheckedKeys([]);
				}
			},
			//改变分组保存
			changeGroupSave() {
				let displayGroupId = this.$refs.tree.getCheckedKeys()[0];
				//是否选择了需要交换的分组
				if(!displayGroupId) {
					//请选择交换到的分组
					this.$message.warning(this.$t('message.deviceGroup.selectGroupToChange'));
					return;
				}
				let deviceId = this.deviceId;
				let batchFlag = (deviceId + '').split(',').length > 1;
				let changeOPtion = {
					url: http.deviceGroupAll + "/" + 　(batchFlag ? 0 : deviceId),
					type: 'PUT',
					data: {
						displayGroupId: displayGroupId
					}
				}
				if(batchFlag) {
					changeOPtion.data.displayIds = this.deviceId;
				}
				//确认交换分组？
				this.$confirm(this.$t('message.deviceGroup.changeGroupConfirm'), {
					type: 'warning'
				}).then((res) => {
					this.LonbonAjax(changeOPtion).then((res) => {
						if(200 == res.errorCode) {
							//换组成功
							this.$message.success(this.$t('message.deviceGroup.changeGroupSuccess'));
							this.changeGroupFlag = false;
							this.getDeviceList();
							this.getGroupList();
						} else {
							this.$message.error(res.message);
						}
					}, (err) => {
						this.$message.error(err.message);
					})
				}).catch(() => {
					
				})
			},
			/*批量删除设备*/
			delDevice() {
				let delArr = this.selDevice;
				if(1 > delArr.length) {
					//请选择需要删除的设备
					this.$message.warning(this.$t('message.deviceGroup.selectDeviceToDel'));
					return;
				}
				//确认删除已选择的设备？
				this.$confirm(this.$t('message.deviceGroup.delConfirm'), {
					type: 'warning'
				}).then(() => {
					let ids = [];
					delArr.forEach((device, index) => {
						ids.push(device.id);
					})
					let delOption = {
						url: http.deviceBatchDel,
						type: 'POST',
						data: {
							displayId: ids.join(',')
						}
					}
					this.LonbonAjax(delOption).then((res) => {
						if(200 == res.errorCode) {
							//删除成功
							this.$message.success(this.$t('message.deviceGroup.delSuccess'));
							this.getDeviceList();
						} else {
							this.$message.error(res.message);
						}
					}, (err) => {
						this.$message.error(err.message);
					})
				}).catch(() => {
					
				})
			},
			openDetail() {
				$("#deviceDetail").removeClass('hide');
				this.showTitle = false;
			},
			/*详细信息*/
			detailInfo(id, groupName) {
				if (this.editFlag) {
					this.devDetailTitle = this.$t('message.deviceGroup.edit');
				} else {
					this.devDetailTitle = this.$t('message.deviceGroup.detailInfo');
				}
				this.deviceBg = '';
				let deviceConfig = {
					url: http.deviceDetail + '/' + id,
					type: 'GET',
					data: {
						id: id
					}
				}
				let $this = this;
				this.LonbonAjax(deviceConfig).then((res) => {
					if(!res.data.description) {
						res.data.description = '　';
					}
					if(res.data.thumb) {
						this.deviceBg = localStorage.getItem('rootUrl') + res.data.thumb;
					} else {
						this.deviceBg = './static/images/picDefault.png';
					}
					$("#videoBox").css("padding", 0);
					let image = new Image();
					image.src = this.deviceBg;
					image.onload = function() {
						let fontSize = parseInt($('body').css('font-size'));
						let pW = $("#videoBox").innerWidth()||($("body").width()*0.4 - 3*fontSize)*0.7;
						let imgPercent = image.width / image.height;
						let cVideoPercent = pW / $("#videoBox").innerHeight();
						let imgH = image.height;
						let imgW = image.width;
						let pH = $("#videoBox").innerHeight();
						if(imgPercent > cVideoPercent) {
							$this.screenShot.width = pW + 'px';
							$this.screenShot.height = imgH * (pW / imgW) + 'px';
							let paddingHeight = pH - imgH * (pW / imgW);
							$("#videoBox").css("padding-top", paddingHeight / 2 + "px");
						} else {
							$this.screenShot.height = pH + 'px';
							$this.screenShot.width = imgW * (pH / imgH) + 'px';
							let paddingWidth = pW - imgW * (pH / imgH);
							$("#videoBox").css("padding-left", paddingWidth / 2 + "px");
						}
					}
					$this.centerDialogVisible = true;
					let fontSize = parseInt($('body').css('font-size'));
					let parentWidth = $("#DeviceModel").innerWidth()/100 * ($(document).width()*0.4 - 3*fontSize - 20) - 4*1.2*fontSize;
					let detailData = res.data;
					let taskInfo = res.data.timeInfo;
					let startArr = [];
					let endArr = [];
					for (let i = 0; i < taskInfo.length; i++) {
						startArr.push(taskInfo[i].task_start);
						endArr.push(taskInfo[i].task_end);
					}
					detailData.timeOn = startArr.join("、");
					detailData.timeOff = endArr.join("、");
					$this.deviceInfo = detailData;
					detailData.description = detailData.description == "　"?"":detailData.description;
					$this.showRemarkTile = $this.isShowTitle(detailData.description, parentWidth);
					$this.showDisplayTitle = $this.isShowTitle(detailData.display, parentWidth);
					//右边宽度比左边少1.5em
					parentWidth = parentWidth - 1.5*1.2*fontSize;
					$this.showGroupTitle = $this.isShowTitle(groupName, parentWidth);
					$this.showTaskStart = $this.isShowTitle(detailData.timeOn, parentWidth);
					$this.showTaskEnd = $this.isShowTitle(detailData.timeOff, parentWidth);
					$this.deviceInfo.groupName = groupName;
				}, (err) => {
					$this.$message.error(err.message)
				})
			},
			//编辑设备信息
			editDevice(id, groupName) {
				this.editFlag = true;
				this.detailInfo(id, groupName);
			},
			//编辑保存
			editSave() {
				if(!this.deviceInfo.display) {
					this.$message.error(this.$t('message.deviceGroup.deviceNameRequire'));
					return;
				}
				let option = {
					url: http.deviceList + "/" + this.deviceInfo.id,
					type: 'PUT',
					data: {
						id: this.deviceInfo.id,
						licensed: this.deviceInfo.licensed,
						defaultLayoutId: this.deviceInfo.defaultLayoutId,
						display: this.deviceInfo.display,
						description: this.deviceInfo.description
					}
				}
				this.LonbonAjax(option).then((res) => {
					if(200 == res.errorCode) {
						//删除成功
						this.$message.success(this.$t('message.deviceGroup.editSuccess'));
						this.getDeviceList();
						this.centerDialogVisible = false;
					} else {
						this.$message.error(res.message);
					}
				}, (err) => {
					this.$message.error(err.message);
				})
			},
			//行删除
			del(id) {
				if(!id) {
					//请选择需要删除的设备
					this.$message.error(this.$t('message.deviceGroup.selectDeviceToDel'));
					return;
				}
				this.$confirm(this.$t('message.deviceGroup.delConfirm'), {
					type: 'warning'
				}).then(() => {
					let delOption = {
						url: http.deviceList + '/' + id,
						type: 'DELETE',
						data: {
							id: id
						}
					}
					this.LonbonAjax(delOption).then((res) => {
						if(200 == res.errorCode) {
							//删除成功
							this.$message.success(this.$t('message.deviceGroup.delSuccess'));
							this.getDeviceList();
						} else {
							this.$message.error(res.message);
						}
					}, (err) => {
						this.$message.error(err.message);
					})
				}).catch(() => {
					
				})
			},
			//检测是否是IP地址
			f_check_IP(ip) {
				var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //正则表达式
				if(re.test(ip)) {
					if(RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
						return true;
					}
				}
				return false;
			},
			dateToStr(dates) {
				if(dates == 0) {
					return this.$t('message.none');
				}
				let date = new Date(dates);
				let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return hour + ":" + minutes + ":" + seconds;
			},
			//获取运行时间
			getTaskTime(taskInfo, type) {
				let timeArr = [];
				for(let i = 0; i < taskInfo.length; i++) {
					if (type) {
						timeArr.push(taskInfo[i].task_start);
					} else {
						timeArr.push(taskInfo[i].task_end);
					}
				}
				return timeArr.join("、");
			},
			getCycleWeek(days) {
				let weekArr = [];
				let weeks = days.split(',');
				for (let i = 0; i < weeks.length; i++) {
					weekArr.push(this.cycleDateArr[weeks[i] - 1]);
				}
				return weekArr.join("、");
			},
			//是否显示title
			isShowTitle(title, pWidth) {
				$("#widthTest").text(title);
				let width = $("#widthTest").innerWidth();
				return width>pWidth?true:false;
			},
			getGroupList() {
				let groupConfig = {
					url: http.deviceGroupAll,
					type: 'GET'
				}
				this.LonbonAjax(groupConfig).then((res) => {
					this.groupArr = res.data.groupList;
					this.groupArr.unshift({
						id: 0,
						displayGroup: this.$t('message.deviceGroup.all')
					});
				}, (err) => {
					if(400 != err.errorCode) {
						this.$message.error(err.message);
					}
				})
			}
		},
		mounted: function() {
			//用于计算  名称等父元素的 宽度
			this.centerDialogVisible = false;	
			this.firstLoad = true;
			this.getDeviceList();
			
			this.getGroupList();

			let deviceTypeOption = {
				url: http.deviceType,
				type: 'GET'
			}
			/*获取设备类型*/
			this.LonbonAjax(deviceTypeOption).then((res) => {
				this.deviceTypeList = res.data;
				this.deviceTypeList.unshift({
					id: 0,
					deviceModel: this.$t('message.deviceGroup.all')
				});
			}, (err) => {
				if(400 != err.errorCode) {
					this.$message.error(err.message);
				};
			})

			let groupTree = {
				url: http.deviceGroup,
				type: 'GET'
			}
			this.LonbonAjax(groupTree).then((res) => {
				this.groupInfo = res.data;
			}, (err) => {
				if(400 != err.errorCode) {
					this.$message.error(err.message);
				}
			})
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit('update:devicename', '0')
			})

		}
	}
</script>

<style scoped lang='less'>
	.tableBtn {
		padding: 0;
		color: #18ABBB;
		font-size: 1em;
	}
	.el-tree-node {
		height: 2em;
		line-height: 2em;
		font-size: 1.5em;
	}
	
	.deviceInfo {
		height: 100%;
		background-color: #FFF;
		border-radius: 0.5em;
	}
	
	.toolbar {
		margin-top: 1em;
		padding-right: 2em;
	}
	
	.operateBox {
		padding: 1.25em;
		.el-icon-search {
			line-height: 2.25em;
		}
		.el-input {
			margin-right: 1em;
			width: 13.75em;
		}
		.el-select {
			margin-right: 1em;
		}
		.el-button:not(#search) {
			float: right;
		}
	}
		.el-table .cell span div {
			overflow:hidden;
			text-overflow:ellipsis;
		}
	#deviceDetail {
		.el-dialog__body {
			font-size: 1.14em;
		}
		.el-row {
			height: 1.8em;
			line-height: 1.8em;
			font-size: 1.2em;
			color: #000;
			margin-bottom: 0.6em;
		}
		.labelR {
			text-align: right;
		}
		#videoBox {
			margin: 1em 15% 0 15%;
			height: 13em;
			background-color: #000;
		}
		.refresh {
			text-align: right;
			margin-right: 1.5em;
			color: #18ABBB;
			clear: both;
			.refreshBtn {
				cursor: pointer;
			}
		}
		#refreshBtn {
			border: none;
			color: #18Abbb;
			font-size: 1em;
			font-weight: bold;
		}
		.el-input, .el-form-item__error {
			width: 70%;
			line-height: 1em;
		}
	}
	
	#changeGroup {
		text-align: center;
		img {
			margin-top: 0.5em;
		}
		.imgTip {
			position: relative;
			bottom: 20px;
			left: 5px;
			font-size: 0.8em;
			color: #a79898;
		}
		.el-tree {
			margin: 0.5em 1em 0 1em;
			border: 1px solid #ccc;
			padding-left: 20%;
			padding-top: 0.5em;
			padding-bottom: 0.5em;
			border-radius: 8px;
		}
	}
	.inline {
		display:inline-block;
        width: calc(100% - 5.5em);
        overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.inlineLeft {
		display:inline-block;
        width: calc(100% - 4em);
        overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.labelLeft {
		display: inline-block;
		width:5.5em;
		float:left;
		text-align:right;
	}
	.hideFlase {
		opacity:0;
	}
	#widthTest {
		display:inline-block;
		font-size:1.2em;
		position:absolute;
		left:-10000px;
	}
</style>
<style lang='less'>
	.el-popover {
		background-color:#303133 !important;
		color:#FFF !important;
	}
	.popper__arrow {
    color: #000 !important;
	}
	.el-popover[x-placement^=top] .popper__arrow:after {
    border-top-color: #303133 !important;
  }
	.online {
		color: #05b72b;
	}
	
	.offline {
		color:#ff0c0c;
	}
	
	.ellipsis, .ellipsis input {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.ellipsis span {
		float:left;
	}
	#changeGroup {
		.el-dialog {
			height: 37em;
			.groupInfo {
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 1.2em;
				font-weight: bold;
			}
			.el-tree {
				height: 16em;
				overflow-y:auto;
				.is-leaf {
					opacity: 0;
				}
				.el-tree-node__expand-icon {
					border: none !important;
				}
				.el-icon-caret-right:before {
					content: url(../../../static/images/expanded.png);
				}
				.expanded {
					&:before {
						content: url(../../../static/images/expand.png);
					}
					transform: rotate(0) !important;
				}
				.el-checkbox__inner {
					border-radius: 50% !important;
					&:after {
						margin-top: 3px;
						left:4.3px;
						height: 8px;
						width: 8px;
						border-radius: 50%;
						border: none;
						background-color: #18ABBB;
					}
				}
			}
			.el-tree-node__label {
				font-size: 1em;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    word-break: break-word;
			}
			.el-dialog__body {
				overflow-y: auto;
			}
		}
	}
</style>