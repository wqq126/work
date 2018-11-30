<template>
	<div class="examine-manage bx">
		<div style="min-width:100px" class="page-title">{{$t('message.examineManage.examineManage')}}</div>
		<div class="examine-manage-main">
			<div class="examine-manage-main-header">
				<el-row :gutter="24">
					<el-col :span="12" style="padding-left: 0">
						<el-input @keydown.enter.native="search" class='examine-name-input' :placeholder="$t('message.examineManage.input_name')"
						 prefix-icon="el-icon-search" v-model="examine_name">
						</el-input>
						<button @click="search" class="el-button mybtn-primary el-button--primary">{{$t('message.examineManage.search')}}</button>
					</el-col>
				</el-row>
			</div>
			<el-table v-loading="loading" :data="tableData" class="my-table" @selection-change="selsChange"
			 highlight-current-row height="calc(100% - 90px - 2em)" style="width: 100%;">
				<el-table-column type="index" :index="indexMethod" :label="$t('message.deviceGroup.No')" width='120'></el-table-column>
				<el-table-column prop="scheduleName" :label="$t('message.releaseManage.name')" show-overflow-tooltip style="width: 30%;"></el-table-column>
				<el-table-column :label="$t('message.releaseManage.state')" style="width: 10%;">
					<template slot-scope='scope'>
						<span v-if="scope.row.status=='待审核'">
							{{$t("message.taskManage.wait_audit")}}
						</span>
						<span v-else="scope.row.status=='审核未通过'" style="color: #ff0c0c;">
							{{$t("message.taskManage.failure_audit")}}
						</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.examineManage.create_time')" style="width: 10%;">
					<template slot-scope='scope'>
						{{scope.row.createTime | timestampToTime}}
					</template>
				</el-table-column>
				<el-table-column prop="username" :label="$t('message.releaseManage.author')" style="width: 10%;">
				</el-table-column>
				<el-table-column :label="$t('message.releaseManage.operation')" style="width: 10%;">
					<template slot-scope="scope">
						<!-- 预览 -->
						<el-button class='tableBtn' @click="previewlayout(scope.row.layoutId)" type="text" size="medium">
								{{$t('message.releaseManage.preview')}}
						</el-button>
						<!-- 通过 -->
						<el-button class='tableBtn' @click="adopt(scope.row)" type="text" size="medium">{{$t('message.examineManage.adopt')}}</el-button>
						<!-- 驳回 -->
						<el-button class='tableBtn' @click="reject_fun(scope.row.id)" type="text" size="medium">{{$t('message.examineManage.reject')}}</el-button>
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
		</div>
		<!--驳回弹框-->
		<el-dialog :show-close='false' :close-on-click-modal='false' :title="title" :visible.sync="reject.reject_modal" top="300px"
		 width="717px" center>
			<div class="layout-body reject_modal">
				<label for=""><img src="../../../static/images/importent.png" alt=""><span>{{$t('message.examineManage.reason')}}</span>&nbsp;:</label>
				<textarea v-model.trim="reject.reject_reason" @propertychange="reason_error=''" @input="reason_error=''" name="" id=""
				 cols="30" rows="10"></textarea>
				<div class="error">{{reason_error}}</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button class='el-button mybtn-primary el-button--primary' @click="save_reject" type="primary">{{$t('message.releaseManage.okBtn')}}</el-button>
				<el-button class='el-button mybtn-primary el-button--primary' @click="reject.reject_modal=false">{{$t('message.cancelChange')}}</el-button>
			</span>
		</el-dialog>
		<!--刪除組件-->
		<delete-dialog ref="deleteConfirm" :delete_dialog_show="delete_dialog_show" :func="delete_aduit"
		 v-on:close_dele_dialog="close_dele_dialog"></delete-dialog>
	</div>
</template>

