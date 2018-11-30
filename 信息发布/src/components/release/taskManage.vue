<template>
	<div class="layout-manage">
		<div class="page-title">{{$t('message.menu.release')}}</div>
		<div class="layout-manage-header bx">
			<button class="el-button mybtn-primary el-button--primary" @click="add_task_dialog = true,
      				task_title = $t('message.taskManage.task_title_add');
      				isEditPermission=false
      				task_edit_id = ''">
				{{$t('message.taskManage.add_task')}}
			</button>
			<button class="el-button mybtn-primary el-button--primary" @click="show_dele_dialog('')">
				{{$t('message.releaseManage.delete')}}
			</button>
		</div>
		<el-table v-loading="loading" :data="layout_table_data" class="my-table" @selection-change="selsChange"
		 highlight-current-row height="calc(100% - 90px - 2em)" style="width: 100%;">
			<el-table-column type="selection" :selectable="chekUserId" width='50'></el-table-column>
			<el-table-column type="index" :index="indexMethod" :label="$t('message.deviceGroup.No')" width='120'></el-table-column>
			<!--任务名称-->
			<el-table-column :formatter="formatterscheduleName" :label="$t('message.taskManage.task_name')"
			 show-overflow-tooltip style="width: 80%;"></el-table-column>
			<!--任务状态-->
			<el-table-column :label="$t('message.taskManage.task_status')">
				<template slot-scope='scope'>
					<span v-if="scope.row.auditStatus==0">
						{{$t("message.taskManage.wait_audit")}}
					</span>
					<span v-else-if="scope.row.auditStatus==1" style="color: #05b72b;">
						{{$t("message.taskManage.through_audit")}}
					</span>
					<span v-else="scope.row.auditStatus==2" style="color: #ff0c0c;">
						{{$t("message.taskManage.failure_audit")}}
					</span>
				</template>
			</el-table-column>
			<!--播出状态-->
			<el-table-column prop="username" :label="$t('message.taskManage.broadcast_state')">
				<template slot-scope='scope'>
					<span v-if="playState(scope.row) ==-1">
						{{$t("message.taskManage.not_beginning")}}
					</span>
					<span v-else-if="playState(scope.row) ==0" style="color: #ff0c0c;">
						{{$t("message.taskManage.finished")}}
					</span>
					<span v-else="playState(scope.row) ==1" style="color: #05b72b;">
						{{$t("message.taskManage.broadcast")}}
					</span>
				</template>
			</el-table-column>
			<!--时间段-->
			<el-table-column prop="duration" :label="$t('message.taskManage.time_slot')" show-overflow-tooltip>
				<template slot-scope='scope'>
					{{scope.row | formatDatime}}
				</template>
			</el-table-column>
			<!--创建者-->
			<el-table-column prop="userName" :label="$t('message.taskManage.creator')" show-overflow-tooltip></el-table-column>
			<!--终端-->
			<el-table-column :label="$t('message.taskManage.terminal')" show-overflow-tooltip>
				<template slot-scope='scope'>
					{{scope.row | formatDisplay}}
				</template>
			</el-table-column>
			<!--布局-->
			<el-table-column prop="layout" :label="$t('message.taskManage.layout')"></el-table-column>
			<!--操作-->
			<el-table-column width="200" :label="$t('message.releaseManage.operation')">
				<template slot-scope="scope">
					<!-- 编辑 -->
					<el-button class='tableBtn' @click="task_edit(scope.row)" type="text" size="medium">
						{{$t('message.releaseManage.edit')}}
					</el-button>
					<!-- 预览 -->
					<el-button class='tableBtn' @click="previewlayout(scope.row.layoutId)" type="text" size="medium">
						{{$t('message.releaseManage.preview')}}
					</el-button>
					<!-- 删除 -->
					<el-button class='tableBtn' v-if="scope.row.isEditPermission==1" @click="show_dele_dialog(scope.row)" type="text"
					 size="medium">
						{{$t('message.releaseManage.delete')}}
					</el-button>
					<el-tooltip v-else class="item" effect="dark" :content="$t('message.taskManage.tooltip1')+scope.row.userName+$t('message.taskManage.tooltip2')"
					 placement="top">
						<el-button class='tableBtn' type="text" size="medium" style="color:#ccc">{{$t('message.releaseManage.delete')}}</el-button>
					</el-tooltip>
					<!-- 暂停任务 -->
					<!-- <el-button class='tableBtn' @click="task_edit(scope.row)" type="text" size="medium">
						{{$t('message.releaseManage.pauseTask')}}
					</el-button> -->
					<!-- 开始任务 -->
					<!-- <el-button style="color: rgb(255, 12, 12);" class='tableBtn' @click="task_edit(scope.row)" type="text" size="medium">
						{{$t('message.releaseManage.startTask')}}
					</el-button> -->

				</template>
			</el-table-column>
			<div slot="empty">
				<p :style="{'marginTop': '23px'}">{{emptyData}}</p>
			</div>
		</el-table>
		<el-col :span="24" class="toolbar">
			<el-pagination background layout="total,sizes,prev, pager, next,jumper" :current-page.sync="currentPage" :page-size="limit"
			 :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>
		<!--添加任务弹框-->
		<el-dialog :show-close='false' :close-on-click-modal='false' :title="task_title" :visible.sync="add_task_dialog"
		 width="986px" center top="30px">
			<div class="layout-body task-form">
				<div class="group-list-box">
					<p>{{$t('message.taskManage.selection_device')}}</p>
					<el-tree :data="treeData" :empty-text="this.$t('message.layoutManage.nodata')" :props="defaultProps"
					 :default-expanded-keys="default_expanded_keys" :default-checked-keys="default_checked_keys" show-checkbox ref="taskTree"
					 node-key="groupId" @check-change="taskHandleCheckChange">
						<!-- <span class="custom-tree-node" slot-scope="{ node, data }" show-overflow-tooltip> -->
						<!-- <el-tooltip class="item" effect="dark" :content="node.label" placement="top-start"> node.label-->
						<!-- <span show-overflow-tooltip >{{ node.label }}</span> -->
						<!-- </el-tooltip> -->
						<!-- </span> -->
					</el-tree>
				</div>
				<div class="task-info-box bx">
					<!--任务名称-->
					<el-form label-width="20%" :model='task' :rules="taskRules" ref="ruleForm">
						<el-form-item :label="$t('message.releaseManage.name')" prop="name" class="required">
							<el-input style='width: 80%;' v-model.trim='task.name'></el-input>
						</el-form-item>
						<!--布局-->
						<el-form-item :label="$t('message.taskManage.layout')" prop="layout" class="required item-box">
							<el-select :disabled="isEditPermission" v-model="task.layout" @change="input_change('layout')"
							 show-overflow-tooltip>
								<el-option v-for="item in task.layout_options" :key="item.id" :label="item.layout" :value="item.id" :title="item.layout"
								 show-overflow-tooltip>
								</el-option>
							</el-select>
						</el-form-item>
						<!--本次任务-->
						<el-form-item :label="$t('message.taskManage.this_task')" class="required item-box" prop="startTime">
							<el-date-picker :disabled="isEditPermission" class='my-date-pick' v-model="task.startTime" type="datetime"
							 prefix-icon="none" @change="task_start_cahnge" value-format="timestamp">
							</el-date-picker>
						</el-form-item>
						<!--有效期-->
						<el-form-item :label="$t('message.taskManage.valid_period_to')" class="required item-box" prop="endTime">
							<el-date-picker :disabled="isEditPermission" class='my-date-pick' v-model="task.endTime" type="datetime"
							 prefix-icon="none" value-format="timestamp">
							</el-date-picker>
						</el-form-item>
						<!--播放按钮-->
						<el-form-item :label="$t('message.taskManage.play_button')" class="required item-box" prop="play_type">
							<el-select :disabled="isEditPermission" v-model="task.play_type" @change="changCycle">
								<el-option v-for="item in play_type_option" :key="item.value" :label="item.lable" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<!--单次循环开始-->
						<el-form-item :label="$t('message.taskManage.cycle_time_once')" class="item-box required" prop="play_cycle_start"
						 v-if="task.play_type=='once'">
							<el-date-picker :disabled="isEditPermission" class='my-date-pick' v-model="task.play_cycle_start" type="datetime"
							 prefix-icon="none" value-format="timestamp">
							</el-date-picker>
						</el-form-item>
						<!--单次循环结束-->
						<el-form-item :label="$t('message.taskManage.continue_to_once')" class="item-box required" prop="play_cycle_end"
						 v-if="task.play_type=='once'">
							<el-date-picker :disabled="isEditPermission" class='my-date-pick' v-model="task.play_cycle_end" type="datetime"
							 prefix-icon="none" value-format="timestamp">
							</el-date-picker>
						</el-form-item>
						<!--月循环开始-->
						<el-form-item :label="$t('message.taskManage.cycle_time')" class="required item-box time-box" prop="play_cycle_start"
						 v-if="task.play_type =='Month'">
							<el-select :disabled="isEditPermission" v-model="task.play_cycle_start" @change="input_change('cycle_start')">
								<el-option v-for="(item,index) in month" :key="index +1 " :label="index+1 + $t('message.taskManage.Number')"
								 :value="index + 1 ">
								</el-option>
							</el-select>
							<el-form-item style='display: inline-block;width: 40%;'>
								<!-- <el-time-select :disabled="isEditPermission" prefix-icon="none" v-model="task.cycle_start_time" :picker-options="{
													start: '00:30',
													step: '00:30',
													end: '23:30'
												}"
								 :placeholder="$t('message.taskManage.select_plac')" @change="input_change('cycle_end')">
								</el-time-select> -->
								<el-time-picker prefix-icon="none" v-model="task.cycle_start_time" :value="task.cycle_start_time" format="HH:mm"
								 value-format="HH:mm" :picker-options="{
									selectableRange: '00:00:00 - 23:30:00'
									}">
								</el-time-picker>
							</el-form-item>
						</el-form-item>
						<!--月循环结束-->
						<el-form-item :label="$t('message.taskManage.continue_to')" class="required item-box time-box" prop="play_cycle_end"
						 v-if="task.play_type =='Month'">
							<el-select :disabled="isEditPermission" v-model="task.play_cycle_end" @change="input_change('cycle_end')">
								<el-option v-for="(item,index) in month" :key="index +1 " :label="index+1 + $t('message.taskManage.Number')"
								 :value="index + 1 ">
								</el-option>
							</el-select>
							<el-form-item style='display: inline-block;width: 40%;'>
								<!-- <el-time-select :disabled="isEditPermission" prefix-icon="none" v-model="task.cycle_end_time" :picker-options="{
													start: '00:30',
													step: '00:30',
													end: '23:30'
												}"
								 :placeholder="$t('message.taskManage.select_plac')" @change="input_change('cycle_end')">
								</el-time-select> -->
								<el-time-picker prefix-icon="none" v-model="task.cycle_end_time" :value="task.cycle_end_time" format="HH:mm"
								 value-format="HH:mm" :picker-options="{
									selectableRange: '00:00:00 - 23:30:00'
									}">
								</el-time-picker>
							</el-form-item>
						</el-form-item>
						<!--周循环开始-->
						<el-form-item :label="$t('message.taskManage.cycle_time')" class="required item-box time-box" prop="play_cycle_start"
						 v-if="task.play_type =='Week'">
							<el-select :disabled="isEditPermission" v-model="task.play_cycle_start" @change="input_change('cycle_start')">
								<el-option v-for="item in weeks" :key="item.value" :label="item.lable" :value="item.value">
								</el-option>
							</el-select>
							<el-form-item style='display: inline-block;width: 40%;'>
								<!-- <el-time-select :disabled="isEditPermission" prefix-icon="none" v-model="task.cycle_start_time" :picker-options="{
													start: '00:30',
													step: '00:30',
													end: '23:30'
												}"
								 :placeholder="$t('message.taskManage.select_plac')">
								</el-time-select> -->
								<el-time-picker prefix-icon="none" v-model="task.cycle_start_time" :value="task.cycle_start_time" format="HH:mm"
								 value-format="HH:mm" :picker-options="{
									selectableRange: '00:00:00 - 23:30:00'
									}">
								</el-time-picker>
							</el-form-item>
						</el-form-item>
						<!--周循环结束-->
						<el-form-item :label="$t('message.taskManage.continue_to')" class="required item-box time-box" prop="play_cycle_end"
						 v-if="task.play_type =='Week'">
							<el-select :disabled="isEditPermission" v-model="task.play_cycle_end" @change="input_change('cycle_end')">
								<el-option v-for="item in weeks" :key="item.value" :label="item.lable" :value="item.value">
								</el-option>
							</el-select>
							<el-form-item style='display: inline-block;width: 40%;'>
								<!-- <el-time-select :disabled="isEditPermission" prefix-icon="none" v-model="task.cycle_end_time" :picker-options="{
														start: '00:30',
														step: '00:30',
														end: '23:30'
													}"
								 :placeholder="$t('message.taskManage.select_plac')">
								</el-time-select> -->
								<el-time-picker prefix-icon="none" v-model="task.cycle_end_time" :value="task.cycle_end_time" format="HH:mm"
								 value-format="HH:mm" :picker-options="{
									selectableRange: '00:00:00 - 23:30:00'
									}">
								</el-time-picker>
							</el-form-item>

						</el-form-item>
						<!--天环开始-->
						<el-form-item :label="$t('message.taskManage.cycle_time')" class="required item-box day-time" v-if="task.play_type =='Day'">
							<!-- <el-time-select :disabled="isEditPermission" prefix-icon="none" v-model="task.cycle_start_time" :picker-options="{
												start: '00:30',
												step: '00:30',
												end: '23:30'
											}"
							 :placeholder="$t('message.taskManage.select_plac')" @change="input_change('cycle_end')">
							</el-time-select> -->
							<el-time-picker prefix-icon="none" v-model="task.cycle_start_time" :value="task.cycle_start_time" format="HH:mm"
							 value-format="HH:mm" :picker-options="{
								  selectableRange: '00:00:00 - 23:30:00'
								}">
							</el-time-picker>
						</el-form-item>
						<!--天循环结束-->
						<el-form-item :label="$t('message.taskManage.continue_to')" class="required item-box day-time" v-if="task.play_type =='Day'">
							<el-time-picker prefix-icon="none" v-model="task.cycle_end_time" :value="task.cycle_end_time" format="HH:mm"
							 value-format="HH:mm" :picker-options="{
								selectableRange: '00:00:00 - 23:30:00'
								}">
							</el-time-picker>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button v-if="isEditPermission ==false" class="el-button mybtn-primary el-button--primary" @click='add_task("ruleForm")'
				 type="primary">
					{{$t('message.releaseManage.okBtn')}}
				</el-button>
				<el-tooltip v-else class="item" effect="dark" :content="$t('message.taskManage.tooltip1')+editName+$t('message.taskManage.tooltip2')"
				 placement="top">
					<el-button style="background: #ccc!important;" class="el-button mybtn-primary el-button--primary" type="primary">{{$t('<message class="relea"></message>seManage.okBtn')}}
					</el-button>
				</el-tooltip>
				<el-button class="el-button mybtn-primary el-button--primary" @click="cancel_layout_dialog('ruleForm')">{{$t('message.cancelChange')}}</el-button>
			</span>
		</el-dialog>
		<!--刪除組件-->
		<delete-dialog ref="deleteConfirm" :delete_dialog_show="delete_dialog_show" :func="delete_task"
		 v-on:close_dele_dialog="close_dele_dialog">
		</delete-dialog>
	</div>
