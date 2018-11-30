<template>
	<div class="layout-manage">
		<div class="page-title">{{$t('message.menu.release')}}</div>
		<div class="layout-manage-header bx">
			<button class="el-button mybtn-primary el-button--primary" @click="add_layout_dialog = true , edit_obj={} ">{{$t('message.layoutManage.add_layout')}}</button>
			<button class="el-button mybtn-primary el-button--primary" @click="save_default">{{$t('message.layoutManage.save_default')}}</button>
			<button class="el-button mybtn-primary el-button--primary" @click="show_dele_dialog('')">{{$t('message.releaseManage.delete')}}</button>
		</div>
		<el-table v-loading="loading" :data="layout_table_data" class="my-table" @selection-change="selsChange"
		 highlight-current-row height="calc(100% - 90px - 2em)" style="width: 100%;">
			<el-table-column type="selection" width='50'></el-table-column>
			<el-table-column type="index" :index="indexMethod" :label="$t('message.deviceGroup.No')" width='120'></el-table-column>
			<el-table-column prop="layout" :label="$t('message.releaseManage.name')" style="width: 30%;" show-overflow-tooltip>
				<template slot-scope="scope">
					{{formartName(scope.row)}}
				</template>
			</el-table-column>
			<el-table-column prop="username" :label="$t('message.releaseManage.author')" style="width: 10%;"></el-table-column>
			<el-table-column prop="duration" :label="$t('message.releaseManage.state')" style="width: 10%;padding: 0">
				<template slot-scope='scope'>
					<span>
						{{$t("message.taskManage.through_audit")}}
					</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('message.releaseManage.operation')" style="width: 10%;">
				<template slot-scope="scope">
					<!-- 编辑 -->
					<el-button v-if="scope.row.isEditPermission==1" class="tableBtn single-del" @click="jump_design(scope.row.id)"
					 type="text" size="medium">
						{{$t('message.releaseManage.edit')}}
					</el-button>
					<el-tooltip v-else class="item" effect="dark" :content="$t('message.taskManage.tooltip1')+scope.row.username+$t('message.taskManage.tooltipJump')"
					 placement="top">
						<el-button class="tableBtn single-del" @click="previewlayout(scope.row.id)" type="text" size="medium">
							{{$t('message.releaseManage.preview')}}
						</el-button>
					</el-tooltip>
					<!-- 预览 -->
					<el-button class="tableBtn single-del" @click="previewlayout(scope.row.id)" type="text" size="medium">
						{{$t('message.releaseManage.preview')}}
					</el-button>
					<!-- 删除 -->
					<el-button v-if="scope.row.isEditPermission==1" class="single-del tableBtn" @click="show_dele_dialog(scope.row)"
					 type="text" size="medium">{{$t('message.releaseManage.delete')}}</el-button>
					<el-tooltip v-else class="item" effect="dark" :content="$t('message.taskManage.tooltip1')+scope.row.username+$t('message.taskManage.tooltip2')"
					 placement="top">
						<el-button type="text" size="medium"  style="color:#ccc;font-size: 1em;">{{$t('message.releaseManage.delete')}}</el-button>
					</el-tooltip>
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
		<!--添加布局弹框-->
		<add-layout :add_layout_dialog="add_layout_dialog" :edit_obj="edit_obj" v-on:close_dialog="close_dialog"
		 v-on:modal_success="modal_success"></add-layout>
		<!--刪除組件-->
		<delete-dialog ref="deleteConfirm" :delete_dialog_show="delete_dialog_show" :func="dele_layout"
		 v-on:close_dele_dialog="close_dele_dialog"></delete-dialog>
	</div>
</template>

