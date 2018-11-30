<template>
	<el-dialog :modal-append-to-body='false' :append-to-body='true' :show-close='false' :close-on-click-modal='false'
	 :title="title" @open="init" :visible.sync="region_text_dialog" width="713px" center>
		<div class="layout-body region-form" >
			<el-form label-width="20%" :model='textForm' :rules="textRules" ref="ruleForm">
				<!-- 名称 -->
				<el-form-item :label="$t('message.releaseManage.name')" prop="name" class="required">
					<el-input style='width: 80%;' v-model.trim='textForm.name'></el-input>
				</el-form-item>
				<!--效果-->
				<el-form-item :label="$t('message.releaseManage.effect')" class="item">
					<el-select v-model="textForm.scan_type">
						<el-option v-for="item in img_scan" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!--速度-->
				<el-form-item :label="$t('message.releaseManage.speed')" class="item" v-if="textForm.scan_type!='none'">
					<el-input type="number" v-model.trim='textForm.speed'></el-input>
				</el-form-item>
				<!--背景色-->
				<el-form-item :label="$t('message.releaseManage.backgroundcolor')" class="item color-item">
					<el-color-picker color-format="hex" v-model="textForm.background"></el-color-picker>
					<!-- <el-input type='color' v-model.trim='textForm.background'></el-input> -->
				</el-form-item>
				<!-- 持续时间 -->
				<el-form-item :label="$t('message.releaseManage.duration')">
					<el-input type='number' style='width: 80%;' v-model="textForm.duration">
						</el-option>
					</el-input>
					{{$t('message.releaseManage.second')}}
				</el-form-item>

				<editor v-if="region_text_dialog" ref="ueditor" :text="text" :config="config"></editor>
			</el-form>
			<div style="text-align: center;">
				<el-button class="el-button mybtn-primary el-button--primary" type="primary" @click="add_region('ruleForm')">{{$t('message.releaseManage.okBtn')}}</el-button>
				<el-button class="el-button mybtn-primary el-button--primary" @click="close_region('ruleForm')">{{$t('message.cancelChange')}}</el-button>
			</div>

		</div>
		<!-- <span slot="footer" class="dialog-footer">
			<el-button :disabled="save_disabled" class="el-button mybtn-primary el-button--primary" @click='add_region' type="primary">{{$t('message.releaseManage.okBtn')}}</el-button>
			<el-button class="el-button mybtn-primary el-button--primary" @click="close_region">{{$t('message.cancelChange')}}</el-button>
		</span> -->
	</el-dialog>

</template>

<script>
	import editor from "./editor";

	export default {
		name: "text-region",
		components: {
			editor
		},
		props: {
			region_text_dialog: {
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
				textForm: {
					name: '',
					scan_type: 'none',
					speed: '',
					background: '#000000',
					duration: 10
				},
				textRules: {
					name: {
						required: true,
						message: this.$t('message.layoutManage.layout_name'),
						trigger: 'blur'
					},
				},
				save_disabled: false,
				text: "",
				title: "",
				img_scan: [{
						value: "none",
						label: this.$t('message.releaseManage.effect_none')
					},
					{
						value: "marqueeLeft",
						label: this.$t('message.releaseManage.effect_left')
					},
					{
						value: "marqueeRight",
						label: this.$t('message.releaseManage.effect_right')
					},
					{
						value: "marqueeUp",
						label: this.$t('message.releaseManage.effect_top')
					},
					{
						value: "marqueeDown",
						label: this.$t('message.releaseManage.effect_bottom')
					}
				],
				config: {
					autoHeightEnabled: false,
					autoFloatEnabled: true, //是否工具栏可浮动
					initialContent: "请输入内容", //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
					autoClearinitialContent: true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
					initialFrameWidth: null,
					BaseUrl: "",
					UEDITOR_HOME_URL: "static/ueditor/"
				},
				addFormVisible: false
			};
		},
		methods: {
			inputChange(type) {
				var key = type + "_error";
				this[key] = "";
			},
			init: function() {
				var _this = this;
				var item = _this.media_list_edit_item;
				_this.save_disabled = false;
				console.log(item)
				if (item.mediaName) {
					_this.textForm.duration = item.duration;
					_this.textForm.name = item.mediaName;
					_this.textForm.title = _this.$t("message.layoutDesign.editmedia");
					_this.text = item.options.raw;
					console.log(item.options.raw)
					var effect = item.options.effect;
					_this.textForm.scan_type = effect;
					_this.textForm.background = item.options.backgroundColor;
					if (effect != "none") {
						_this.textForm.speed = item.options.speed;
					}
				} else {
					_this.textForm.duration = 10;
					_this.textForm.name = item.type;
					_this.textForm.scan_type = "none";
					_this.textForm.background = "#000000";
					_this.speed = "";
					_this.title = _this.$t("message.layoutDesign.addmedia");
					_this.text = "";
				}
			},
			close_region: function(formName) {
				this.$refs[formName].resetFields();
				this.$emit("close_region", "text");
			},
			add_region: function(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var _this = this;
						var editor_content = _this.$refs.ueditor.getUEContent();
						_this.save_disabled = true;
						var option = {
							effect: _this.textForm.scan_type,
							speed: _this.textForm.speed,
							backgroundColor: _this.textForm.background,
							duration: _this.textForm.duration,
							name: _this.textForm.name,
							text: editor_content
						};
						this.$emit(
							"save_media",
							option,
							_this.dropregionid,
							_this.media_list_edit_item
						);
					}
				})


			}
		}
	};
</script>

<style scoped>
	.layout-body {
		margin: 0;
		padding: 0;
	}

	.color-item label {
		position: relative;
		top: -5px;
	}

	.item .el-select,
	.item .el-input {
		width: 80%;
	}

	.el-color-picker {
		width: 80% !important;
	}
</style>
<style>
	.color-item .el-color-picker__trigger {
		width: 100% !important;
	}
</style>
<style>
	.region-form .el-form-item__error{
		width: 80%;
	}
</style>