</template>

<script>
	import {
		http
	} from "../../api/config";
	import CryptoJS from "crypto-js/crypto-js";
	import DeleteDialog from "./delete/deleteDialog";
	export default {
		name: "layoutManage",
		components: {
			DeleteDialog
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit("pageName", to.name);
				vm.$emit("materialName", "2");
			});
		},
		data: function() {
			return {
				emptyData: this.$t("message.releaseManage.empty_data"),
				taskRules: {
					name: {
						required: true,
						message: this.$t("message.taskManage.task_name_no"),
						trigger: 'blur'
					},
					layout: {
						required: true,
						message: this.$t("message.taskManage.task_layout_no"),
						trigger: 'blur'
					},
					startTime: {
						required: true,
						message: this.$t("message.taskManage.task_start_time"),
						trigger: 'blur'
					},
					endTime: {
						required: true,
						message: this.$t("message.taskManage.task_end_time"),
						trigger: 'blur'
					},
					play_cycle_start: {
						required: true,
						message: this.$t("message.taskManage.task_cycle_start_time"),
						trigger: 'blur'
					},
					play_cycle_end: {
						required: true,
						message: this.$t("message.taskManage.task_cycle_end_time"),
						trigger: 'blur'
					},

				},
				editName: '',
				isEditPermission: '', //是否有编辑权限
				tooltip: this.$t("message.taskManage.tooltip1") + window.localStorage.current_user + this.$t(
					"message.taskManage.tooltip2"),
				default_expanded_keys: [],
				default_checked_keys: [],
				userId: "",
				campaignId: "",
				loading: false,
				task_title: "",
				task_edit_id: "",
				read_task: [],
				pickerBeginDateBefore: {
					disabledDate: time => {
						return time.getTime() < Date.now() - 24 * 3600 * 1000;
					}
				},
				error_tips: {
					task_cycle_start_error: "",
					task_cycle_end_error: "",
					task_name_error: "",
					task_type_error: "",
					task_layout_error: "",
					task_start_error: "",
					task_end_error: ""
				},
				//循环单位周
				month: [],
				weeks: [{
						lable: this.$t("message.taskManage.monday"),
						value: "1"
					},
					{
						lable: this.$t("message.taskManage.tuesday"),
						value: "2"
					},
					{
						lable: this.$t("message.taskManage.wednesday"),
						value: "3"
					},
					{
						lable: this.$t("message.taskManage.thursday"),
						value: "4"
					},
					{
						lable: this.$t("message.taskManage.friday"),
						value: "5"
					},
					{
						lable: this.$t("message.taskManage.saturday"),
						value: "6"
					},
					{
						lable: this.$t("message.taskManage.sunday"),
						value: "0"
					}
				],
				//播放循环类型
				play_type_option: [{
						lable: this.$t("message.taskManage.month"),
						value: "Month"
					},
					{
						lable: this.$t("message.taskManage.week"),
						value: "Week"
					},
					{
						lable: this.$t("message.taskManage.day"),
						value: "Day"
					},
					{
						lable: this.$t("message.taskManage.once_cycle"),
						value: "once"
					}
				],
				dele_ids: [], //要删除的任务id
				delete_dialog_show: false,
				ids: [], //默认选中的id
				message: [],
				defaultProps: {
					children: "child",
					label: "displayGroup"
				},
				// displayGroup
				// 组织树形图
				treeDataTmp: [],
				treeData: [],
				startTime: "",
				total: 0,
				page: 1,
				currentPage: 1,
				all_template: [],
				layout_table_data: [],
				limit: 20,
				add_task_dialog: false,
				task: {
					name: "",
					type: "",
					startTime: '',
					endTime: '',
					play_type: "Week",
					play_cycle_start: "",
					play_cycle_end: "",
					cycle_start_time: '00:00',
					cycle_end_time: '23:30',
					layout: "",
					layout_options: [],
					checkedGroup: []
				}
			};
		},
		filters: {
			formatDisplay(item) {
				return item.display.join(",");
			},
			formatDatime(item) {
				var recurrenceRange = item.recurrenceRange * 1000 || item.toDt * 1000;
				var scheduleStart = item.scheduleStart * 1000 || item.fromDt * 1000;
				recurrenceRange = new Date(recurrenceRange);
				scheduleStart = new Date(scheduleStart);
				var startTime = "";
				var endTime = "";
				var startH = scheduleStart.getMonth() + 1;
				var startM = scheduleStart.getDate();
				var endH = recurrenceRange.getMonth() + 1;
				var endM = recurrenceRange.getDate();
				startH = startH >= 10 ? startH : "0" + startH;
				startM = startM >= 10 ? startM : "0" + startM;
				endH = endH >= 10 ? endH : "0" + endH;
				endM = endM >= 10 ? endM : "0" + endM;
				startTime = startH + "/" + startM;
				endTime = endH + "/" + endM;
				return startTime + "-" + endTime;
			}
		},
		computed: {
			formatterscheduleName() {
				var _this = this;
				return function(row) {
					return row.scheduleName || _this.$t('message.releaseManage.noname');
				}
			},
			playState() {
				return function(item) {
					var status = item.auditStatus;
					var fromDt = item.fromDt * 1000; //有效期开始
					var toDt = item.toDt * 1000; //有效期结束
					var scheduleStart = item.scheduleStart * 1000; //循环开始
					var recurrenceRange = item.recurrenceRange * 1000; //循环结束
					var timestamp = new Date().getTime();
					//没有通过审核
					if (status != 1) {
						return -1;
					}
					//超出有效期但在循环时间内
					if (timestamp > toDt && timestamp > scheduleStart && timestamp < recurrenceRange) {
						return 1;
					}
					//超出有效期和循环时间
					if (timestamp > toDt && timestamp > recurrenceRange) {
						return 0;
					}
					if (timestamp < fromDt) {
						return -1; //未开始
					}
					if (timestamp > fromDt && timestamp < toDt) {
						return 1;
					}
				};
			}
		},
		created: function() {
			var _this = this;
			_this.userId = window.localStorage.userId;
			_this.month = new Array(_this.get_months_days());
			//获取所有的布局
			_this
				.LonbonAjax({
					url: http.getLayout,
					type: "GET",
					data: {
						limit: "all"
					}
				})
				.then(
					function(res) {
						_this.task.layout_options = res.data;
					},
					function(res) {
						console.log(res);
					}
				);
			//获取组织列表
			_this
				.LonbonAjax({
					url: http.groupList,
					type: "GET",
					data: {
						userId: localStorage.getItem("userId")
					}
				})
				.then(
					function(res) {
						var data = res.data;
						var tmpObj = {
							displayGroup: _this.$t("message.taskManage.nogroup"),
							child: []
						};
						var last = data.pop();
						if (last.noGroup.length > 0) {
							tmpObj.child = last.noGroup;
							data.push(tmpObj);
						}
						_this.treeData = data;
						_this.treeDataTmp = data;
					},
					function(res) {
						console.log(res);
					}
				);
			_this.get_task();
		},
		methods: {
			save_task(ajax_type, ajax_url, data) {
				var _this = this;
				_this.LonbonAjax({
						url: ajax_url,
						type: ajax_type,
						data: data
					})
					.then(
						function(res) {
							var campaignId = '';
							console.log(res);
							if (res.data) {
								campaignId = res.data.campaignId;
							}
							var text = _this.$t("message.taskManage.add_task_success");
							if (_this.task_edit_id) {
								text = _this.$t("message.taskManage.edit_task_success");
							}
							_this.$message({
								message: text,
								type: "success"
							});
							_this.cancel_layout_dialog();
							_this.get_task();
							//如果有campaignId
							if (campaignId) {
								_this
									.LonbonAjax({
										url: http.NotifyDisplays,
										type: "POST",
										data: {
											campaignId: campaignId
										}
									})
									.then(
										function() {
											_this.$message({
												message: _this.$t(
													"message.layoutManage.design.updata_display_success"
												),
												type: "success"
											});
										},
										function(res) {
											_this.$message.error(res.message);
										}
									);
							} else {
								_this.$message({
									message: _this.$t(
										"message.taskManage.wait_audit"
									),
									type: "warning"
								});
							}
						},
						function(res) {
							_this.$message({
								message: res.message,
								type: "warning"
							});
						}
					);
			},
			task_start_cahnge() {
				if (this.task.play_type == 'Month') {
					this.task.play_cycle_start = '';
					this.task.play_cycle_end = '';
				}
				var days = this.task.startTime;
				var date = new Date(days);
				var curMonth = date.getMonth() + 1;
				date.setMonth(curMonth);
				date.setDate(0);
				var daynum = date.getDate();
				this.month = new Array(daynum);
			},
			previewlayout(id) {
				window.open('./static/preview/preview.html?layoutid=' + id);
			},
			indexMethod(index) {
				return (this.page - 1) * (this.limit) + 1 + index;
			},
			//检测是否可以勾选
			chekUserId(row, index) {
				if (row.isEditPermission == 0) {
					return false;
				} else {
					return true;
				}
			},
			//时间戳转时间(h-m)
			timestampToHour(timestamp) {
				var date = new Date(timestamp * 1000);
				var h = date.getHours();
				var m = date.getMinutes();
				h = h >= 10 ? h : "0" + h;
				m = m >= 10 ? m : "0" + m;
				return h + ":" + m;
			},
			//获取本月多少天
			get_months_days: function(time) {
				var curDate = new Date();
				var curMonth = curDate.getMonth() + 1;
				curDate.setMonth(curMonth);
				curDate.setDate(0);
				return curDate.getDate();
			},
			//获取今天n天之后/前的时间
			get_other_today_times: function(day) {
				var _this = this;
				var now_timestamp = Date.parse(_this.getNowFormatDate(day));
				var other_timestamp = now_timestamp + day * 24 * 3600 * 1000;
				return _this.timestamp_date(other_timestamp);
			},
			//将时间戳转为时间(y-m-d)
			timestamp_date: function(timeStamp) {
				var date = new Date(timeStamp);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				var d = date.getDate();
				d = d < 10 ? "0" + d : d;
				return y + "-" + m + "-" + d;
			},
			//获取今天的日期
			getNowFormatDate: function(day) {
				var day = day || 0;
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate =
					year + seperator1 + month + seperator1 + strDate + " 00:00:00";
				return currentdate;
			},
			//获取今天是周几
			get_week_day: function(time) {
				var now = new Date();
				if (time) {
					now = new Date(time * 1000);
				}
				return now.getDay();
			},
			//循环类型改变
			changCycle: function() {
				this.task.cycle_start_time = "00:00:00"; //循环开始时间
				this.task.cycle_end_time = "23:30:00"; //循环结束时间
				this.task.play_cycle_start = "";
				this.task.play_cycle_end = "";
				this.$refs['ruleForm'].clearValidate(['play_cycle_start', 'play_cycle_end']);
			},
			//关闭删除弹框
			close_dele_dialog: function() {
				this.delete_dialog_show = false;
			},
			//显示删除弹框
			show_dele_dialog: function(item) {
				var _this = this;
				if (item) {
					this.$refs.deleteConfirm.opendelete(item.scheduleName, item.eventId);
					this.delete_dialog_show = true;
				} else {
					if (_this.dele_ids.length > 0) {
						this.$refs.deleteConfirm.opendelete();
						this.delete_dialog_show = true;
					} else {
						this.$message({
							message: _this.$t("message.layoutManage.deletSelect"),
							type: "warning"
						});
					}
				}
			},

			handleSizeChange: function(limit) {
				this.limit = limit;
				this.get_task();
			},
			handleCurrentChange: function(page) {
				this.emptyData = '';
				this.layout_table_data = [];
				this.page = page;
				this.get_task();
			},
			selsChange: function(items) {
				var tmp_arr = [];
				items.forEach((item, index) => {
					var id = item.eventId;
					tmp_arr.push(id);
				});
				this.dele_ids = tmp_arr;
			},
			//输入
			input_change(type) {
				var error = "task_" + type + "_error";
				if (type == "layout") {
					this.$refs['ruleForm'].clearValidate(['layout']);
				}
				if (type == 'cycle_end') {
					this.$refs['ruleForm'].clearValidate(['play_cycle_end']);
				}
				if (type == 'cycle_start') {
					this.$refs['ruleForm'].clearValidate(['play_cycle_start']);
				}
				this.error_tips[error] = "";
			},
			//添加任务
			add_task: function(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var _this = this;
						var cycle_type = _this.task.play_type;
						var startTime = ""; //循环开始时间
						var endTime = ""; //循环结束时间
						var play_cycle_start = _this.task.play_cycle_start;
						var play_cycle_end = _this.task.play_cycle_end;
						var cycle_start_time = _this.task.cycle_start_time;
						var cycle_end_time = _this.task.cycle_end_time;
						var start_date = "";
						var end_date = "";
						var displayGroupId = [];
						var maxTime = 0;
						var ajax_type = "";
						var ajax_url = http.scheduleEvent;
						if (_this.task_edit_id) {
							ajax_type = "PUT";
							ajax_url = ajax_url + "/" + _this.task_edit_id;
						} else {
							ajax_type = "POST";
						}
						switch (cycle_type) {
							case "Month":
								if (!play_cycle_start) {
									_this.error_tips.task_cycle_start_error = _this.$t(
										"message.taskManage.select_month_day"
									);
									return false;
								}
								if (!play_cycle_end) {
									_this.error_tips.task_cycle_end_error = _this.$t(
										"message.taskManage.select_month_day"
									);
									return false;
								}
								var now = new Date(_this.task.startTime);
								var now_year = now.getFullYear();
								var now_month = now.getMonth() + 1;
								var now_day = now.getDate();
								//开始循环在下月
								// 								if (play_cycle_start < now_day) {
								// 									now_month += 1;
								// 								}
								start_date = now_year + "-" + now_month + "-" + play_cycle_start + " " + cycle_start_time;
								end_date = now_year + "-" + now_month + "-" + play_cycle_end + " " + cycle_end_time;
								break;
							case "Week":
								var now_week = _this.get_week_day(_this.task.startTime / 1000); //任务开始时间是周几
								var start_disparity = "";
								var end_disparity = "";
								//开始循环时间在本周
								// 								if (play_cycle_start >= now_week) {
								play_cycle_start = play_cycle_start > 0 ? play_cycle_start : play_cycle_start + 7; //周日是每周最后一天
								play_cycle_end = play_cycle_end > 0 ? play_cycle_end : play_cycle_end + 7; //周日是每周最后一天
								start_disparity = play_cycle_start - now_week;
								end_disparity = play_cycle_end - now_week;
								// 								} else {
								// 									start_disparity = play_cycle_start - now_week + 7;
								// 									end_disparity = play_cycle_end - play_cycle_start + start_disparity;
								// 								}
								start_date = _this.timestamp_date(_this.task.startTime + start_disparity * 24 * 60 * 60 * 1000) + " " +
									cycle_start_time;
								end_date = _this.timestamp_date(_this.task.startTime + end_disparity * 24 * 60 * 60 * 1000) + " " +
									cycle_end_time;
								break;
							case "Day":
								start_date = _this.timestamp_date(_this.task.startTime) + " " + _this.task.cycle_start_time;
								end_date = _this.timestamp_date(_this.task.startTime) + " " + _this.task.cycle_end_time;
								break;
						}

						this.task.checkedGroup.forEach((item, index) => {
							var id = item.groupId;
							if (item.isDisplaySpecific != 0) {
								if (id) {
									displayGroupId.push(id);
								}
							}
						});
						displayGroupId = displayGroupId.join(",");
						if (cycle_type != "once") {
							startTime = Date.parse(start_date.replace(/-/g, '/')) / 1000;
							startTime = parseInt(startTime);
							endTime = Date.parse(end_date.replace(/-/g, '/')) / 1000;
							endTime = parseInt(endTime);
						} else {
							startTime = this.task.play_cycle_start / 1000;
							endTime = this.task.play_cycle_end / 1000;
							cycle_type = "";
						}
						var scheduleStart = parseInt(_this.task.startTime / 1000);
						var recRange = parseInt(_this.task.endTime / 1000);
						var data = {
							layoutId: _this.task.layout,
							scheduleName: _this.task.name,
							displayGroupId: displayGroupId,
							startTime: startTime,
							endTime: endTime,
							recType: cycle_type,
							scheduleStart: scheduleStart, //本次任务开始时间,
							recRange: recRange //本次任务结束时间
						};
						console.log('第一次循环开始时间' + start_date)
						console.log('第一次循环结束时间' + end_date)
						console.log(data)
						//单次循环判断循环时间是否在任务时间内
						if (!cycle_type) {
							if (scheduleStart > startTime) {
								_this.$message({
									message: _this.$t('message.taskManage.task_cycle_starttime_error'),
									type: "warning"
								});
								return false;
							}
							if (recRange < endTime) {
								_this.$message({
									message: _this.$t('message.taskManage.task_cycle_endtime_error'),
									type: "warning"
								});
								return false;
							}
						}
						//_this.task.layout
						_this.task.layout_options.forEach((item, index) => {
							if (item.id == _this.task.layout) {
								var timeLengthArr = item.timeLength;
								console.log(timeLengthArr)
								var tmp = [];
								//将时长转为秒
								if (timeLengthArr.length > 0) {
									timeLengthArr.forEach((item, index) => {
										var tmpLength = item.split(':');
										var timeSecond = parseInt(tmpLength[0] * 3600) + parseInt(tmpLength[1] * 60) + parseInt(tmpLength[2]);
										tmp.push(timeSecond);
									})
								}
								maxTime = Math.max.apply(null, tmp);
							}
						})
						if (maxTime > 0 && (endTime - startTime) < maxTime * 1000) {
							var hour = Math.floor(maxTime / 3600);
							var minute = Math.floor(Math.floor(maxTime % 3600) / 60);
							var second = maxTime % 60;
							var timelength = hour + ":" + minute + ":" + second;
							var text = _this.$t('message.taskManage.video_task') + timelength + _this.$t('message.taskManage.sure_save') +
								'?';
							_this.$confirm(text, ' ', {
								title: ' ',
								type: 'warning',
								closeOnClickModal: false
							}).then(() => {
								_this.save_task(ajax_type, ajax_url, data);
							}).catch(() => {
								// this.$message({
								//   type: 'info',
								//   message: this.$t('message.releaseManage.deleted_deleted')
								// });
							});
						} else {
							_this.save_task(ajax_type, ajax_url, data);
						}
						return false;

					}

				})
			},
			//关闭任务弹框
			cancel_layout_dialog: function() {
				//取消已勾选的设备
				this.$refs.taskTree.setCheckedKeys([]);
				//隐藏弹框
				this.add_task_dialog = false;
				if (this.task.play_type == 'Day') {
					this.task.play_type = 'Week';
					this.$refs['ruleForm'].clearValidate(['name', 'layout', 'startTime', 'endTime']);
					this.task.name = '';
					this.task.layout = '';
					this.task.startTime = '';
					this.task.endTime = '';
				} else {
					this.$refs['ruleForm'].resetFields();
				}

			},
			//获取任务列表
			get_task: function() {
				var _this = this;
				_this
					.LonbonAjax({
						url: http.scheduleEvent,
						type: "GET",
						data: {
							limit: _this.limit,
							page: _this.page
						}
					})
					.then(
						function(res) {
							console.log(res)
							var data = res.data;
							_this.total = data.total;
							_this.currentPage = data.current_page;
							_this.layout_table_data = data.data;
							_this.loading = false;
						},
						function(res) {
							if (res.errorCode == 400) {
								if (_this.page > 1) {
									_this.page = _this.page - 1;
									_this.get_task();
								} else {
									_this.loading = false;
									_this.total = 0;
									_this.currentPage = 1;
									_this.emptyData = _this.$t("message.releaseManage.empty_data");
									_this.layout_table_data = [];
								}
							} else {
								_this.emptyData = _this.$t("message.releaseManage.empty_data");
								_this.layout_table_data = [];
								_this.loading = false;
								_this.total = 0;
								_this.currentPage = 1;
							}
						}
					);
			},
			//删除任务
			delete_task(id) {
				var _this = this;
				var ids = "";
				if (id) {
					ids = id;
				} else {
					ids = _this.dele_ids.join(",");
				}
				console.log(ids);
				_this
					.LonbonAjax({
						url: http.scheduleEvent + "/delete",
						type: "DELETE",
						data: {
							ids: ids
						}
					})
					.then(
						function(res) {
							_this.$message({
								message: _this.$t("message.taskManage.delete_task_success"),
								type: "success"
							});
							_this.get_task();
						},
						function(res) {
							_this.$message({
								message: _this.$t("message.taskManage.delete_task_error"),
								type: "warning"
							});
						}
					);
			},
			//选择树形图之后
			taskHandleCheckChange(data, checked, indeterminate) {
				this.task.checkedGroup = this.$refs["taskTree"].getCheckedNodes();
				// var
				// this.$refs["taskTree"].store.defaultExpandAll = true
				// console.log()
				// [data.$treeNodeId]
				// .expanded = true
				// console.log(this.$refs["taskTree"].store.nodesMap[4].expanded=true);
				// data.unfold = true;
				// this.$refs["taskTree"].store._getAllNodes()[1].expanded=this.isexpand = true ;
			},
			//编辑任务
			task_edit(row) {
				var _this = this;

				_this.campaignId = row.campaignId;
				_this.task_edit_id = row.eventId;
				_this.add_task_dialog = true;
				_this.editName = row.userName;
				if (row.isEditPermission == 1) {
					_this.isEditPermission = false;
				} else {
					_this.isEditPermission = true;
				}
				_this
					.LonbonAjax({
						url: http.scheduleEvent + "/" + _this.task_edit_id,
						type: "GET"
					})
					.then(
						function(res) {
							console.log(res)
							_this.task_title = _this.$t("message.taskManage.task_title_edit");
							_this.read_task = res.data;
							_this.task.name = _this.read_task.scheduleName;
							_this.task.layout = _this.read_task.layputId;
							_this.task.type = "";
							_this.task.startTime = _this.read_task.scheduleStart * 1000;
							_this.task.endTime = _this.read_task.recurrenceRange * 1000;
							_this.task.cycle_start_time = ""; //循环开始时间
							_this.task.cycle_end_time = ""; //循环结束时间
							_this.task.play_cycle_start = "";
							_this.task.play_cycle_end = "";
							_this.task.play_type = _this.read_task.recurrenceType || "once";
							var scheduleStart = _this.read_task.fromDt;
							var recurrenceRange = _this.read_task.toDt;
							switch (_this.task.play_type) {
								case "Week":
									_this.task.play_cycle_start = "" + _this.get_week_day(scheduleStart);
									_this.task.play_cycle_end = "" + _this.get_week_day(recurrenceRange);
									_this.task.cycle_start_time = _this.timestampToHour(scheduleStart);
									_this.task.cycle_end_time = _this.timestampToHour(recurrenceRange);
									break;
								case "Month":
									_this.task.play_cycle_start = new Date(scheduleStart * 1000).getDate();
									_this.task.play_cycle_end = new Date(recurrenceRange * 1000).getDate();
									_this.task.cycle_start_time = _this.timestampToHour(scheduleStart);
									_this.task.cycle_end_time = _this.timestampToHour(recurrenceRange);
									break;
								case "Day":
									_this.task.cycle_start_time = _this.timestampToHour(scheduleStart);
									_this.task.cycle_end_time = _this.timestampToHour(recurrenceRange);
									break;
								case "once":
									_this.task.play_cycle_start = scheduleStart * 1000;
									_this.task.play_cycle_end = recurrenceRange * 1000;
									break;
							}
							var displayGroupIds = _this.read_task.displayGroupIds;
							if (displayGroupIds) {
								displayGroupIds = displayGroupIds.split(",");
							}
							_this.treeData = [];
							_this.treeData = _this.treeDataTmp;
							_this.default_checked_keys = displayGroupIds;
							_this.default_expanded_keys = displayGroupIds;
						},
						function(res) {
							console.log(res);
						}
					);
			}
		}
	};
