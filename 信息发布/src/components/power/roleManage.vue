<template>
	<div id="role" class="br bx">
		<div class="item">
			<el-button class="mybtn-primary"  type="text" @click="handleBatchDelete()">{{$t("message.authority.btnDelete")}}</el-button>
			<el-button class="mybtn-primary"  type="text" @click="addRole.dialogVisible = true">{{$t("message.authority.role.btnAdd")}}</el-button>
		</div>
		<el-table :data="roleList.data" class="my-table" @selection-change="selectionChange" highlight-current-row v-loading="roleList.listLoading" height="77%" style="width: 100%;">
			<el-table-column type="selection" style="width:5%;"></el-table-column>
			<el-table-column type="index" :index="indexMethod" :label="$t('message.authority.role.index')" width="100"></el-table-column>
			<el-table-column prop="group" show-overflow-tooltip :label="$t('message.authority.role.name')" width="300"></el-table-column>
			<!--<el-table-column prop="state" label="状态"></el-table-column>-->
			<el-table-column prop="userAction" show-overflow-tooltip :label="$t('message.authority.role.authority')">
				<template slot-scope="scope">
			        <span v-if="scope.row.id==1" style="color: red">{{$t("message.authority.all")}}</span>
			        <span v-else>{{ scope.row.userAction }}</span>
			    </template>
			</el-table-column>
			<el-table-column :label="$t('message.authority.role.operate')" width="300">
				<template slot-scope="scope">
					<el-button  type="text" class="single-btn"  size="small" @click="handleEdit(scope.row)">{{$t("message.authority.btnEdit")}}</el-button>
					<el-button  type="text" class="single-btn"  size="small" @click="handleDelete(scope.row)">{{$t("message.authority.btnDelete")}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
			<el-pagination background layout="total,sizes,prev, pager, next,jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30, 50]" :page-size="roleList.limit" :total="roleList.total" style="float:right;">
			</el-pagination>
		</el-col>

		<el-dialog :title="$t('message.authority.role.addTitle')" :visible.sync="addRole.dialogVisible" width="40%" center @close="closeAddRole('addRole.form')">
			<el-form :model="addRole.form" status-icon :rules="addRole.rules" ref="addRole.form" label-width="120px">
				<el-form-item class="required" :label="$t('message.authority.role.name')" prop="group">
					<el-input type="text" v-model="addRole.form.group" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item class="required" label="状态" prop="state">
					<el-select v-model="addRole.form.state">
						<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="0"></el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item class="required" :label="$t('message.authority.role.authority')" prop="permissions">
					<el-card class="box-card">
						<el-tree
							:data="addRole.permissions.data"
						  	:props="addRole.permissions.props"
						  	show-checkbox
						  	node-key="code"
							ref="addRoleTree"
							default-expand-all
						 	@check-change="addRoleHandleCheckChange">
						</el-tree>
					</el-card>
				</el-form-item>
				<div style="text-align: center;">
					<el-button class="mybtn-primary"  type="text" @click="submitAddRoleForm('addRole.form')">{{$t("message.authority.btnSave")}}</el-button>
					<el-button class="mybtn-primary"  type="text" @click="addRole.dialogVisible = false">{{$t("message.authority.btnCancle")}}</el-button>
				</div>
			</el-form>
		</el-dialog>
		
		<el-dialog :title="$t('message.authority.role.editTitle')" :visible.sync="editRole.dialogVisible" width="40%" center @close="closeEditRole('editRole.form')">
			<el-form :model="editRole.form" status-icon :rules="editRole.rules" ref="editRole.form" label-width="120px">
				<el-form-item class="required" :label="$t('message.authority.role.name')" prop="group">
					<el-input type="text" v-model="editRole.form.group" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item class="required" label="状态" prop="state">
					<el-select v-model="editRole.form.state">
						<el-option label="启用" :value="1"></el-option>
						<el-option label="禁用" :value="0"></el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item class="required" :label="$t('message.authority.role.authority')" prop="userAction">
					<el-card class="box-card">
						<el-tree
							:data="editRole.permissions.data"
						  	:props="editRole.permissions.props"
						  	show-checkbox
						  	node-key="code"
							ref="editRoleTree"
							default-expand-all
						 	@check-change="editRoleHandleCheckChange">
						</el-tree>
					</el-card>
				</el-form-item>
				<div style="text-align: center;">
					<el-button class="mybtn-primary"  type="text" @click="submitEditRoleForm('editRole.form')">{{$t("message.authority.btnSave")}}</el-button>
					<el-button class="mybtn-primary"  type="text" @click="editRole.dialogVisible = false">{{$t("message.authority.btnCancle")}}</el-button>
				</div>
			</el-form>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: 'role',
		data() {
			var addValidatePermissions = (rule, value, callback) => {
				var permissionsArray = this.$refs.addRoleTree.getCheckedNodes();
				if(permissionsArray.length<=0) {
					callback(new Error(this.$t('message.authority.role.tips.authority')));
				} else {
					callback();
				}
			};
			var editValidatePermissions = (rule, value, callback) => {
				var permissionsArray = this.$refs.editRoleTree.getCheckedNodes();
				if(permissionsArray.length<=0) {
					callback(new Error(this.$t('message.authority.role.tips.authority')));
				} else {
					callback();
				}
			};
			return {
				roleList: {
					page: 1,
					limit: 20,
					total: 0,
					listLoading: false,
					selections: [],
					data: []
				},
				permissionsDataJson:{
							
				},
				addRole: {
					dialogVisible: false,
					form: {
						group: '',
//						state: '',
						permissions: []
					},
					rules: {
						group: [{
							required: true,
							message: this.$t('message.authority.role.tips.name'),
							trigger: 'blur'
						}],
//						state: [{
//							required: true,
//							message: '请选择状态',
//							trigger: 'blur'
//						}],
						permissions: [{
							validator: addValidatePermissions,
							trigger: 'blur'
						}]
					},
					permissions: {
						data: [],
						props: {
				          label: 'name',
				          children: 'child'
				       },
					}
				},
				editRole: {
					editRoleId: '',
					dialogVisible: false,
					form: {
						id: '',
						group: '',
//						state: '',
						userAction: []
					},
					rules: {
						group: [{
							required: true,
							message: this.$t('message.authority.role.tips.name'),
							trigger: 'blur'
						}],
//						state: [{
//							required: true,
//							message: '请选择状态',
//							trigger: 'blur'
//						}],
						userAction: [{
							validator: editValidatePermissions,
							trigger: 'blur'
						}]
					},
					permissions: {
						data: [],
						props: {
				          label: 'name',
				          children: 'child'
				       },
					}
				}
			}
		},
		methods: {
			//加载序号
			indexMethod(index) {
				index = (this.roleList.page - 1) * (this.roleList.limit) + index + 1
				return index;
			},
			//分页相关
			handleCurrentChange(val) {
				this.roleList.page = val;
				this.getRoleList();
			},
			handleSizeChange(val) {
				this.roleList.limit = val
				this.getRoleList();
			},
			//列表选择框
			selectionChange(selections) {
				console.log(selections)
				this.roleList.selections = selections;
			},
			//加载权限列表
			getPermissionList(callback) {
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/userPermissions'
				}).then((res) => { //成功
					var permissions = res.data;
					var permissionsAfter = [];
					for(var i=0;i<permissions.length;i++){
						var code = permissions[i].code;
						var name = permissions[i].name;
						_this.permissionsDataJson[code] = name;
						
						// 去除“天气预报”
						var children = permissions[i].child;
						if(code == "/material"){
							var childrenAfter= [];
							for(var j=0;j<children.length;j++){
								if(children[j].code != "/forecast"){
									childrenAfter.push(children[j])
								}
							}
							permissions[i].child = childrenAfter;
						}else{
							permissions[i].child = children;
						}
						permissionsAfter.push(permissions[i]);
					}
					
					_this.addRole.permissions.data = _this.editRole.permissions.data = permissionsAfter;
					callback();
				}).fail((err) => { //失败

				});
			},
			addRoleHandleCheckChange(data, checked, indeterminate){
				this.dealTreeNode(data, checked, 'addRoleTree')
			},
			editRoleHandleCheckChange(data, checked, indeterminate){
				var editRoleId = this.editRole.editRoleId;
		   		if(editRoleId == 1 && !checked){
					this.$refs.editRoleTree.setChecked(data.code, true, false);
				}else{
					this.dealTreeNode(data, checked, 'editRoleTree')
				}
			},
			dealTreeNode(data, checked, treeName){
				var child = data.child;
				var parent = this.$refs[treeName].getNode(data.code).parent.data;
				var parentNode = this.$refs[treeName].getNode(parent.code);
				if(parentNode!=null){
					var childNodes = parentNode.childNodes;
					for(var i=0;i<childNodes.length;i++){
						if(childNodes[i].checked){
							this.$refs[treeName].setChecked(parent.code, true, false);
							break;
						}
					}
				}
			},
			//加载角色列表
			getRoleList() {
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/group',
					data: {
						limit: this.roleList.limit,
						page: this.roleList.page
					}
				}).then((res) => { //成功
					var roleData = res.data;
					//总页数
					_this.roleList.total = roleData.total;
					//角色列表
					var roles = roleData.data;
					_this.roleList.data = [];
					for(var i = 0; i < roles.length; i++) {
						var role = roles[i];
						var userActions = role.permissions;
						var permissionStr = '';
						for(var key in userActions) {
							var userAction = userActions[key];
							var permission = _this.permissionsDataJson[userAction];
							if(typeof(permission)!="undefined"){
								permissionStr += permission + '、';
							}
						}
						permissionStr = permissionStr.substring(0, permissionStr.length - 1);
						role.userAction = permissionStr;
//						var state = role.state;
//						var stateStr = '';
//						if(state == 1) {
//							stateStr = '启用';
//						} else {
//							stateStr = '禁用';
//						}
//						role.state = stateStr;
						_this.roleList.data.push(role)
					}
				}).fail((err) => { //失败

				});
			},
			//添加角色
			submitAddRoleForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var _this = this;
						var permissionsArray = this.$refs.addRoleTree.getCheckedNodes();
						var codeArray = [];
						for(var i=0;i<permissionsArray.length;i++){
							codeArray.push(permissionsArray[i].code);
						}
						_this.addRole.form.permissions = codeArray.join(",");
						_this.LonbonAjax({
							type: 'POST',
							url: '/api/v1/group',
							data: _this.addRole.form
						}).then((res) => {
							this.$message({
								message: this.$t('message.authority.role.tips.addSuccess'),
								type: 'success'
							});
							_this.addRole.dialogVisible = false;
							_this.getRoleList();
						}).fail((err) => {
							this.$message({
								message: err.message,
								type: 'error'
							});
						});
					} else {
						return false;
					}
				});
			},
			//关闭添加角色，并重置表单
			closeAddRole(formName) {
				this.$refs.addRoleTree.setCheckedKeys([]);
				this.$refs[formName].resetFields();
			},
			//删除角色
			handleDelete(role) {
				this.$confirm(this.$t('message.authority.role.tips.delConfirm'), {
					type: 'warning'
				}).then(() => {
					this.LonbonAjax({
						type: 'DELETE',
						url: '/api/v1/group/'+role.id
					}).then((res) => { //成功            	              
						this.$message({
							message: this.$t('message.authority.role.tips.delSuccess'),
							type: 'success'
						});
						this.getRoleList();
					}).fail((err) => { //失败              
						this.$message({
							message: err.message,
							type: 'error'
						});
					});
				}).catch(() => {

				});
			},
			//批量删除
			handleBatchDelete(){
				let selections = this.roleList.selections;
				if(selections.length<=0){
					this.$message({
						message: this.$t('message.authority.role.tips.delCheck'),
						type: 'warning'
					});
					return false;
				}
				var idArray = [];
				for(var i=0;i<selections.length;i++){
					idArray.push(selections[i].id);
				}
				this.$confirm(this.$t('message.authority.role.tips.delConfirm'), {
					type: 'warning'
				}).then(() => {
					this.LonbonAjax({
						type: 'DELETE',
						url: '/api/v1/group/1',
						data: {
							groupIds: idArray.join(",")
						}
					}).then((res) => { //成功            	              
						this.$message({
							message: this.$t('message.authority.role.tips.delSuccess'),
							type: 'success'
						});
						this.getRoleList();
					}).fail((err) => { //失败              
						this.$message({
							message: err.message,
							type: 'error'
						});
					});
				}).catch(() => {

				});
			},
			//编辑角色
			handleEdit(role){
				this.editRole.editRoleId = role.id;
				let that = this;
				this.editRole.dialogVisible = true;
				this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/group/'+role.id
				}).then((res) => { //成功       
					var role = res.data;
					this.editRole.form = role;
					if(role.id == 1){
						console.log(that.permissionsDataJson)
						var permissionsDataJson = that.permissionsDataJson;
						var idArray = [];
						for(var key in permissionsDataJson){
							idArray.push(key);
						}
						this.$refs.editRoleTree.setCheckedKeys(idArray);
					}else{
						var userAction = role.permissions;
						for(var key in userAction){
							//不能使用setCheckedKeys，会触发全选函数T.T
							this.$refs.editRoleTree.setChecked(userAction[key], true, false);
						}
					}
				}).fail((err) => { //失败              
					console.log(err)
				});
			},
			submitEditRoleForm(formName){
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var _this = this;
						var permissionsArray = this.$refs.editRoleTree.getCheckedNodes();
						var codeArray = [];
						for(var i=0;i<permissionsArray.length;i++){
							codeArray.push(permissionsArray[i].code);
						}
						_this.editRole.form.permissions = codeArray.join(",");
						_this.LonbonAjax({
							type: 'PUT',
							url: '/api/v1/group/'+_this.editRole.form.id,
							data: _this.editRole.form
						}).then((res) => {
							this.$message({
								message: this.$t('message.authority.role.tips.editSuccess'),
								type: 'success'
							});
							_this.editRole.dialogVisible = false;
							_this.getRoleList();
						}).fail((err) => {
							this.$message({
								message: err.message,
								type: 'error'
							});
						});
					} else {
						return false;
					}
				});
			},
			//关闭编辑角色，并重置表单
			closeEditRole(formName) {
				this.$refs.editRoleTree.setCheckedKeys([]);
				this.$refs[formName].resetFields();
			},
		    getLang(){   
		        this.$i18n.locale = window.localStorage['current_lan'];
		        this.$i18n.mergeLocaleMessage('en', window.localStorage['current_lan'])
		    }
		},
		created() {
			var _this = this;
			_this.getLang();
			_this.getPermissionList(function() {
				_this.getRoleList()
			});
		},
		mounted() {

		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit('pageName', to.name)
			});
		}
	}
</script>

<style scoped>
	#role {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 0.5em;
		box-shadow: 0 5px 80px rgba(0, 0, 0, 0.1);
	}
	
	.item {
		padding: 1.25em;
	}
	
	.item:after {
		clear: both;
		content: '';
		display: block;
	}
	
	.item .mybtn-primary {
		float: right;
	}
	
	.toolbar {
		margin-top: 1em;
	}
	
	.single-btn {
		border: none;
		color: #18abbb;
		font-size: 1em;
		background: none;
		padding-left: 0px;
		padding-top: 0px;
		padding-bottom: 0px;
	}
	
	.box-card {
		box-shadow: none;
		max-height: 20em;
		overflow: auto;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-input__inner {
		height: 2.25em !important;
	}
	
	.el-checkbox {
		margin-left: 0;
		margin-right: 1.5em;
		/*display: block;*/
	}
	
</style>