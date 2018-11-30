<template>
	<el-dialog :show-close='false' :close-on-click-modal='false' :title="title" @open="init" :visible.sync="region_webpage_dialog"
	 width="713px" center>
		<div class="layout-body region-form">
			<el-form label-width="20%" :model='webForm' :rules="webRoles" ref="ruleForm">
				<!-- 名称 -->
				<el-form-item :label="$t('message.releaseManage.name')" prop="name" class="required">
					<el-input style='width: 80%;' v-model.trim='webForm.name'></el-input>
				</el-form-item>
				<!-- 持续时间 -->
				<el-form-item :label="$t('message.releaseManage.duration')">
					<el-input type='number' style='width: 80%;' v-model="webForm.duration">
						</el-option>
					</el-input>
					{{$t('message.releaseManage.second')}}
				</el-form-item>
				<el-form-item :label="$t('message.releaseManage.webpageUrl')" prop="webpagerUrl" class="required">
					<el-input type='url' style='width: 80%;' v-model="webForm.webpagerUrl">
						</el-option>
					</el-input>
				</el-form-item>
				<div style="text-align: center;">
					<el-button class="el-button mybtn-primary el-button--primary" type="primary" @click="add_region('ruleForm')">{{$t('message.releaseManage.okBtn')}}</el-button>
					<el-button class="el-button mybtn-primary el-button--primary" @click="close_region('ruleForm')">{{$t('message.cancelChange')}}</el-button>
				</div>
			</el-form>
		</div>
		<!-- <span slot="footer" class="dialog-footer">
    <el-button :disabled="save_disabled" class="el-button mybtn-primary el-button--primary" @click='add_region' type="primary">{{$t('message.releaseManage.okBtn')}}</el-button>
    <el-button class="el-button mybtn-primary el-button--primary"
               @click="close_region">{{$t('message.cancelChange')}}</el-button>
    </span> -->
	</el-dialog>
</template>

<script>
	export default {
		name: "webpage-region",
		props: {
			region_webpage_dialog: {
				type: Boolean,
				require: true
			},
			func: {
				type: Function,
				require: true
			},
			dropregionid: {
				type: String,
				require: true
			},
			media_list_edit_item: {
				type: Object
			},

		},
		data: function() {
			return {
				webForm: {
					name: '',
					duration: 10,
					webpagerUrl: '',
				},
				webRoles: {
					name: {
						required: true,
						message: this.$t('message.layoutManage.layout_name'),
						trigger: 'blur'
					},
					webpagerUrl:{
						required: true,
						message: this.$t('message.layoutManage.layout_weburl'),
						trigger: 'blur'
					}
				},
				region_webpage_dialogs: true,
				title: '',
				save_disabled: false
			}
		},
		methods: {
			inputChange(type) {
				var key = type + '_error';
				console.log(key)
				this[key] = '';
			},
			init: function() {
				var _this = this;
				var item = _this.media_list_edit_item;
				_this.save_disabled = false;
				if (item.mediaName) {
					_this.webForm.duration = item.duration;
					_this.webForm.name = item.mediaName;
					_this.webForm.webpagerUrl = item.options.uri;
					_this.title = _this.$t('message.layoutDesign.editmedia');
				} else {
					_this.webForm.duration = 10;
					_this.webForm.name = 'webpage';
					_this.webForm.webpagerUrl = '';
					_this.title = _this.$t('message.layoutDesign.addmedia');
				}
			},
			close_region: function(formName) {
				this.$refs[formName].resetFields();
				this.$emit('close_region', 'webpage')
			},
			add_region: function(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var _this = this;
						_this.save_disabled = true;
						var option = {
							duration: _this.webForm.duration,
							name: _this.webForm.name,
							uri: _this.webForm.webpagerUrl,
						};
						this.$emit('save_media', option, _this.dropregionid, _this.media_list_edit_item);
					}
				})

			}
		}
	}
</script>

<style scoped>
	.layout-body {
		margin: 0;
		padding: 0;
	}

	.item .error {
		font-size: 14px;
		height: 20px;
		line-height: 20px;
		color: red;
		padding-left: 21%;
	}

	.item label {
		text-align: right;
		display: inline-block;
		width: 20%;
	}

	.item .el-select,
	.item .el-input {
		width: 60%;
	}
</style>
<style>
	.region-form .el-form-item__error{
		width: 80%;
	}
</style>