</script>

<style scoped>
	.previewBtn {
		text-decoration: none;
		margin: 0 10px;
		color: #18abbb;
		text-decoration: none;
	}

	img {
		cursor: pointer;
	}

	.layout-manage {
		margin: 0;
		padding: 0;
		height: 97%;
		border-radius: 8px;
		background: white;
		border: 1px solid white;
	}

	.layout-manage-header {
		text-align: right;
		background: white;
		padding-top: 1%;
		padding-bottom: 1%;
		padding-right: 20px;
	}

	.layout-manage-header button:not(:last-child) {
		margin-right: 30px;
	}

	.table-box {
		background: white;
		height: 94%;
	}

	.toolbar {
		padding: 0 10px;
		text-align: right;
		margin-top: 1%;
		height: 8%;
	}

	.pag-tips {
		float: left;
		color: #9f9f9f;
	}

	.layout-body {
		margin: 0;
		padding: 0;
		height: 480px;
	}

	.layout-body input {
		outline: none;
		padding-left: 10px;
		border-radius: 8px;
		border: 1px solid #c9c9c9;
		height: 40px;
	}

	.item-error {
		height: 20px;
		line-height: 20px;
		color: red;
		padding-left: 26%;
		font-size: 14px;
	}

	.layout-body .group-list-box {
		height: 100%;
		border: 1px solid #c9c9c9;
		border-radius: 8px;
		float: left;
		width: 31%;
		overflow-y: scroll;
	}

	.layout-body .task-info-box {
		float: right;
		height: 100%;
		width: 65%;
		border: 1px solid #c9c9c9;
		border-radius: 8px;
		padding-top: 2em;
	}

	.layout-body .item-box:first-child {
		margin-top: 20px;
	}

	.layout-body .item-box label {
		display: inline-block;
		width: 25%;
		text-align: right;
	}

	.layout-body .item-box input {
		width: 54%;
		height: 31px;
	}

	.layout-body .item-box .el-input,
	.layout-body .item-box .el-select,
	.layout-body .item-box .el-box-input {
		display: inline-block;
		width: 80%;
	}

	.middle-box .el-select,
	.middle-box .el-box-input {
		display: inline-block;
		width: 50% !important;
	}

	.layout-body .item-box .el-box-input input,
	.layout-body .item-box .el-box-input .el-input__inner,
	.layout-body .item-box .el-box-input .el-date-editor {
		width: 100% !important;
	}

	.layout-body .time-box input {
		width: 80%;
	}

	.layout-body .day-time .el-date-editor {
		width: 80%;
	}

	/*.layout-body .time-box img{*/
	/*position: relative;*/
	/*top: 5px;*/
	/*}*/
	/*//组织列表*/

	.group-list-box {
		padding-left: 20px;
	}

	.group-list-box p {
		font-size: 1.2rem;
		font-weight: bold;
	}

	.cycle-box {
		padding: 0 15%;
	}

	.cycle-box label {
		margin: 20px 0 0 0;
	}

	td .el-button--small {
		border: none;
		color: #18abbb;
		font-size: 1em;
		background: none;
		padding-left: 0px;
		padding-top: 0px;
		padding-bottom: 0px;
	}

	.layout-body .day-time .el-input__inner {
		width: 100%;
		padding-left: 0;
	}

	.tableBtn {
		padding: 0;
		color: #18ABBB;
		font-size: 1em;
	}

	.el-tree-node__label {
		display: inline-block !important;
		overflow: hidden !important;
		white-space: nowrap !important;
		text-overflow: ellipsis !important;
		width: 100% !important;
	}
</style>

<style lang="css">
	.my-date-pick .el-input__inner {
		width: 100%;
		padding: 0 !important;
	}

	.item-box input {
		height: 31px !important;
		padding-top: 0;
	}

	.time-box .el-date-editor {
		width: 100% !important;
	}

	.time-box .el-date-editor .el-input__inner {
		padding-left: 0;
	}

	.time-box .el-input__inner {
		width: 100% !important;
	}

	.time-box .el-select {
		width: 40% !important;
		display: inline-block;
	}

	.layout-body .day-time .el-input__inner {
		width: 100%;
		padding-left: 0;
	}

	.el-select-dropdown {
		width: 200px;
	}

	.task-form .el-form-item__error {
		width: 80%;
	}

	.tableBtn {
		padding: 0;
		color: #18ABBB;
		font-size: 1em;
	}
</style>
