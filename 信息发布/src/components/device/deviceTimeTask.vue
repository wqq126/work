<template>
	<div class="timeTask">
			<el-row class='item operateBox'>
				<!--请输入任务名称-->
				<el-input v-model="taskName" @keydown.enter.native='searchTask' :placeholder="$t('message.deviceGroup.placeholderTaskName')" prefix-icon="el-icon-search"></el-input>
				<!--删除-->
				<el-button type="primary" class='mybtn-primary' @click="delTask(0)">{{this.$t('message.material.btnDel')}}</el-button>
				<!--添加定时任务-->
				<el-button type="primary" class='mybtn-primary' @click="addTask">{{this.$t('message.deviceGroup.taskAdd')}}</el-button>
				<!--搜索-->
				<el-button id='search' type="primary" class='mybtn-primary' @click="searchTask">{{this.$t('message.material.btnSearch')}}</el-button>
			</el-row>
			<!--素材列表-->
			<el-table :data="taskList" class="my-table" @selection-change="selsChange" highlight-current-row v-loading="listLoading" height="calc(100% - 90px - 2.5em)" style="width: 100%;">
				<el-table-column type="selection"></el-table-column>
				<!--序号-->
				<el-table-column type="index" :index="indexMethod" :label="$t('message.material.No')" width='80'></el-table-column>
				<el-table-column :label="$t('message.deviceGroup.taskName')" show-overflow-tooltip prop='taskName' style="width:25%;">
				</el-table-column>
				<el-table-column :label="$t('message.deviceGroup.taskType')" show-overflow-tooltip style="width:25%;">
					<template  slot-scope="scope">	
						<span v-if='!scope.row.type'>{{$t('message.deviceGroup.timingSwitch')}}</span>
						<span v-else>{{$t('message.deviceGroup.stopPlay')}}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.deviceGroup.status')" prop='taskStart' style="width:10%;">
					<template  slot-scope="scope">	
						<span v-if='scope.row.taskStatus==1' class='paused'>
							{{$t('message.deviceGroup.paused')}}
						</span>
						<span v-else-if="scope.row.taskStatus==0" class='working'>
							{{$t('message.deviceGroup.working')}}
						</span>
						<span v-else>{{$t('message.deviceGroup.ended')}}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.deviceGroup.startTime')" prop='taskStart' style="width:10%;">
					<template slot-scope="scope">
						<span v-if='scope.row.type == 0'>{{scope.row.taskStart}}</span>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.deviceGroup.endTime')" prop='taskEnd' style="width:10%;">
					<template slot-scope="scope">
						<span v-if='scope.row.type == 0'>{{scope.row.taskEnd}}</span>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.deviceGroup.creator')" prop='username' style="width:10%;">
				</el-table-column>
				<el-table-column :label="$t('message.deviceGroup.circleModel')" show-overflow-tooltip prop='cicleModel' style="width:10%;">
					<template slot-scope="scope">
						<span v-if='scope.row.type == 0'>
							<span v-if="scope.row.taskType == 0">{{$t('message.deviceGroup.cycleOnce')}}</span>
							<span v-if="scope.row.taskType == 1">{{$t('message.deviceGroup.cycleContinus')}}</span>
							<span v-if="scope.row.taskType == 2">{{getCycleDate(scope.row.days)}}</span>
						</span>
						<span v-else>{{$t('message.deviceGroup.taskContinue')}}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.deviceGroup.device')" prop='displayNames' show-overflow-tooltip style="width:15%;">
				</el-table-column>
				<el-table-column :label="$t('message.material.operate')" style="width: 10%;">
					<template slot-scope="scope">
						<el-button class="tableBtn" @click='editTask(scope.row)' type="text" size="medium">{{$t('message.material.btnEdit')}}</el-button>
						
							<!--恢复-->
						<el-tooltip v-if='scope.row.isEditPermission==0&&scope.row.taskStatus' effect="dark" :content="$t('message.sysTipPre')+ scope.row.username +$t('message.sysTipSuf')" placement="top">
							<el-button class="tableBtn disabled" type="text" size="medium">{{$t('message.deviceGroup.btnRecover')}}</el-button>
						</el-tooltip>
						<el-button v-if='scope.row.taskStatus&&scope.row.isEditPermission==1' class="tableBtn" @click='pauseTask(scope.row)' type="text" size="medium">{{$t('message.deviceGroup.btnRecover')}}</el-button>
						<!--暂停-->
						<el-tooltip v-if='scope.row.isEditPermission==0&&!scope.row.taskStatus' effect="dark" :content="$t('message.sysTipPre')+ scope.row.username +$t('message.sysTipSuf')" placement="top">
							<el-button class="tableBtn disabled" type="text" size="medium">{{$t('message.deviceGroup.btnStop')}}</el-button>
						</el-tooltip>
						<el-button v-if='!scope.row.taskStatus && scope.row.isEditPermission==1' class="tableBtn" @click='pauseTask(scope.row)' type="text" size="medium">{{$t('message.deviceGroup.btnStop')}}</el-button>
							<!--删除-->
							<el-tooltip v-if='scope.row.isEditPermission==0' effect="dark" :content="$t('message.sysTipPre')+ scope.row.username +$t('message.sysTipSuf')" placement="top">
								<el-button class="tableBtn disabled" type="text" size="medium">{{$t('message.material.btnDel')}}</el-button>
							</el-tooltip>
								<el-button v-else class="tableBtn" @click='delTask(scope.row.taskId)' type="text" size="medium">{{$t('message.material.btnDel')}}</el-button>
					</template>
				</el-table-column>
				<div slot='empty'>
					<p>{{emptyDataTip}}</p>
				</div>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">			
				<el-pagination background  layout="total,sizes,prev, pager, next,jumper" 
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange" 
					:page-sizes="[10,20,30, 50]" 
					:page-size="limit"  
					:current-page="page"
					:total="total" style="float:right;">
				</el-pagination>
			</el-col>
			
			<!--//任务添加。编辑-->
		<el-dialog :title="mediaBoxTitle" @close='dialogInit' :close-on-click-modal='false' center id='taskUpdate' :visible.sync="taskUpdate" width="45%">
			<el-row>
				<el-col :span='9' class="deviceTree">
					<!--选择设备-->
					<el-row class="title">{{this.$t('message.deviceGroup.chooseDev')}}</el-row>
					<el-tree
			            :data="treeData"
			            :empty-text="$t('message.layoutManage.nodata')"
			            :props="defaultProps"
			            show-checkbox
			            ref="devTree"
			            node-key="groupId"
			            :default-expanded-keys="taskInfo.devIds"
			            @check-change="taskHandleCheckChange"
			          >
			          </el-tree>
				</el-col>
				<el-col :span='15'>
					<el-form :label-position="labelPosition" ref='task' :rules='taskRule' status-icon validate-on-rule-change :label-width="formLabelWidth" :model="taskInfo">
					   <!--任务名称-->
					   <el-form-item :label="$t('message.deviceGroup.taskName_L')" class="required" prop='name'>
						    <el-input v-model="taskInfo.name" :disabled='disableFlag'></el-input>
						</el-form-item>
						<el-form-item v-if='!taskInfo.editFlag' class="required" :label="$t('message.deviceGroup.taskType_L')">
							<el-select v-model="taskInfo.taskType" placeholder="请选择" :disabled='disableFlag'>
							    <el-option
							      v-for="item in taskTypeList"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item v-else :label="$t('message.deviceGroup.taskType_L')">
							<span v-if='taskInfo.taskType==0'>{{$t('message.deviceGroup.timingSwitch')}}</span>
							<span v-else>{{$t('message.deviceGroup.stopPlay')}}</span>
						</el-form-item>
						<!--开机时间-->
						<el-form-item v-if='taskInfo.taskType==0' :label="$t('message.deviceGroup.startMT')" class="required" prop='startTime'>
						    <el-time-picker
							    v-model="taskInfo.startTime"
							    :value="taskInfo.startTime"
							    format="HH:mm"
							    value-format="HH:mm"
							    :picker-options="{
							      selectableRange: '00:00:00 - 23:59:59'
							    }"
							    :disabled='disableFlag'
							    :clearable='timePickClear'
							    :placeholder="$t('message.deviceGroup.startTime')">
							  </el-time-picker>
						</el-form-item>
						<!--关机时间-->
						<el-form-item v-if='taskInfo.taskType==0' :label="$t('message.deviceGroup.endMT')" class="required" prop='endTime'>
						    <el-time-picker
							    v-model="taskInfo.endTime"
							    :value="taskInfo.endTime"
							    format="HH:mm"
							    value-format="HH:mm"
							    :picker-options="{
							      selectableRange: '00:00:00 - 23:59:59',
							    }"
							    :disabled='disableFlag'
							    :clearable='timePickClear'
							    :placeholder="$t('message.deviceGroup.endTime')">
							  </el-time-picker>
						</el-form-item>
						<!--循环模式-->
						<el-form-item v-if='taskInfo.taskType==0' :label="$t('message.deviceGroup.circulation')" class="required" prop='cicleModel'>
						    <el-select v-model="taskInfo.cicleModel" placeholder="请选择" :disabled='disableFlag'>
							    <el-option
							      v-for="item in circleType"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item v-if='taskInfo.taskType' :label="$t('message.deviceGroup.circulation')" prop='cicleModel'>
							{{$t('message.deviceGroup.taskContinue')}}
						</el-form-item>
						<el-form-item v-if='taskInfo.taskType==0' label="" class="required" prop='weeks' v-show='taskInfo.cicleModel == 2'>
							<el-checkbox-group v-model="taskInfo.weeks" :disabled='disableFlag'>
							    <el-checkbox label="1">{{cycleDateArr[0]}}</el-checkbox>
							    <el-checkbox label="2">{{cycleDateArr[1]}}</el-checkbox>
							    <el-checkbox label="3">{{cycleDateArr[2]}}</el-checkbox>
							    <el-checkbox label="4">{{cycleDateArr[3]}}</el-checkbox>
							    <el-checkbox label="5">{{cycleDateArr[4]}}</el-checkbox>
							    <el-checkbox label="6">{{cycleDateArr[5]}}</el-checkbox>
							    <el-checkbox label="7">{{cycleDateArr[6]}}</el-checkbox>
							  </el-checkbox-group>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>	
		  <div slot="footer" class="dialog-footer">
		  	<!--确 定-->
		  	<el-button v-if='updateFlag' type="primary" @click="taskAddE" class='mybtn-primary'>{{$t('message.material.btnOk')}}</el-button>
		  	<el-tooltip v-else effect="dark" :content="$t('message.sysTipPre')+ taskInfo.username +$t('message.sysTipSuf')" placement="top">
		  		<el-button type="primary" class='mybtn-primary btnDis'>{{$t('message.material.btnOk')}}</el-button>
			</el-tooltip>
		  	<!--取 消-->
		    <el-button type="primary" @click="taskUpdate = false" class='mybtn-primary'>{{$t('message.material.btnCancel')}}</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		http
	} from "../../api/config";
	export default {
		name:'timeTask',
		data () {
			let weeksValidator = (rule, value, callback) => {
				//循环方式
				if (2 !== this.taskInfo.cicleModel) {
					callback();
				} else{
					if (value.length == 0) {
						//请选择循环日期
			            callback(new Error(this.$t('message.deviceGroup.weeksNotNull')));
			       } else {
			       		callback();
			       }
				}
		      };
		      let timeValidator = (rule, value, callback) => {
				//循环方式
				if ('' == this.taskInfo.startTime || '' == this.taskInfo.endTime) {
					callback();
				} else{
					if (this.dateFormat(this.taskInfo.startTime).getTime() >= this.dateFormat(this.taskInfo.endTime).getTime()) {
						//开机时间要小于关机时间
			            callback(new Error(this.$t('message.deviceGroup.startLgend')));
			        } else {
			       		callback();
			        }
				}
		      };
			return {
				taskName:'',
				filterTaskName:'',
				page:1,
				limit:20,
				total:0,
				taskList:[],
				ids: [],//默认选中的id
		        message: [],
		        treeData: [],
		        defaultProps: {
		          	children: 'child',
          			label: 'displayGroup'
		        },
				listLoading:false,
				taskUpdate:false,
				updateFlag: false,
				labelPosition:"right",
				formLabelWidth:'30%',
				taskInfo: {
					taskId:null,
					taskType: 0,
					name:'',
					startTime:'',
					endTime:'',
					cicleModel:0,
					weeks:[],
					username:'',
					devIds:[],
					editFlag:false
				},
				disableFlag: true,
				taskRule : {
					name:[{
						required:true,
						message:this.$t('message.deviceGroup.taskNameNotNull'),
						trigger:'blur'
					}],
					startTime:[{
						required:true,
						message:this.$t("message.deviceGroup.startNotNull"),
						trigger:'blur'
					}],
					endTime:[{
						required:true,
						message:this.$t("message.deviceGroup.endNotNull"),
						trigger:'blur'
					},{
						validator:timeValidator,
						trigger:'submit'
					}],
					weeks:[{
						validator:weeksValidator,
						trigger:'submit'
					}]
				},
				timePickClear:true,
				taskTypeList:[{
					label:this.$t('message.deviceGroup.timingSwitch'),
					value:0
				}, {
					label:this.$t('message.deviceGroup.stopPlay'),
					value:1
				}],
				circleType:[{
					label:this.$t("message.deviceGroup.cycleOnce"),
					value:0
				},
				{
					label:this.$t("message.deviceGroup.cycleContinus"),
					value:1
				},
				{
					label:this.$t("message.deviceGroup.cycleCustom"),
					value:2
				}],
				mediaBoxTitle:this.$t('message.deviceGroup.taskAdd'),
				cycleDateArr:[
					this.$t('message.deviceGroup.monday'),
					this.$t('message.deviceGroup.tuesday'),
					this.$t('message.deviceGroup.wednesday'),
					this.$t('message.deviceGroup.thursday'),
					this.$t('message.deviceGroup.friday'),
					this.$t('message.deviceGroup.sateday'),
					this.$t('message.deviceGroup.sunday')
				],
				emptyDataTip:""
			}
		}, 
		methods:{
			/*table复选框选择*/
			selsChange (list) {
				this.ids = [];
				list.forEach((item, index) => {
					this.ids.push(item.taskId);
				})
			},
			indexMethod(index){				
				return (this.page - 1) * (this.limit) + 1 + index;
			},
			handleSizeChange (limit) {
				this.limit = limit;
				this.taskName = this.filterTaskName;
				this.getTaskList();
			},
			handleCurrentChange (page) {
				this.taskList = [];
				this.emptyDataTip = "";
				this.taskName = this.filterTaskName;
				this.page = page;
				this.getTaskList();
			},
			handle(item) {
		        this.message.push(`节点 ${JSON.stringify(item)} 作为事件参数传递`)
		    },
			/*获取任务列表*/
			getTaskList () {
				let taskOption = {
					url:http.timeTask,
					type:"GET",
					data:{
						name:this.filterTaskName
					}
				}
				this.LonbonAjax(taskOption).then((res) => {
					let resCode = res.errorCode;
					if (200 == resCode) {
						if (res.data) {
							this.total = res.data.total;
							res.data.data.forEach((item, index) => {
								let displayNames = item.displays.join('、');
								res.data.data[index].displayNames = displayNames;
							})
							this.taskList = res.data.data;
						} else {
							this.total = 0;
							this.taskList = [];
						}
						
					}
					this.listLoading = false;
					this.emptyDataTip = this.$t('message.dataEmptyTip');
				}, (err) => {
					this.listLoading = false;
					this.total = 0;
					this.taskList = [];
					this.emptyDataTip = this.$t('message.dataEmptyTip');
					if(400 != err.errorCode) {
						this.$message.error(err.message);
					} else if (this.page > 1) {
						this.page = this.page - 1;
						this.getTaskList();
					}
				})
			},
			getCycleDate(days) {
				var dayArr = days.split(',').sort();
				let weeks = [];
				for(let i = 0; i < dayArr.length; i++) {
					weeks.push(this.cycleDateArr[dayArr[i] - 1]);
				}
				return weeks.join('、');
			},
			/*删除任务*/
			delTask (id) {
				let delOption = {
					url:http.taskDel,
					type:'DELETE',
					data:{
						ids:''
					}
				}
				if (id != 0) {
					delOption.data.ids = id;
				} else {
					if (1 > this.ids.length) {
						/*'请选择需要删除的任务'*/
						this.$message.warning(this.$t('message.deviceGroup.delTaskNotNull'));
						return;
					}
					delOption.data.ids = this.ids.join(',');
				}
				/*确认删除选择的定时任务？*/
				this.$confirm(this.$t('message.deviceGroup.confirmDelTask'), {type:'warning'}).then(() => {
					this.LonbonAjax(delOption).then((res) => {
						let resCode = res.errorCode;
						if (200 == resCode) {
							this.getTaskList();
							this.$message.success(this.$t('message.deviceGroup.delSuccess'));
						}
					}, (err) => {
						this.$message.error(err.message);
					})
				}).catch(() => {})
			},
			/*清空dialog数据*/
			dialogInit () {
				this.taskInfo.taskId = null;
//				this.taskInfo.name = '';
//				this.taskInfo.startTime = '';
				this.taskInfo.endTime = '';
//				this.taskInfo.cicleModel = 0;
//				this.taskInfo.weeks = [];
//				this.taskInfo.devIds = [];
				this.taskInfo.editFlag = false;
				this.$refs.devTree.setCheckedKeys([]);
				this.$refs['task'].resetFields();
			},
			/*添加任务*/
			addTask () {
				this.mediaBoxTitle = this.$t('message.deviceGroup.taskAdd');
				this.taskUpdate = true;
				this.disableFlag = false;
				this.updateFlag = true;
			},
			//树形图
		      taskHandleCheckChange(data, checked, indeterminate){
		        this.taskInfo.devIds = this.$refs['devTree'].getCheckedNodes();
		      },
			/*搜索*/
			searchTask () {
				this.page = 1;
				this.filterTaskName = this.taskName;
				this.getTaskList();
			},
			/*暂停操作*/
			pauseTask (column) {
				let statusCode = column.taskStatus;
				let confirmTip = '';
				let successTip='';
				if (statusCode) {
					confirmTip = this.$t('message.deviceGroup.recoverTaskConfirm');
					successTip = this.$t('message.deviceGroup.recoverSuccess');
				} else {
					confirmTip = this.$t('message.deviceGroup.pauseTaskConfirm');
					successTip = this.$t('message.deviceGroup.pauseSuccess');
				}
				let taskId = column.taskId;
				let taskName = column.taskName;
				let pauseOption = {
					url:http.pauseTask,
					type:'POST',
					data:{
						id:taskId,
						status:statusCode==0?1:0
					}
				}
				this.$confirm(confirmTip + taskName, {type:'warning'}).then(() => {
					this.LonbonAjax(pauseOption).then((res) => {
						this.$message.success(column.taskName +　successTip);
						this.getTaskList();
					}, (err) => {
						this.$message.error(err.message);
					})
				}).catch(() => {})
			},
			/*编辑*/
			editTask (row) {
				let id = row.taskId;
				this.disableFlag = !row.isEditPermission;
				if (row.isEditPermission) {
					this.updateFlag = true;
				} else {
					this.updateFlag = false;
				}
				this.mediaBoxTitle = this.$t('message.deviceGroup.taskEdit');
				let taskOption = {
					url:http.timeTask + "/" + id,
					type:'GET',
					data:{
						taskId:id
					}
				}
				this.taskUpdate = true;
				this.LonbonAjax(taskOption).then((res) => {
					this.taskInfo.editFlag = true;
					let resData = res.data;
					this.$set(this.taskInfo, 'name', resData.taskName);
					this.$set(this.taskInfo, 'taskId', resData.taskId);
					this.$set(this.taskInfo, 'startTime', resData.taskStart);
					this.$set(this.taskInfo, 'endTime', resData.taskEnd);
					this.taskInfo.username = row.username;
					//任务循环类型
					this.$set(this.taskInfo, 'cicleModel', resData.taskType);
					//任务类型
					this.$set(this.taskInfo, 'taskType', resData.type)
					if (resData.days && 2 == resData.taskType) {
						this.$set(this.taskInfo, 'weeks', resData.days.split(','));
					}
					this.$refs.devTree.setCheckedKeys(resData.groupsId.split(','));
					this.taskInfo.devIds = resData.groupsId.split(',');
					//groups_id 设备分组
				}, (err) => {
					this.$message.error(err.message);
				})
			},
			/*添加编辑*/
			taskAddE () {
				this.$refs['task'].validate((valid) => {
					if (!valid) {
						return;
					}
					let deviceList = this.taskInfo.devIds;
					let deviceIds = [];
					deviceList.forEach((item, index) => {
						if (!item.hasOwnProperty("isDisplaySpecific") && item.groupId) {
							deviceIds.push(item.groupId);
						}
					})
					if (deviceIds.length < 1) {
						this.$message.warning(this.$t("message.deviceGroup.deviceNotNull"));
						return;
					}
					let taskAdd = {};
					let tt = this.taskInfo.taskType;
					if (tt == 0) {
						taskAdd = {
							url:http.timeTask,
							type:'POST',
							data:{
								name:this.taskInfo.name,
								start:this.taskInfo.startTime,
								end:this.taskInfo.endTime,
								taskType:this.taskInfo.cicleModel,
								days:this.taskInfo.weeks.join(','),
								groups_id:deviceIds.join(','),
								type:tt
							}
						}
					} else {
						taskAdd = {
							url:http.timeTask,
							type:'POST',
							data:{
								name:this.taskInfo.name,
								type:tt,
								groups_id:deviceIds.join(','),
								taskType:1
							}
						}
					}
					
					let taskId = this.taskInfo.taskId;
					if (taskId) {
						taskAdd.url = taskAdd.url + "/" + taskId;
						taskAdd.type = "PUT";
						taskAdd.data.id = taskId;
					}
					this.LonbonAjax(taskAdd).then((res) => {
						let resCode = res.errorCode;
						if (200 == resCode) {
							if (!taskAdd.data.id) {
								this.$message.success(this.$t('message.deviceGroup.addSuccess'));
							} else {
								this.$message.success(this.$t('message.deviceGroup.editSuccess'));
							}
							this.getTaskList();
							this.taskUpdate = false;
						}
					}, (err) => {
						this.$message.error(err.message);
					})
				})
			},
			/*将10:25:12转换成时间格式。2018.1.1格式需求，无实际意义*/
			dateFormat (timeStr) {
				let timeArray = timeStr.split(':');
				let timeTmp = [];
				timeArray.forEach((item, index) => {
					timeTmp.push(parseInt(item));
				})
				return new Date(2018,1,1,timeTmp[0], timeTmp[1], 0);
			},
			dateToStr (date) {
				let hour = date.getHours() < 10? '0'+date.getHours():date.getHours();
				let minutes = date.getMinutes() < 10?'0'+date.getMinutes():date.getMinutes();
				let seconds = date.getSeconds() < 10?'0'+date.getSeconds():date.getSeconds();
				return hour + ":" + minutes + ":" + seconds;
			},
			getGroupList () {
				let groupOption = {
					url:http.groupList,
					type:'GET'
				}
				this.LonbonAjax(groupOption).then((res) => {
					var data = res.data;
			        var tmpObj = {
			          displayGroup:this.$t('message.taskManage.nogroup'),
			          child:[]
			        };
			        var last = data.pop();
			        if(last.noGroup.length>0){
			          tmpObj.child = last.noGroup;
			          data.push(tmpObj);
			        }
			        this.treeData = data;
				}, (err) => {
					if (400 != err.errorCode) {
						this.$message.error(err.message)
					}
				})
			}
		},
		mounted () {
			this.getTaskList();
			this.getGroupList();
		},
		beforeRouteEnter(to, from, next) {
	      //传给父组建值
	      next(vm => {
	        vm.$emit('update:devicename', '2')
	      })
	
	    }
	}