<script>
	import {
		http
	} from "../../api/config";
	import addLayout from "./layout/addLayout";
	import DeleteDialog from "./delete/deleteDialog";
	export default {
		name: "layoutManage",
		components: {
			addLayout,
			DeleteDialog
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit("pageName", to.name);
				vm.$emit("materialName", "1");
			});
		},
		data: function() {
			return {
				emptyData: this.$t("message.releaseManage.empty_data"),
				total: 0,
				page: 1,
				currentPage: 1,
				limit: 20,
				layout_table_data: [],
				loading: true,
				add_layout_dialog: false,
				delet_arr: [], //要删除的布局id
				delete_dialog_show: false,
				edit_obj: {}
			};
		},
		computed: {
			formartName() {
				var _this = this;
				return function(item) {
					if (item.isDefault == 1) {
						var text =
							item.layout +
							"(" +
							_this.$t("message.layoutManage.default_layout") +
							")";
						return text;
					} else {
						return item.layout;
					}
				};
			},

		},
		filters: {
			formatProportion(row) {
				let width = row.layout_width;
				let height = row.layout_height;
				return parseInt(width / height);
			}
		},
		mounted: function() {
			var _this = this;
			//获取所有的布局
			_this.get_layout();
		},
		methods: {
			previewlayout(id) {
				window.open('./static/preview/preview.html?layoutid=' + id);
			},
			indexMethod(index) {
				return (this.page - 1) * (this.limit) + 1 + index;
			},
			//编辑布局
			edit_layout: function(row) {
				var _this = this;
				_this.add_layout_dialog = true;
				_this.edit_obj = row;
				console.log(row);
			},
			//刪除佈局
			dele_layout: function(id) {
				var _this = this;
				var ids = _this.delet_arr.join(",");
				if (id) {
					ids = id;
				}
				_this
					.LonbonAjax({
						url: http.getLayout + "/0",
						type: "DELETE",
						data: {
							layoutIds: ids
						}
					})
					.then(
						function(res) {
							_this.$message.success(
								_this.$t("message.layoutManage.layout_delete_success")
							);
							_this.delete_dialog_show = false;
							_this.get_layout();
						},
						function(res) {
							_this.$message.warning(res.message);
							// _this.$message.warning(_this.$t('message.layoutManage.layout_delete_error'));
						}
					);
			},
			//隱藏刪除彈框
			close_dele_dialog: function() {
				this.delete_dialog_show = false;
			},
			//显示删除弹框
			show_dele_dialog: function(item) {
				var _this = this;
				if (item) {
					this.edit_obj = item;
					this.$refs.deleteConfirm.opendelete(item.layout, item.id);
					this.delete_dialog_show = true;
				} else {
					if (_this.delet_arr.length > 0) {
						this.$refs.deleteConfirm.opendelete();
						this.delete_dialog_show = true;
						this.edit_obj = {};
					} else {
						this.$message({
							message: _this.$t("message.layoutManage.deletSelect"),
							type: "warning"
						});
					}
				}
			},
			//佈局增加成功
			modal_success: function(id) {
				var _this = this;
				_this.add_layout_dialog = false;
				if (id) {
					_this.jump_design(id);
				} else {
					_this.get_layout();
				}
			},
			//隱藏增加彈框
			close_dialog: function() {
				this.add_layout_dialog = false;
			},
			//全选
			selsChange: function(items) {
				var _this = this;
				var tmp_arr = [];
				items.forEach((item, index) => {
					var id = item.id;
					tmp_arr.push(id);
				});
				_this.delet_arr = tmp_arr;
			},
			handleSizeChange: function(limit) {
				this.limit = limit;
				this.get_layout();
			},
			handleCurrentChange: function(page) {
				this.emptyData = '';
				this.layout_table_data = [];
				this.page = page;
				this.get_layout();
			},
			jump_design: function(id) {
				this.$router.push(`/release/design/${id}`);
			},
			//获取布局列表
			get_layout: function() {
				var _this = this;
				_this
					.LonbonAjax({
						url: http.getLayout,
						type: "Get",
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
									_this.get_layout();
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
			//保存为默认布局
			save_default() {
				var _this = this;
				if (_this.delet_arr.length == 1) {
					var id = this.delet_arr.join(",");
					var text = this.$t("message.layoutManage.save_default") + "?";
					_this
						.$confirm(text, this.$t("message.releaseManage.tip"), {
							title: "",
							type: "warning",
							closeOnClickModal: false
						})
						.then(() => {
							_this
								.LonbonAjax({
									url: http.layoutDefault + "/" + id,
									type: "POST",
									data: {
										isDefault: 1
									}
								})
								.then(function() {
									_this.$message({
										type: "success",
										message: _this.$t("message.layoutManage.save_default_success")
									});
									_this.get_layout();
								}, function(res) {
									_this.$message({
										type: "warning",
										message: res.message
									});
								});
						})
						.catch(() => {
							_this.$message({
								type: "info",
								message: _this.$t("message.layoutManage.cancel_save_default")
							});
						});
				} else {
					this.$message({
						message: this.$t("message.layoutManage.only_one"),
						type: "warning"
					});
				}
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

	.layout-manage {
		margin: 0;
		padding: 0;
		height: 97%;
		border: 1px solid white;
		border-radius: 8px;
		background: white;
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
		height: 8%;
		margin-top: 1%;
	}

	.pag-tips {
		float: left;
		color: #9f9f9f;
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
