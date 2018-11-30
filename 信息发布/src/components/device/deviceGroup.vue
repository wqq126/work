<template>
	<div class="group">
		<!--操作列-->
		<div class="operateBox item">
			<!--//删除-->
			<el-button type="primary" class='mybtn-primary' @click="batchDel">{{$t("message.deviceGroup.btnDel")}}</el-button>
			<!--增加同级-->
			<el-button type="primary" class='mybtn-primary' @click="addPeersGroup(0)">{{$t("message.deviceGroup.addGroup")}}</el-button>
		</div>

		<!--//分组添加-->
		<el-dialog :title='$t("message.deviceGroup.groupAdd")' :close-on-click-modal='false' @open='groupAddOpen' center id='groupAdd' :visible.sync="groupAdd" width="30%">
			<el-form :label-position="labelPosition" ref='groupInfo' :rules='groupInfo.rules' :label-width="formLabelWidth" status-icon validate-on-rule-change :model="groupInfo">
				<el-form-item :label='$t("message.deviceGroup.groupName")' class="required" prop='name'>
					<el-input v-model="groupInfo.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!--确 定-->
				<el-button type="primary" @click="groupAddE" class='mybtn-primary'>{{$t("message.deviceGroup.btnSave")}}</el-button>
				<!--取 消-->
				<el-button type="primary" @click="groupAdd = false" class='mybtn-primary'>{{$t("message.deviceGroup.btnCancel")}}</el-button>
			</div>
		</el-dialog>

		<!--//分组编辑-->
		<el-dialog :title='$t("message.deviceGroup.groupEdit")' @close='groupEditOpen' :close-on-click-modal='false' center id='groupEdit' :visible.sync="groupEdit" width="30%">
			<el-form :label-position="labelPosition" ref='groupEditInfo' :rules='groupEditInfo.rules' :label-width="formLabelWidth" status-icon validate-on-rule-change :model="groupEditInfo">
				<el-form-item :label='$t("message.deviceGroup.groupName")' class="required" prop='name'>
					<el-input v-model="groupEditInfo.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!--确 定-->
				<el-button type="primary" @click="groupEditE" class='mybtn-primary'>{{$t("message.deviceGroup.btnSave")}}</el-button>
				<!--取 消-->
				<el-button type="primary" @click="groupEdit = false" class='mybtn-primary'>{{$t("message.deviceGroup.btnCancel")}}</el-button>
			</div>
		</el-dialog>

		<!--//导入设备-->
		<el-dialog :title='$t("message.deviceGroup.transferDev")' :close-on-click-modal='false' center id='deviceTransfer' :visible.sync="transferDevice" width='65%'>
			<el-row class='transBox'>
				<el-col :span='10' class='leftBox'>
					<!--已选设备-->
					<el-row class='boxTitle'>
						{{$t("message.deviceGroup.deviceSel")}}
					</el-row>
					<!--设备名称-->
					<el-input name='transferFromName' v-model="deviceFromName" :placeholder='$t("message.deviceGroup.deviceIpName")' prefix-icon="el-icon-search"></el-input>
					<!--设备型号-->
					<el-select v-model="deviceFromModel" :placeholder='$t("message.deviceGroup.deviceModel")'>
						<el-option v-for='(device, index) in deviceTypeList' :key='index' v-if='device.deviceModel' :label="device.deviceModel" :value="device.deviceModel"></el-option>
					</el-select>

					<!--已选列表-->
					<el-table ref="singleTable2" :data="deviceTranfer.groupSearchList" @selection-change='deviceSel' height="22.5em" highlight-current-row v-loading="listLoading" style="width: 100%">
						<el-table-column type="selection" width="50">
						</el-table-column>
						<el-table-column prop="display" :label='$t("message.deviceGroup.name")'>
						</el-table-column>
						<el-table-column prop="clientAddress" label="IP">
						</el-table-column>
					</el-table>
				</el-col>
				<el-col :span='4' class='transferBtn'>
					<el-row>
						<!--<<&nbsp;导入-->
						<el-button type="primary" @click="transferIn" class='mybtn-primary'>{{$t("message.deviceGroup.btnTransIn")}}</el-button>
						<!--删除&nbsp;-->
						<el-button type="primary" @click="transferOut" class='mybtn-primary'>{{$t("message.deviceGroup.btnTransOut")}}</el-button>
						<!--保存-->
						<el-button type="primary" @click="transferSave" class='mybtn-primary'>{{$t("message.deviceGroup.btnSave")}}</el-button>
						<!--取 消-->
						<el-button type="primary" @click="transferDevice = false" class='mybtn-primary'>{{$t("message.deviceGroup.btnCancel")}}</el-button>
					</el-row>
				</el-col>
				<el-col :span='10' class='rightBox'>
					<el-row class='boxTitle'>
						{{$t("message.deviceGroup.deviceUnSel")}}
					</el-row>
					<!--设备名称-->
					<el-input name='transferToName' v-model='deviceToName' :placeholder='$t("message.deviceGroup.deviceIpName")' prefix-icon="el-icon-search"></el-input>
					<el-select v-model="deviceToModel" :placeholder='$t("message.deviceGroup.deviceModel")'>
						<el-option v-for='(device, index) in deviceTypeList' :key='index' v-if='device.deviceModel' :label="device.deviceModel" :value="device.deviceModel"></el-option>
					</el-select>

					<!--可选列表-->
					<el-table ref="singleTable3" :data="deviceTranfer.deviceSearchList" @selection-change='deviceUnSel' height="22.5em" highlight-current-row v-loading="listLoading" style="width: 100%">
						<el-table-column type="selection" width="50">
						</el-table-column>
						<el-table-column prop="display" :label='$t("message.deviceGroup.name")'>
						</el-table-column>
						<el-table-column prop="clientAddress" label="IP">
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
		</el-dialog>

		<tree-table :data="groupData" @addChildGroup='addChildGroup' @addPeersGroup='addPeersGroup' @transToGroup='transToGroup' @editGroup='editGroup' @delGroup='delGroup' :emptyDataTip='emptyDataTip' :columns="columns"></tree-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination background layout="total,sizes,prev, pager, next,jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30, 50]" :page-size="limit" :current-page="page" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</div>
