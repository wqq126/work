<template>
	<el-dialog @open="init" :show-close='false' :close-on-click-modal='false' :title="title" :visible.sync="add_layout_dialog"
	 width="713px" center>
		<div class="layout-body layout-form">
			<el-form label-width="20%" :model='layoutForm' :rules="layoutRules" ref="ruleForm">
				<el-form-item :label="$t('message.releaseManage.name')" prop="layout_name" class="required">
					<el-input style='width: 80%;' v-model.trim='layoutForm.layout_name'></el-input>
				</el-form-item>
				<el-form-item class='clearableselect' v-if="template_disabled==false" :label="$t('message.releaseManage.template')" prop="template_value">
					<el-select v-model="layoutForm.template_value" clearable filterable class='small-input'>
						<el-option  v-for="item in all_template" :key="item.id" :label="item.layout" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('message.releaseManage.remark')" prop="layout_remark">
					<el-input style='width: 80%;' resize="none" type="textarea" v-model.trim="layoutForm.layout_remark"></el-input>
				</el-form-item>
				<div style="text-align: center;">
					<el-button class="el-button mybtn-primary el-button--primary" type="primary" @click="add_layout('ruleForm')">{{$t('message.releaseManage.okBtn')}}</el-button>
					<el-button class="el-button mybtn-primary el-button--primary" @click="close_dialog('ruleForm')">{{$t('message.cancelChange')}}</el-button>
				</div>
			</el-form>
		</div>
	</el-dialog>
</template>

<script>
	import {
		http
	} from "../../../api/config";

	export default {
		name: "add-layout",
		props: {
			add_layout_dialog: {
				type: Boolean,
				require: true
			},
			edit_obj: {
				type: Object,
				require: true
			}
		},
		mounted: function() {
			var _this = this;
			//获取所有的模板
			_this.LonbonAjax({
				url: http.getTemplate,
				type: 'GET',
				data: {
					limit: 'all'
				}
			}).then(function(res) {
				var data = res.data;
				// data.unshift({id:'none',layout:_this.$t('message.layoutManage.layout_template_delete')});
				_this.all_template = data;
			}, function(res) {
				console.log(res)
			})
		},
		data: function() {
			return {
				layoutForm: {
					layout_name: '',
					layout_remark: '',
					template_value: '', //选择模板那的值
				},
				layoutRules: {
					layout_name: {
						required: true,
						message: this.$t('message.layoutManage.layout_name'),
						trigger: 'blur'
					},
					template_value: {
						required: false,
						message: this.$t('message.releaseManage.select_template'),
						trigger: 'blur'
					},
					layout_remark:{
						required: false,
						trigger: 'blur'
					}
				},
				all_template: [], //所有的模板
				title: '',
				template_disabled: false,
				save_disabled: false
			}
		},
		methods: {
			inputChange(type) {
				var key = type + '_error';
				this[key] = '';
			},
			init: function() {
				var _this = this;
				var item = _this.edit_obj;
				_this.save_disabled = false;
				if (item.layout) {
					_this.layoutForm.template_value = parseInt(item.templateId);
					_this.layoutForm.layout_name = item.layout;
					_this.layoutForm.layout_remark = item.description;
					_this.title = _this.$t('message.layoutManage.edit_layout');
					_this.template_disabled = true;
				} else {
					console.log(item)
					_this.title = _this.$t('message.layoutManage.add_layout');
					_this.layoutForm.template_value = parseInt(item.templateId) || "";
					_this.template_disabled = false;

				}
			},
			//关闭弹框
			close_dialog: function(formName) {
				this.$refs[formName].resetFields();
				this.$emit('close_dialog', false);
			},
			//添加布局
			add_layout: function(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var _this = this;
						var item = _this.edit_obj;
						var data = {
							templateId: _this.layoutForm.template_value,
							layout: _this.layoutForm.layout_name,
							description: _this.layoutForm.layout_remark
						};
						var ajax_type = 'POST';
						var ajax_url = http.getLayout;
						if (item.layout) {
							ajax_type = "PUT";
							ajax_url = ajax_url + '/' + item.id;
						}
						_this.save_disabled = true;
						_this.LonbonAjax({
							url: ajax_url,
							type: ajax_type,
							data: data
						}).then(function(res) {
							console.log(res);
							var id = ''
							if (ajax_type == 'POST') {
								id = res.data.id;
							}
							_this.$emit('modal_success', id);
							if (ajax_type == 'PUT') {
								_this.$message.success(_this.$t('message.layoutManage.edit_layout_success'));
							}
						}, function(res) {
							_this.save_disabled = false;
							_this.$message.warning(res.message);
							console.log(res)
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				
				
				
			},
		}
	}
</script>

<style scoped>
	.layout-body {
		margin: 0;
		padding: 0;
	}

	.layout-body input {
		outline: none;
		padding-left: 10px;
		border-radius: 8px;
		border: 1px solid #C9C9C9;
		height: 31px;
	}

	.long-item {
		margin: 0;
		padding: 0;
	}

	.long-item input {
		width: 430px;
	}

	.long-item textarea {
		width: 430px;
		height: 100px;
		resize: none;
		padding-left: 10px;
		border-radius: 8px;
		border: 1px solid #C9C9C9;
		outline: none;
	}

	.long-label {
		display: inline-block;
		width: 150px;
		text-align: right;
	}

	.short-box {
		float: left;
		width: 49%;
		height: 60px;
	}

	.mini-input {
		width: 60px;
	}

	.textarea-box label {
		position: relative;
		top: -80px;
	}

	.error {
		margin: 0;
		height: 20px;
		color: red;
		font-size: 14px;
	}

	.long-error {
		padding-left: 170px;
	}

	.small-input {
		width: 430px;
	}

	.small-error {
		padding-left: 75px;
	}

	.small-label {
		display: inline-block;
		width: 60px;
		text-align: right;
	}
	
</style>
<style>
	.layout-form .el-form-item__error{
		width: 80%;
	}
	.clearableselect .el-icon-arrow-up{
		display: none;
	}
	/* .clearableselect .el-icon-circle-close{
		
	} */
	.clearableselect .el-input__suffix{
		display: block;
		right: 30px;
	}
</style>