</script>
<style lang="less">
	#taskUpdate {
		.el-input, .el-textarea, .el-form-item__error, .el-select {
			width:90%;
		}
		.el-select .el-input {
			width:100%;
		}
		.el-input--prefix .el-input__inner {
			width:100%;
		}
	}
</style>
<style scoped lang='less'>
	.el-tree-node__content>.el-tree-node__expand-icon {
	    border: 1px solid #18abbb !important;
	}
	.paused {
		color:#ff0c0c;
	}
	.working {
		color:#05b72b;
	}
	.tableBtn {
		padding:0;
		color:#18ABBB;
		font-size:1em;
	}  
	.disabled {
		color:#CCC;
	}
	.btnDis {
		background-color:#CCC !important;
	}
	.deviceTree {
		padding:1em;
		border:1px solid #ccc;
		height:25em;
		overflow:auto;
		border-radius: 8px;
		.title {
			font-size: 1.2rem;
    		font-weight: bold;
    		margin-bottom:0.5em;
		}
	}
	.timeTask {
		height: 100%;
		background-color: #FFF;
		border-radius:0.5em;
		.operateBox {
			.el-icon-search {
				line-height:2.25em;
			}
			padding:1.25em;
			.el-input {
				margin-right: 1em;
				width:13.75em;
			}
			.el-button:not(#search) {
				float:right;
			}
		}
		.btnBox {
			float: right;
		}
		.toolbar {
			margin-top:1em;
			padding-right:2em;
		}
		
		.el-checkbox {
			margin-left:0;
			margin-right:1.5em;
		}
	}
</style>