</template>

<script>
	import {
		http
	} from "../../api/config";
	import treeTable from '@/components/TreeTable'
	import vue from 'vue'
	export default {
		name: 'deviceGroup',
		data() {
			return {
				columns: [{
						text: 'No',
						value: 'classNumber',
						width: 300
					},
					{
						text: this.$t('message.deviceGroup.name'),
						value: 'displayGroup'
					},
					{
						text: this.$t('message.deviceGroup.grade'),
						value: 'class',
						width: 150
					},
					{
						text: this.$t('message.deviceGroup.deviceNum'),
						value: 'number',
						width: 150
					},
					{
						text: this.$t('message.deviceGroup.operate'),
						value: '',
						width:600
					}
				],
				page: 1,
				limit: 20,
				total: 0,
				userId: localStorage.getItem("userId"),
				listLoading: true,
				groupData: [],
				groupIds: [],
				groupParentId: 0,
				addParentId: 0,
				//分组添加，0为同级分组，1为以及分组
				addGroupType: 0,
				groupAdd: false,
				groupEdit: false,
				formLabelWidth: '130px',
				labelPosition: 'right',
				groupInfo: {
					name: '',
					rules: {
						name: [{
							required: true,
							//'群组名称不能为空'
							message: this.$t('message.deviceGroup.requireName'),
							trigger: 'blur'
						}]
					}
				},
				groupEditInfo: {
					name: '',
					id: '',
					parentId: '',
					rules: {
						name: [{
							required: true,
							//'群组名称不能为空'
							message: this.$t('message.deviceGroup.requireName'),
							trigger: 'blur'
						}]
					}
				},
				transferDevice: false,
				//分组ID
				changeGroupId: 0,
				//已选设备名search
				deviceFromName: '',
				//未选设备名search
				deviceToName: '',
				//已选设备型号search
				deviceFromModel: '',
				//未选设备型号search
				deviceToModel: '',
				//未选设备 选中值
				deviceUnselected: [],
				//已选设备选中值
				deviceSelected: [],
				//分组原有设备
				groupOriginList: [],
				deviceTranfer: {
					//当前已选设备
					groupDeviceList: [],
					//当前筛选
					groupSearchList: [],
					//未选设备列表
					deviceList: [],
					//未选筛选
					deviceSearchList: []
				},
				//设备型号列表
				deviceTypeList: [],
				emptyDataTip:""
			}
		},
		components: {
			treeTable
		},
		watch: {
			deviceFromName(oldVal, newVal) {
				this.searchDevice(0);
			},
			deviceToName(oldVal, newVal) {
				this.searchDevice(1);
			},
			deviceFromModel(oldVal, newVal) {
				this.searchDevice(0);
			},
			deviceToModel(oldVal, newVal) {
				this.searchDevice(1);
			}
		},
		methods: {
			/*数据序号*/
			getTabIndex(index) {
				return(this.page - 1) * this.limit + index + 1;
			},
			//分页
			handleSizeChange(limit) {
				this.limit = limit;
				this.getGroupList();
			},
			handleCurrentChange(page) {
				this.emptyDataTip = "";
				this.groupData = [];
				this.page = page;
				this.getGroupList();
			},
			/*获取分组列表*/
			getGroupList() {
				let config = {
					url: http.deviceGroup,
					type: 'GET',
					data: {
						limit: this.limit,
						page: this.page
					}
				}
				this.LonbonAjax(config).then((res) => {
					this.listLoading = false;
					if(200 == res.errorCode) {
						this.total = res.data.total;
						this.groupData = res.data.data;
					}
					this.emptyDataTip = this.$t('message.dataEmptyTip');
				}, (err) => {
					this.listLoading = false;
					this.groupData = [];
					this.emptyDataTip = this.$t('message.dataEmptyTip');
					this.total = 1;
					if(400 != err.errorCode) {
						this.$message.error(err.message);
					} else if (this.page > 1) {
						this.page -= 1;
						this.getGroupList();
					}
				})
			},
			/*已选分组*/
			groupSel(list) {
				let ids = [];
				list.forEach((item, index) => {
					ids.push(item.id);
					if(0 == index) {
						this.groupParentId = item.parentId;
					}
				})
				this.groupIds = ids;
			},
			/*增加同级分组*/
			addPeersGroup(pId) {
//				let checkLength = $("#tree tbody").find('.icon-checked').length;
//				if(checkLength > 1) {
//					this.$message.warning(this.$t('message.deviceGroup.groupLtOne'));
//					return;
//				} else if(checkLength == 0) {
//					/*'分组未选择， 默认为一级分组'*/
//					this.$message.warning(this.$t('message.deviceGroup.defaultGroupTop'));
//					this.groupParentId = 0;
//				} else {
//					this.groupParentId = $("#tree tbody .icon-checked").attr('parentId')
//				}
				this.groupParentId = pId;
				this.addGroupType = 0;
				this.groupAdd = true;
				this.addParentId = this.groupParentId;
			},
			/*增加下级分组*/
			addChildGroup(pId) {
//				let checkLength = $("#tree tbody").find('.icon-checked').length;
//				if(checkLength != 1) {
//					//'分组必须选择且仅能选择一个'
//					this.$message.warning(this.$t('message.deviceGroup.groupMustOne'));
//					return;
//				}
//				let pId = $("#tree tbody .icon-checked").attr('groupId');
				this.addGroupType = 1;
				this.groupAdd = true;
				this.addParentId = pId;
			},
			/*群组添加弹出框打开事件*/
			groupAddOpen() {
				//表单是否已经生成
				this.groupInfo.name = '';
				if(this.$refs['groupInfo']) {
					this.$refs['groupInfo'].resetFields();
				}
			},
			groupEditOpen() {
				this.groupEditInfo.name = '';
				//表单是否已经生成
				if(this.$refs['groupEditInfo']) {
					this.$refs['groupEditInfo'].resetFields();
				}
			},
			/*分组添加确认*/
			groupAddE() {
				this.$refs['groupInfo'].validate((valid) => {
					if(!valid) {
						return;
					} else {
						let groupAddO = {
							url: http.deviceGroup,
							type: 'POST',
							data: {
								displayGroup: this.groupInfo.name,
								parentId: this.addParentId
							}
						}
						this.LonbonAjax(groupAddO).then((res) => {
							if(200 == res.errorCode) {
								//分组添加成功
								this.$message.success(this.$t('message.deviceGroup.addSuccess'));
								this.getGroupList();
								this.groupAdd = false;
								$("#tree").find('.icon-checked').toggleClass('icon-checked', false).toggleClass('icon-checkbox-uncheck', true);
							} else {
								this.$message.error(res.message)
							}
						}, (err) => {
							this.$message.error(err.message)
						})
					}
				})
			},
			/*编辑分组*/
			editGroup(id, name, parentId) {
				this.groupEditInfo.name = name;
				vue.set(this.groupEditInfo, 'name', name);
				this.groupEditInfo.id = id;
				this.groupEditInfo.parentId = parentId;
				this.groupEdit = true;
			},
			/*编辑保存*/
			groupEditE() {
				this.$refs['groupEditInfo'].validate((valid) => {
					if(!valid) {
						return;
					} else {
						let groupAddO = {
							url: http.deviceGroup + '/' + this.groupEditInfo.id,
							type: 'PUT',
							data: {
								displayGroup: this.groupEditInfo.name,
								parentId: this.groupEditInfo.parentId
							}
						}
						this.LonbonAjax(groupAddO).then((res) => {
							if(200 == res.errorCode) {
								//分组编辑成功
								this.$message.success(this.$t('message.deviceGroup.editSuccess'));
								this.getGroupList();
								this.groupEdit = false;
							} else {
								this.$message.error(res.message)
							}
						}, (err) => {
							this.$message.error(err.message)
						})
					}
				})
			},
			/*删除分组*/
			delGroup(id) {
				this.$confirm(this.$t('message.deviceGroup.delDevice'), {
					type: 'warning'
				}).then(() => {
					let delOption = {
						url: http.deviceGroup + '/' + id,
						type: 'DELETE'
					}
					this.LonbonAjax(delOption).then((res) => {
						if(200 == res.errorCode) {
							//分组删除成功
							this.$message.success(this.$t('message.deviceGroup.delSuccess'));
							this.getGroupList();
						} else {
							this.$message.error(res.message)
						}
						$(".icon-checked").addClass("icon-checkbox-uncheck").removeClass("icon-checked");
					}, (err) => {
						this.$message.error(err.message)
					})
				}).catch(() => {})
			},
			/*导入设备*/
			transToGroup(id) {
				this.getDeviceByGroup(id);
				this.getDeviceUncontain();
				this.transferDevice = true;
				this.changeGroupId = id;
			},
			deviceSel(list) {
				let ids = [];
				list.forEach((sel, index) => {
					ids.push(sel.id);
				})
				this.deviceSelected = ids;
			},
			deviceUnSel(list) {
				let ids = [];
				list.forEach((sel, index) => {
					ids.push(sel.id);
				})
				this.deviceUnselected = ids;
			},
			//设备导入
			transferIn() {
				if(this.deviceUnselected.length < 1) {
					//请选择需要导入的设备'
					this.$message.warning(this.$t('message.deviceGroup.chooseTransIn'));
				} else {
					var $this = this;
					this.deviceUnselected.forEach((id, index) => {
						$this.deviceTranfer.deviceList.forEach((device, devIndex) => {
							if(id == device.id) {
								$this.deviceTranfer.groupDeviceList.push(device);
								$this.deviceTranfer.deviceList.splice(devIndex, 1);
							}
						})
					})
				}
				this.searchDevice(0);
				this.searchDevice(1);
			},
			//设备导出
			transferOut() {
				if(this.deviceSelected.length < 1) {
					//请选择需要导出的设备
					this.$message.warning(this.$t('message.deviceGroup.chooseTransOut'));
				} else {
					var $this = this;
					this.deviceSelected.forEach((id, index) => {
						$this.deviceTranfer.groupDeviceList.forEach((device, devIndex) => {
							if(id == device.id) {
								$this.deviceTranfer.deviceList.push(device);
								$this.deviceTranfer.groupDeviceList.splice(devIndex, 1);
							}
						})
					})
				}
				this.searchDevice(0);
				this.searchDevice(1);
			},
			//保存设备变更
			transferSave() {
				let ids = [];
				this.deviceTranfer.groupDeviceList.forEach((device, index) => {
					let containF = false;
					this.groupOriginList.forEach((id, index2) => {
						if(device.id == id) {
							containF = true;
						}
					})
					if(!containF) {
						ids.push(device.id);
					}
				})
				this.groupOriginList.forEach((id, index) => {
					let containF = false;
					this.deviceTranfer.groupDeviceList.forEach((deviceT, index2) => {
						if(id == deviceT.id) {
							containF = true;
						}
					})
					if(!containF) {
						ids.push(id);
					}
				})
				if(ids.length == 0) {
					//设备没有变化
					this.$message.warning(this.$t('message.deviceGroup.deviceNotChange'));
					return;
				}
				let displayOption = {
					url: http.deviceGroupAll,
					type: 'POST',
					data: {
						displayGroupId: this.changeGroupId,
						displayId: ids.join(',')
					}
				}
				this.LonbonAjax(displayOption).then((res) => {
					if(200 == res.errorCode) {
						//设备导入成功
						this.$message.success(this.$t('message.deviceGroup.transferSuccess'));
						this.transferDevice = false;
						this.getGroupList();
					}
				}, (err) => {
					this.$message.error(err.message)
				})
			},
			/*批量删除分组*/
			batchDel() {
				let checkArray = $("#tree").find('.icon-checked:not("#checkAll")');
				let ids = [];
				if(checkArray.length < 1) {
					/*'请选择需要删除的分组'*/
					this.$message.warning(this.$t('message.deviceGroup.selectGroupToDel'));
					return;
				} else {
					for(var i = 0; i < checkArray.length; i++) {
						var item = $(checkArray[i]);
						ids.push(item.attr('groupId'));
					}
				}

				this.$confirm(this.$t('message.deviceGroup.delDevice'), {
					type: 'warning'
				}).then(() => {
					let delOption = {
						url: http.deviceGroup + '/0',
						type: 'DELETE',
						data: {
							displayGroupIds: ids.join(',')
						}
					}
					this.LonbonAjax(delOption).then((res) => {
						if(200 == res.errorCode) {
							//分组删除成功
							this.$message.success(this.$t('message.deviceGroup.delSuccess'));
							$("#tree").find('.icon-checked').toggleClass('icon-checked', false).toggleClass('icon-checkbox-uncheck', true);
							this.getGroupList();
						} else {
							this.$message.error(res.message)
						}
					}, (err) => {
						this.$message.error(err.message)
					})
				}).catch(() => {
					
				})
			},
			/*获取设备型号*/
			getDeviceModel() {
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
					}
				})
			},
			/*获取组织下的设备列表*/
			getDeviceByGroup(id) {
				let deviceOption = {
					url: http.deviceList,
					type: 'GET',
					data: {
						displayGroupId: id,
						isGroup: 'yes',
						limit: 0
					}
				}
				this.groupOriginList = [];
				this.LonbonAjax(deviceOption).then((res) => {
					res.data.forEach((item, index) => {
						this.groupOriginList.push(item.id);
					})
					this.deviceTranfer.groupDeviceList = res.data;
					this.deviceTranfer.groupSearchList = res.data;
				}, (err) => {
					this.groupOriginList = [];
					this.deviceTranfer.groupDeviceList = [];
					this.deviceTranfer.groupSearchList = [];
					if(400 != err.errorCode) {
						this.$message.error(err.message);
					}
				})
			},
			/*获取未分配的组织列表*/
			getDeviceUncontain() {
				let deviceOption = {
					url: http.deviceList,
					type: 'GET',
					data: {
						isGroup: 'no',
						limit: 0
					}
				}
				this.LonbonAjax(deviceOption).then((res) => {
					this.deviceTranfer.deviceList = res.data;
					this.deviceTranfer.deviceSearchList = res.data;
				}, (err) => {
					this.deviceTranfer.deviceList = [];
					this.deviceTranfer.deviceSearchList = [];
					if(400 != err.errorCode) {
						this.$message.error(err.message);
					}
				})
			},
			//搜索设备，type为0是已选设备。1为可选设备
			searchDevice(type) {
				let originList = [],
					aimList = [],
					name = '',
					deviceType;
				if(0 == type) {
					originList = this.deviceTranfer.groupDeviceList;
					name = this.deviceFromName;
					deviceType = this.deviceFromModel;
				} else {
					originList = this.deviceTranfer.deviceList;
					name = this.deviceToName;
					deviceType = this.deviceToModel;
				}
				originList.forEach((device, index) => {
					if(device.display.match(new RegExp(name, 'gi')) || device.clientAddress.match(new RegExp(name, 'gi'))) {
						if (deviceType == this.$t('message.deviceGroup.all') || !deviceType) {
							aimList.push(device);
						} else if(device.deviceModel == deviceType) {
							aimList.push(device);
						}
					}
				})
				if(0 == type) {
					this.deviceTranfer.groupSearchList = aimList;
				} else {
					this.deviceTranfer.deviceSearchList = aimList;
				}
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
			}
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit('update:devicename', '1')
			})

		},
		mounted: function() {
			this.getGroupList();
			this.getDeviceModel();
		}

	}
