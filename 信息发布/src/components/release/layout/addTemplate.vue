<template>
	<el-dialog :show-close='false' :close-on-click-modal='false' title="保存为模板"
             :visible.sync="template_dialog" width="713px" center>
		<div class="layout-body">
			<div class="item">
				<label for="">
					<img src="../../../../static/images/importent.png"/>
					<span>{{$t('message.releaseManage.template_name')}}</span>:
				</label>
				<el-input v-model.trim='name'></el-input>
			</div>
			<div class="item">
				<label for="">
					<span>{{$t('message.releaseManage.remark')}}</span>:
				</label>
				<el-input v-model.trim='remark'></el-input>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
		    <el-button class="el-button mybtn-primary el-button--primary" @click='add_template' type="primary">{{$t('message.releaseManage.okBtn')}}</el-button>
		    <el-button class="el-button mybtn-primary el-button--primary" @click="close_dialog" >{{$t('message.cancelChange')}}</el-button>
		  </span>
	</el-dialog>
</template>

<script>
	import { http } from "../../../api/config";
	export default {
		name: 'add-template',
		props: {
			template_dialog: {
				type: Boolean,
				require: true
			},
			layoutid: {
				type: String,
				require: true
			}
		},
		data: function() {
			return {
				name: '',
				remark: '',
			}
		},
		mounted: function() {
			var _this = this;
		},
		methods: {
			close_dialog: function() {
				var _this = this;
				_this.$emit('close_dialog', false);
				_this.init();
			},
			init: function() {
				var _this = this;
				_this.name = '';
				_this.remark = '';
			},
			add_template: function() {
				var _this = this;
				_this.LonbonAjax({
					url: http.getTemplate,
					type: 'POST',
					data: {
						template: _this.name,
						layoutId: _this.layoutid,
						description: _this.remark
					}
				}).then(function(res) {
					_this.close_dialog();
					_this.$message({
						message: '模板保存成功',
						type: 'success'
					});
					console.log(res)
				}, function(res) {
					console.log(res)
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

	.item {
		margin-top: 20px;
	}

	.item label {
		text-align: right;
		display: inline-block;
		width: 20%;
	}

	.item .el-input {
		width: 60%;
	}
</style>