<script>
	import {
		http
	} from "../../api/config";
	import CryptoJS from "crypto-js/crypto-js";
	import DeleteDialog from "../release/delete/deleteDialog";
	export default {
		name: "examineMange",
		components: {
			DeleteDialog
		},
		data() {
			return {
				emptyData: this.$t("message.releaseManage.empty_data"),
				campaignId: "",
				reason_error: "",
				delete_dialog_show: false,
				status: "",
				title: "",
				dele_ids: "",
				admit_id: "",
				reject: {
					reject_modal: false,
					reject_reason: ""
				},
				total: 0,
				page: 1,
				currentPage: 1,
				limit: 20,
				navActiveStutas: 0,
				examine_name: "",
				options: [{
					value: "选项1",
					label: "黄金糕"
				}, ],
				value: "",
				tableData: [],
				loading: true
			};
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit("pageName", to.name);
			});
		},
		filters: {
			timestampToTime(timestamp) {
				var date = new Date(timestamp * 1000);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				var d = date.getDate();
				d = d < 10 ? "0" + d : d;
				var h = date.getHours();
				h = h < 10 ? "0" + h : h;
				var minute = date.getMinutes();
				var second = date.getSeconds();
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
			}
		},
		mounted: function() {
			var _this = this;
			_this.get_aduit();
		},
		methods: {
			previewlayout(id){
				window.open('./static/preview/preview.html?layoutid='+id);
			},
			indexMethod(index) {
				return (this.page - 1) * (this.limit) + 1 + index;
			},
			delete_btn() {
				var _this = this;
				if (_this.dele_ids.length > 0) {
					this.$refs.deleteConfirm.opendelete();
					this.delete_dialog_show = true;
				} else {
					this.$message({
						message: _this.$t("message.examineManage.deletSelect"),
						type: "warning"
					});
				}
			},
			delete_aduit(id) {
				var _this = this;
				var ids = _this.dele_ids.join(",");
				_this
					.LonbonAjax({
						url: http.auditdelete,
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
							_this.get_aduit();
						},
						function(res) {
							console.log(res);
						}
					);
			},
			close_dele_dialog() {
				this.delete_dialog_show = false;
			},
			search() {
				this.get_aduit(this.examine_name);
			},

			//时间戳转时间
			timestampToTime(timestamp) {
				var date = new Date(timestamp);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				var d = date.getDate();
				d = d < 10 ? "0" + d : d;
				var h = date.getHours();
				h = h < 10 ? "0" + h : h;
				var minute = date.getMinutes();
				var second = date.getSeconds();
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
			},
			//获取审核列表
			get_aduit(name) {
				var name = name || "";
				var _this = this;
				_this
					.LonbonAjax({
						url: http.audit,
						type: "GET",
						data: {
							limit: _this.limit,
							page: _this.page,
							name: name
						}
					})
					.then(
						function(res) {
							var data = res.data;
							_this.total = res.data.total;
							_this.currentPage = res.data.current_page;
							_this.tableData = res.data.data;
							_this.loading = false;
						},
						function(res) {
							//当页没有数据
							if (res.errorCode == 400) {
								//请求上一页的，如果当前不是第一页
								if (_this.page > 1) {
									_this.page = _this.page - 1;
									_this.get_aduit();
								} else {
									//已是第一页
									_this.loading = false;
									_this.total = 0;
									_this.currentPage = 1;
									_this.emptyData = _this.$t("message.releaseManage.empty_data");
									_this.tableData = [];
								}
							} else {
								_this.emptyData = _this.$t("message.releaseManage.empty_data");
								_this.tableData = [];
								_this.loading = false;
								_this.total = 0;
								_this.currentPage = 1;
							}
						}
					);
			},
			selsChange: function(items) {
				var tmp_arr = [];
				items.forEach((item, index) => {
					var id = item.id;
					tmp_arr.push(id);
				});
				this.dele_ids = tmp_arr;
			},
			handleSizeChange: function(limit) {
				this.limit = limit;
				this.get_aduit();
			},
			handleCurrentChange: function(page) {
				this.emptyData = '';
				this.tableData = [];
				this.page = page;
				this.get_aduit();
			},
			//通过审核
			adopt: function(row) {
				var _this = this;
				var text = this.$t("message.examineManage.adopt_sure") + "?";
				_this.campaignId = row.campaignId;
				_this.init_reason(
					row.id,
					1,
					this.$t("message.examineManage.adopt_reason")
				);
				_this
					.$confirm(text, this.$t("message.releaseManage.tip"), {
						title: " ",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						_this
							.LonbonAjax({
								url: http.auditup,
								type: "POST",
								data: {
									id: _this.admit_id,
									status: _this.status,
									reason: _this.reject.reject_reason
								}
							})
							.then(
								function() {
									//更新列表
									_this.get_aduit();
									//审核通过后推送
									_this
										.LonbonAjax({
											url: http.NotifyDisplays,
											type: "POST",
											data: {
												campaignId: _this.campaignId
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
								},
								function(res) {
									_this.$message({
										message: res.message,
										type: "warning"
									});
								}
							);
					})
					.catch(() => {
						// this.$message({
						//   type: 'info',
						//   message: this.$t('message.releaseManage.deleted_deleted')
						// });
					});
			},
			//驳回
			reject_fun: function(id) {
				this.init_reason(id, 2, this.$t("message.examineManage.reject_reason"));
			},
			//初始化审核弹框
			init_reason(id, status, title) {
				this.admit_id = id;
				if (status == 2) {
					this.reject.reject_modal = true;
				}
				this.reject.reject_reason = "";
				this.status = status;
				this.title = title;
				this.reason_error = "";
				this.reject.reject_reason = "";
			},
			//保存审核
			save_reject() {
				var _this = this;
				if (!_this.reject.reject_reason) {
					_this.reason_error = _this.$t("message.examineManage.reason_error");
					return false;
				}
				_this
					.LonbonAjax({
						url: http.auditup,
						type: "POST",
						data: {
							id: _this.admit_id,
							status: _this.status,
							reason: _this.reject.reject_reason
						}
					})
					.then(
						function(res) {
							_this.reject.reject_modal = false;
							_this.get_aduit();
							_this.$message({
								message: _this.$t("message.examineManage.aduit_success"),
								type: "success"
							});
							_this.get_aduit();
						},
						function(res) {
							_this.$message({
								message: res.message,
								type: "warning"
							});
						}
					);
			}
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

	.previewBtn {
		color: #18abbb;
		text-decoration: none;
		margin-right: 10px;
	}

	input {
		padding-left: 50px !important;
	}

	.examine-manage {
		padding: 3.125em 1.87em 1.87em 1.87em;
		height: 100%;
	}

	.examine-manage-main {
		background: #ffffff;
		border-radius: 8px;
		height: 100%;
	}

	.examine-name-input {
		width: 217px;
	}

	.examine-manage-main-header {
		padding: 1.5625em 1.5625em 1% 1.5625em;
		text-align: left;
	}

	.examine-manage-main-header label {
		margin-left: 20px;
	}

	.examine-manage-main-header .btn-box {
		text-align: right;
	}

	.examine-manage-main-header .btn-box button:not(:last-child) {
		margin-right: 30px;
	}

	.table-box {
		height: 86%;
	}

	.table-box .el-checkbox__inner {
		left: 10px !important;
	}

	.toolbar {
		text-align: right;
		padding: 0 10px;
		margin-top: 1%;
	}

	.pag-tips {
		float: left;
		color: #9f9f9f;
	}

	.reject_modal {
		padding-left: 30px;
	}

	.reject_modal textarea {
		resize: none;
		height: 90px;
		width: 70%;
		border: 1px solid #c9c9c9;
		border-radius: 8px;
		padding: 5px;
		outline: none;
	}

	.reject_modal label {
		float: left;
		margin-right: 10px;
		display: inline-block;
		width: 15%;
	}

	.reject_modal .error {
		padding-left: 15%;
		text-indent: 10px;
		color: red;
		font-size: 14px;
		height: 14px;
	}

	.reject_modal img {
		margin-right: 10px;
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
	.tableBtn{
		padding: 0;
		color: #18ABBB;
		font-size: 1em;
	}
</style>
<style lang="css">
	.examine-manage-main-header .el-icon-search {
		line-height: 31px;
	}
	.tableBtn{
		padding: 0;
		color: #18ABBB;
		font-size: 1em;
	}
</style>