</script>
<style lang='less'>
	#groupAdd,
	#groupEdit {
		.el-input, .el-form-item__error {
			width: 80%;
		}
	}
</style>
<style scoped lang='less'>
	.group {
		height: 100%;
		background-color: #FFF;
		border-radius:0.5em;
		.operateBox {
			padding: 1.25em;
			.el-button {
				float: right;
			}
		}
		.operateBox:after {
			clear: both;
			content: '';
			display: block;
		}
		.toolbar {
			margin-top: 1em;
			padding-right: 2em;
		}
		#groupAdd,
		#groupEdit {
			.el-input, .el-form-item__error {
				width: 80%;
			}
			.el-form-item {
				padding-left: 10%;
			}
		}
		#deviceTransfer {
			.transferBtn {
				text-align: center;
				>div {
					margin-top: 50%;
					line-height: 5em;
				}
				button {
					margin: 1em 0 !important;
				}
			}
			.leftBox,
			.rightBox {
				padding: 1em 2em;
				border: 1px solid #ccc;
				height: 35em;
				border-radius: 6px;
				.boxTitle {
					margin-bottom: 0.8em;
					font-size: 1.5em;
					font-weight: 600;
				}
				.el-input,
				.el-select {
					margin: 0.5em 0;
					width: 100%;
				}
			}
		}
			/*transform: rotate(0) !important;*/
	}
</style>