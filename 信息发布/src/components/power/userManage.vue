<template>
	<div id="user" class="br bx">
		<div class="item">
			<el-button class="mybtn-primary"  type="text" @click="handleBatchDelete()">{{$t("message.authority.btnDelete")}}</el-button>
			<el-button class="mybtn-primary"  type="text" @click="addUser.dialogVisible = true">{{$t("message.authority.user.btnAdd")}}</el-button>
		</div>
		<el-table :data="userList.data" class="my-table" @selection-change="selectionChange" highlight-current-row v-loading="userList.listLoading" height="77%" style="width: 100%;">
			<el-table-column type="selection" style="width:5%;"></el-table-column>
			<el-table-column type="index" :index="indexMethod" :label="$t('message.authority.user.index')" width="100"></el-table-column>
			<el-table-column prop="fullname" :label="$t('message.authority.user.name')">
				<template slot-scope="scope">
			        <span v-if="scope.row.id==1">{{$t("message.authority.firstUser")}}</span>
			        <span v-else>{{ scope.row.fullname }}</span>
			    </template>
			</el-table-column>
			<el-table-column prop="username" :label="$t('message.authority.user.username')">
				<template slot-scope="scope">
			        <span>{{ scope.row.username }}</span>
			    </template>
			</el-table-column>
			<!--<el-table-column prop="password" label="登录密码" :formatter="formatPassword"></el-table-column>-->
			<el-table-column prop="group" :label="$t('message.authority.user.role')">
				<template slot-scope="scope">
			        <span>{{ scope.row.group }}</span>
			    </template>
			</el-table-column>
			<el-table-column prop="displayGroups" show-overflow-tooltip :label="$t('message.authority.user.organization')">
				<template slot-scope="scope">
			        <span v-if="scope.row.id==1">全部</span>
			        <span v-else>{{ scope.row.displayGroups }}</span>
			    </template>
			</el-table-column>
			<el-table-column :label="$t('message.authority.user.operate')">
				<template slot-scope="scope">
					<div v-if="currentUser == 'admin' || scope.row.id!=1">
						<el-button class="single-btn"  type="text"  size="small" @click="handleEdit(scope.row)">{{$t("message.authority.btnEdit")}}</el-button>
						<el-button class="single-btn"  type="text"  size="small" @click="handleDelete(scope.row)">{{$t("message.authority.btnDelete")}}</el-button>
					</div>
					<div v-else>
						<el-button disabled class="single-btn disable-btn"  type="text"  size="small">{{$t("message.authority.btnEdit")}}</el-button>
						<el-button disabled class="single-btn disable-btn"  type="text"  size="small">{{$t("message.authority.btnDelete")}}</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
			<el-pagination background layout="total,sizes,prev, pager, next,jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30, 50]" :page-size="userList.limit" :total="userList.total" style="float:right;">
			</el-pagination>
		</el-col>

		<el-dialog :title="$t('message.authority.user.addTitle')" :visible.sync="addUser.dialogVisible" width="50%" center @close="closeAddUser('addUser.form')">
			<el-form :model="addUser.form" status-icon :rules="addUser.rules" ref="addUser.form" label-width="120px" >
				<el-row>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.name')" prop="fullname">
							<el-input type="text" v-model="addUser.form.fullname" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.role')" prop="groupId">
							<el-select v-model="addUser.form.groupId" @change="groupChangeForAdd">
								<el-option v-for="(item, index) in roleList" :key="index" :label="item.group" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.username')" prop="username">
							<el-input type="text" v-model="addUser.form.username" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.password')" prop="pwd">
							<el-input type="password" v-model="addUser.form.pwd" auto-complete="off" :placeholder="$t('message.authority.user.tips.password2')"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="org" :label="$t('message.authority.user.organization')" prop="displayGroupIds">
					<el-card class="box-card">
						<el-tree
							:data="addUser.displayGroup.data"
						  	:props="addUser.displayGroup.props"
						  	show-checkbox
						  	node-key="id"
							ref="addUserTree"
							default-expand-all
							check-strictly
						 	@check="addUserHandleCheckChange">
						</el-tree>
					</el-card>
				</el-form-item>
				<div style="text-align: center;">
					<el-button class="mybtn-primary"  type="text" @click="submitAddUserForm('addUser.form')">{{$t("message.authority.btnSave")}}</el-button>
					<el-button class="mybtn-primary"  type="text" @click="addUser.dialogVisible = false">{{$t("message.authority.btnCancle")}}</el-button>
				</div>
			</el-form>
		</el-dialog>

		<el-dialog :title="$t('message.authority.user.editTitle')" :visible.sync="editUser.dialogVisible" width="50%" center @close="closeEditUser('editUser.form')">
			<el-form :model="editUser.form" status-icon :rules="editUser.rules" ref="editUser.form" label-width="100px">
				<el-row>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.name')" prop="fullname">
							<el-input v-if="editUser.editUserId != 1" type="text" v-model="editUser.form.fullname" auto-complete="off"></el-input>
							<span v-else style="margin-left: 15px;">{{$t("message.authority.firstUser")}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.role')" prop="groupId">
							<el-select v-if="editUser.editUserId != 1" v-model="editUser.form.groupId" @change="groupChangeForEdit">
								<el-option v-for="(item, index) in roleList" :key="index" :label="item.group" :value="item.id"></el-option>
							</el-select>
							<span style="margin-left: 15px;" v-else>{{roleListJson[editUser.form.groupId]}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.username')" prop="username">
							<span style="margin-left: 15px;">{{editUser.form.username}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item class="required" :label="$t('message.authority.user.password')" prop="pwd">
							<el-input @focus="editPwdFocus" type="password" v-model="editUser.form.pwd" auto-complete="off" :placeholder="$t('message.authority.user.tips.password2')" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="org" :label="$t('message.authority.user.organization')" prop="displayGroupIds">
					<el-card class="box-card">
						<el-tree
							:data="editUser.displayGroup.data"
						  	:props="editUser.displayGroup.props"
						  	show-checkbox
						  	node-key="id"
							ref="editUserTree"
							default-expand-all
							check-strictly
						 	@check="editUserHandleCheckChange">
						</el-tree>
					</el-card>
				</el-form-item>
				<div style="text-align: center;">
					<el-button class="mybtn-primary"  type="text" @click="submitEditUserForm('editUser.form')">{{$t("message.authority.btnSave")}}</el-button>
					<el-button class="mybtn-primary"  type="text" @click="editUser.dialogVisible = false">{{$t("message.authority.btnCancle")}}</el-button>
				</div>
			</el-form>
		</el-dialog>

	</div>
</template>

<script>
	import CryptoJS from 'crypto-js/crypto-js';
	export default {
		name: 'user',
		data() {
			var addValidateDisplayGroup = (rule, value, callback) => {
				var displayGroupArray = this.$refs.addUserTree.getCheckedNodes();
				if(displayGroupArray.length<=0) {
					callback(new Error(this.$t('message.authority.user.tips.organization')));
				} else {
					callback();
				}
			};
			var editValidateDisplayGroup = (rule, value, callback) => {
				var displayGroupArray = this.$refs.editUserTree.getCheckedNodes();
				if(displayGroupArray.length<=0) {
					callback(new Error(this.$t('message.authority.user.tips.organization')));
				} else {
					callback();
				}
			};
			return {
				currentUser: localStorage.current_user,
				roleList: [],
				roleListJson: {},
				userList: {
					page: 1,
					limit: 20,
					total: 0,
					listLoading: false,
					selections: [],
					data: []
				},
				addUser: {
					dialogVisible: false,
					form: {
						username: '',
						pwd: '',
						groupId: '',
						fullname: '',
						displayGroupIds: ''
					},
					rules: {
						username: [{
							required: true,
							message: this.$t('message.authority.user.tips.username'),
							trigger: 'blur'
						}],
						pwd: [{
							required: true,
							message: this.$t('message.authority.user.tips.password1'),
							trigger: 'blur'
						}, {
							min: 6,
							max: 12,
							message: this.$t('message.authority.user.tips.password2'),
							trigger: 'blur'
						}],
						fullname: [{
							required: true,
							message: this.$t('message.authority.user.tips.fullname'),
							trigger: 'blur'
						}],
						groupId: [{
							required: true,
							message: this.$t('message.authority.user.tips.role'),
							trigger: 'blur'
						}]
					},
					displayGroup:{
						props: {
				          label: 'displayGroup',
				          children: 'child'
				       },
				       data:[]
					}
				},
				editUser: {
					editUserId: '',
					dialogVisible: false,
					form: {
						username: '',
						pwd: '??????',
						groupId: '',
						state: '',
						displayGroupIds: ''
					},
					rules: {
						username: [{
							required: true,
							message: this.$t('message.authority.user.tips.username'),
							trigger: 'blur'
						}],
						pwd: [{
							required: true,
							message: this.$t('message.authority.user.tips.password1'),
							trigger: 'blur'
						}, {
							min: 6,
							max: 12,
							message: this.$t('message.authority.user.tips.password2'),
							trigger: 'blur'
						}],
						fullname: [{
							required: true,
							message: this.$t('message.authority.user.tips.fullname'),
							trigger: 'blur'
						}],
						groupId: [{
							required: true,
							message: this.$t('message.authority.user.tips.role'),
							trigger: 'blur'
						}]
					},
					displayGroup:{
						props: {
				          label: 'displayGroup',
				          children: 'child'
				       },
				       data:[]
					}
				}
			}
		},
		methods: {
			//表格状态格式化
			formatPassword(row, column, cellValue) {
//				return CryptoJS.enc.Base64.stringify(cellValue);
			},
			//加载序号
			indexMethod(index) {
				index = (this.userList.page - 1) * (this.userList.limit) + index + 1
				return index;
			},
			//分页相关
			handleCurrentChange(val) {
				this.userList.page = val;
				this.getUserList();
			},
			handleSizeChange(val) {
				this.userList.limit = val
				this.getUserList();
			},
			//列表选择框
			selectionChange(selections) {
				console.log(selections)
				this.userList.selections = selections;
			},
			//切换角色，添加时
			groupChangeForAdd(value) {
				//切换前的值
				var addGroupBeforeValue = this.addGroupBeforeValue;
				//如果value=1，即超级管理员，选中所有设备分组并不可取消
				var displayGroup = this.editUser.displayGroup.data;
				var allchild = this.findAllChild(displayGroup);
				for(var i=0;i<allchild.length;i++){
					if(addGroupBeforeValue == 1){
						this.$refs.addUserTree.setChecked(allchild[i], false, false);
					}
					if(value == 1){
						this.$refs.addUserTree.setChecked(allchild[i], true, false);
					}
				}
				this.addGroupBeforeValue = value;
			},
			//切换角色，编辑时
			groupChangeForEdit(value) {
				//切换前的值
				var editGroupBeforeValue = this.editGroupBeforeValue;
				
				//如果value=1，即超级管理员，选中所有设备分组并不可取消
				var displayGroup = this.editUser.displayGroup.data;
				var allchild = this.findAllChild(displayGroup);
				for(var i=0;i<allchild.length;i++){
					if(value == 1){
						this.$refs.editUserTree.setChecked(allchild[i], true, false);
					}else{
						this.$refs.editUserTree.setChecked(allchild[i], false, false);
					}
				}
				
				var displayGroupInfo = this.editUser.form.displayGroupInfo;
				console.log(displayGroupInfo)
				for(var key in displayGroupInfo){
					this.$refs.editUserTree.setChecked(key, true, false);
				}
				
				this.addGroupBeforeValue = value;
			},
			//加载用户列表
			getUserList() {
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/user',
					data: {
						limit: this.userList.limit,
						page: this.userList.page
					}
				}).then((res) => { //成功
					var userData = res.data;
					console.log(userData)
					//总页数
					_this.userList.total = userData.total;
					//用户列表
					_this.userList.data = userData.data;
				}).fail((err) => { //失败

				});
			},
			//加载角色列表
			getRoleList() {
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/group'
				}).then((res) => { //成功
					var roleData = res.data;
					//角色列表
					var roles = roleData.data;
					_this.roleList = roles;
					for(var i=0;i<roles.length;i++){
						_this.roleListJson[roles[i].id] = roles[i].group;
					}
				}).fail((err) => { //失败

				});
			},
			//添加用户
			submitAddUserForm(formName) {				
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var _this = this;
						//密码加密
						var password = CryptoJS.HmacSHA256(_this.addUser.form.pwd, _this.addUser.form.username).toString();
						_this.addUser.form.password = password;
						//设备分组
						var displayGroupArray = this.$refs.addUserTree.getCheckedNodes();
						var idArray = [];
						for(var i=0;i<displayGroupArray.length;i++){
							idArray.push(displayGroupArray[i].id);
						}
						_this.addUser.form.displayGroupIds = idArray.join(",");
						_this.LonbonAjax({
							type: 'POST',
							url: '/api/v1/user',
							data: _this.addUser.form
						}).then((res) => {
							this.$message({
								message: this.$t('message.authority.user.tips.addSuccess'),
								type: 'success'
							});
							_this.addUser.dialogVisible = false;
							_this.getUserList();
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
			//关闭添加用户，并重置表单
			closeAddUser(formName) {
				this.$refs.addUserTree.setCheckedKeys([]);
				this.$refs[formName].resetFields();
			},
			//删除用户
			handleDelete(user) {
				if(localStorage.current_user != 'admin' && user.id == 1){
					this.$message({
						message: this.$t('message.authority.user.tips.notAdmin'),
						type: 'error'
					});
					return
				}
				this.$confirm(this.$t('message.authority.user.tips.delConfirm'), {
					type: 'warning'
				}).then(() => {
					this.LonbonAjax({
						type: 'DELETE',
						url: '/api/v1/user/' + user.id
					}).then((res) => { //成功            	              
						this.$message({
							message: this.$t('message.authority.user.tips.delSuccess'),
							type: 'success'
						});
						this.getUserList();
					}).fail((err) => { //失败              
						this.$message({
							message: err.message,
							type: 'error'
						});
					});
				})
			},
			//批量删除
			handleBatchDelete(){
				let selections = this.userList.selections;
				if(selections.length<=0){
					this.$message({
						message: this.$t('message.authority.user.tips.delCheck'),
						type: 'warning'
					});
					return false;
				}
				var idArray = [];
				for(var i=0;i<selections.length;i++){
					idArray.push(selections[i].id);
				}
				this.$confirm(this.$t('message.authority.user.tips.delConfirm'), {
					type: 'warning'
				}).then(() => {
					this.LonbonAjax({
						type: 'DELETE',
						url: '/api/v1/user/1',
						data: {
							userIds: idArray.join(",")
						}
					}).then((res) => { //成功            	              
						this.$message({
							message: this.$t('message.authority.user.tips.delSuccess'),
							type: 'success'
						});
						this.getUserList();
					}).fail((err) => { //失败              
						this.$message({
							message: err.message,
							type: 'error'
						});
					});
				}).catch(() => {

				});
			},
			//编辑用户
			handleEdit(user) {
				if(localStorage.current_user != 'admin' && user.id == 1){
					this.$message({
						message: this.$t('message.authority.user.tips.notAdminEdit'),
						type: 'error'
					});
					return
				}
				// 记录当前编辑的用户ID
				this.editUser.editUserId = user.id;
				let that= this;
				this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/user/' + user.id
				}).then((res) => { //成功       
					var user = res.data;
					//设备分组
					if(user.groupId == 1){
						var displayGroup = that.editUser.displayGroup.data;
						var allchild = this.findAllChild(displayGroup);
						for(var i=0;i<allchild.length;i++){
							this.$refs.editUserTree.setChecked(allchild[i], true, false);
						}
					}else{
						var displayGroupInfo = user.displayGroupInfo;
						console.log(displayGroupInfo)
						for(var key in displayGroupInfo){
							this.$refs.editUserTree.setChecked(key, true, false);
						}
					}
					//密码解密
					user.password = '';
					user.pwd = '******';
					this.editUser.form = user;
				}).fail((err) => { //失败              
					console.log(err)
				});
				this.editUser.dialogVisible = true;
			},
			//编辑时，密码聚焦事件
			editPwdFocus(){
				this.editUser.form.pwd = '';
			},
			submitEditUserForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var _this = this;
						//密码加密
						if(_this.editUser.form.pwd != '******'){
							var password = CryptoJS.HmacSHA256(_this.editUser.form.pwd, _this.editUser.form.username).toString();
							_this.editUser.form.password = password;
						}
						//设备分组
						var displayGroupArray = this.$refs.editUserTree.getCheckedNodes();
						var idArray = [];
						for(var i=0;i<displayGroupArray.length;i++){
							idArray.push(displayGroupArray[i].id);
						}
						_this.editUser.form.displayGroupIds = idArray.join(",");
						_this.LonbonAjax({
							type: 'PUT',
							url: '/api/v1/user/' + _this.editUser.form.id,
							data: _this.editUser.form
						}).then((res) => {
							this.$message({
								message: this.$t('message.authority.user.tips.editSuccess'),
								type: 'success'
							});
							_this.editUser.dialogVisible = false;
							_this.getUserList();
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
			//关闭编辑用户，并重置表单
			closeEditUser(formName) {
				this.$refs.editUserTree.setCheckedKeys([]);
				this.$refs[formName].resetFields();
			},
			//获取设备分组
			loadDisplayGroup(){
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/displayGroup',
					data: {
						userId: localStorage.getItem('userId')
					}
				}).then((res) => {
					console.log(res)
					_this.addUser.displayGroup.data = _this.editUser.displayGroup.data = res.data;
				}).fail((err) => {
					console.log(err)
				});
			},
			addUserHandleCheckChange(currentData, allCheckedData){
				var addUserGroupId = this.addUser.form.groupId;
		   		if(addUserGroupId == 1){
		   			this.$refs.addUserTree.setChecked(currentData.id, true, false);
		   		}else{
		   			this.dealTreeNode(currentData, allCheckedData, 'addUserTree');
		   		}
		   	},
		   	editUserHandleCheckChange(currentData, allCheckedData){
		   		var editUserGroupId = this.editUser.form.groupId;
		   		if(editUserGroupId == 1){
		   			this.$refs.editUserTree.setChecked(currentData.id, true, false);
		   		}else{
		   			this.dealTreeNode(currentData, allCheckedData, 'editUserTree');
		   		}
		   		
		   	},
			dealTreeNode(currentData, allCheckedData, treeName){
				//根据当前选中数据获取当前节点
				var currentNode = this.$refs[treeName].getNode(currentData);
				//获取当前节点的子节点
				var allChildKey = this.findAllChild(currentData.child);
				for(var i=0;i<allChildKey.length;i++){
					if(currentNode.checked){
						this.$refs[treeName].setChecked(allChildKey[i], true, false);
					}else{
						this.$refs[treeName].setChecked(allChildKey[i], false, false);
					}
				}
				var checkData = currentData;
				while(checkData.parentId != 0){
					checkData = this.$refs[treeName].getNode(checkData.parentId).data;
					if(currentNode.checked){
						//将所有父节点选中
						this.$refs[treeName].setChecked(checkData.id, true, false);
					}else{
						//如果父节点下没有选中的节点，则将该父节点取消选中
						var flag = false;
						var checkChildData = checkData.child;
						for(var i=0;i<checkChildData.length;i++){
							var childNode = this.$refs[treeName].getNode(checkChildData[i].id);
							if(childNode.checked){
								flag = true;
							}
						}
						if(!flag){
							this.$refs[treeName].setChecked(checkData.id, false, false);
						}
					}
				}
			},
			findAllChild(checkChild) {
		   		let allChild = [];
		   		let allChildKey = [];
		   		if(checkChild.length>0){
		   			for(var i=0;i<checkChild.length;i++){
		   				allChild.push(checkChild[i]);
		   				allChildKey.push(checkChild[i].id);
			   			let oneChild = checkChild[i].child;
			   			if(oneChild.length>0){
		   					allChild = allChild.concat(this.findAllChild(oneChild));
		   					allChildKey = allChildKey.concat(this.findAllChild(oneChild));
			   			}
			   		}
		   		}
		   		return allChildKey;
		   	},
		    getLang(){   
		        this.$i18n.locale = window.localStorage['current_lan'];
		        this.$i18n.mergeLocaleMessage('en', window.localStorage['current_lan'])
		    }
		},
		created() {
			this.getLang();
			this.getUserList();
			this.getRoleList();
			this.loadDisplayGroup();
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
	#user {
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
	
	.disable-btn{
		color: #c0c4cc;
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
	}
	@media (max-height: 800px) {
		.box-card{
			max-height: 15em;
		}
	}
</style>