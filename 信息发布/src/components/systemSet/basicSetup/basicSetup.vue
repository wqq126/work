<template>
   <div class="sys-set">
   	  <div class="basic-title">{{$t("message.systemSet.logTitle")}}</div>
   	  <div class="basic-content">
   	  	<span >{{$t("message.systemSet.logtext")}}</span>
   	  	<el-button class="mybtn-primary" type="primary"  :loading="listLoading" @click="downLog">{{$t("message.systemSet.logBtn")}}</el-button>
   	  </div>
   	 <!-- <div class="basic-title">{{$t("message.systemSet.downSet")}}</div>
   	  <div class="basic-content">
   	  	<span >{{$t("message.systemSet.leisureTime")}}&emsp;<el-checkbox label="" v-model="checkFlag" @change="checkStatu"></el-checkbox><br></span>
   	  	<div style="margin-top: 1.5em;" v-show="showFlag">
   	  		<label class="basic-lable">{{$t("message.systemSet.setWarming")}}</label>
		    <el-time-select class="time-select"
			  v-model="downTime"
			  :picker-options="{
			    start: '00:00',
			    step: '00:10',
			    end: '23:59'
			  }"			
			  prefix-icon="none"
			  :placeholder="selctTime">
			</el-time-select>
   	  		<label style="color: #898989;">{{$t("message.systemSet.endWarming")}}</label>
   	  	    <el-button class="mybtn-primary" type="primary"  @click="saveDownStyle">{{$t("message.systemSet.channelBtn")}}</el-button>
   	  	</div>  	  	
   	  </div> -->
   	  <div class="basic-title">{{$t("message.systemSet.channelTitle")}}</div>
   	  <div class="basic-content">
   	  	<span >{{$t("message.systemSet.channelText")}}<br></span>
   	  	<div style="margin-top: 1.5em;">
   	  		<label class="basic-lable">{{$t("message.systemSet.channelLable")}}</label>
   	  		<!--<el-input v-model="channelAdress" type="text" class="my-input"></el-input>-->
   	  		<input v-model="channelAdress" type="text" class="my-input"></input>
   	  	    <el-button class="mybtn-primary" type="primary" :loading="saving" @click="saveChannel">{{$t("message.systemSet.channelBtn")}}</el-button>
   	  	</div>  	  	
   	  </div>
   	  
   	  <div class="basic-title">{{$t("message.systemSet.switchSet")}}</div>
   	  <div class="basic-content">
   	  	<span >
   	  		<label>{{$t("message.systemSet.auditSwitch")}}</label>
   	  		<el-tooltip :content="$t('message.systemSet.auditFuc') " placement="top" v-show="auditShow">
			  <el-switch
			    v-model="auditSwitch"
			    active-color="#13ce66"
			    inactive-color="#ccc"
			    active-value='true'
			    inactive-value='false'
			    @change="changeAudit">
			  </el-switch>
			</el-tooltip>
		
			<label style="margin-left: 2.5em;">{{$t("message.systemSet.deviceSwitch")}}</label>
   	  		<el-tooltip :content="$t('message.systemSet.deviceFuc') " placement="top" v-show="deviceShow">
			  <el-switch
			    v-model="deviceSwitch"
			    active-color="#13ce66"
			    inactive-color="#ccc"
			    active-value='true'
			    inactive-value='false'
			    @change="changeDevice">
			  </el-switch>
			</el-tooltip>
			
			<label style="margin-left: 2.5em;">{{$t("message.systemSet.taskSwitch")}}</label>
   	  		<el-tooltip :content="$t('message.systemSet.taskFuc')" placement="top" v-show="taskShow">
			  <el-switch
			    v-model="taskSwitch"
			    active-color="#13ce66"
			    inactive-color="#ccc"
			    active-value='true'			    
			    inactive-value='false'
			    @change="changeTask">
			  </el-switch>
			</el-tooltip>
			
			
   	  	</span>
   	  	
   	  </div>
   	  <div class="basic-title">{{$t("message.systemSet.versionInfo")}}</div>
   	  <div class="basic-content">
   	  	<div style="margin-bottom: 1.5em;">
   	  		<span >{{$t("message.systemSet.packVersion")}} {{packVersion}}</span>
   	  	    <el-button class="mybtn-primary" type="primary" @click="versionDetail">{{btnText}}</el-button>   	  	    
		      <el-collapse-transition>
		        <div v-show="visible">
		          <span >{{$t("message.systemSet.serverVersion")}} {{serverVersion}}</br></span>
   	  		      <span >{{$t("message.systemSet.webVersion")}} {{webVersion}}</br></span>
   	  		      <span >{{$t("message.systemSet.codeVersion")}} {{codeVersion}}</span>
		        </div>
		      </el-collapse-transition>
		   
   	  	    
   	  		
   	  		<!--<el-popover
		    placement="bottom"
		    :title='$t("message.systemSet.webVersion")'
		    width="200"
		    trigger="manual"
		    :content='webVersion'
		    v-model="visible">
		    <el-button slot="reference" class="mybtn-primary"  @click="visible = !visible">{{$t("message.systemSet.moreBtn")}}</el-button>
		 </el-popover>-->
   	  	</div>  	  	
   	  	<!--<span >{{$t("message.systemSet.webVersion")}} {{webVersion}}</span>-->
   	  	
   	  </div>
   </div>
</template>

<script>
  import {
    http
  } from "../../../api/config";

  export default {
    name: 'basicSetup',
    data() {
      return {
      	btnText:this.$t('message.systemSet.detailed'),
      	auditShow:false,
      	taskShow:false,
      	deviceShow:false,
      	auditSwitch:'',
      	auditStatus:this.$t('message.systemSet.offFlag'),
      	auditId:'',
      	taskSwitch:'',
      	taskStatus:this.$t('message.systemSet.offFlag'),
      	taskId:'',
      	deviceSwitch:'',
      	deviceStatus:this.$t('message.systemSet.offFlag'),
      	deviceId:'',
      	
      	visible: false,
        listLoading: false,
        saving:false,
        channelAdress: "",
        serverVersion: localStorage.getItem('serverVersion'),
        packVersion: localStorage.getItem('packVersion'),
        webVersion: localStorage.getItem('webVersion'),
        codeVersion: localStorage.getItem('codeVersion'),
        downTime: '',
        showFlag:false,
        checkFlag:false,
        selctTime:this.$t('message.systemSet.selectTime'),
        freeDownId:'',
        freeTimeId:'',
      }
    },
    methods: {
    	//版本详情控制
      versionDetail(){
    		this.visible = !this.visible;
    		if(this.visible){
    			this.btnText = this.$t('message.systemSet.takeUp');
    		}else{
    			this.btnText = this.$t('message.systemSet.detailed');
    		}
    	},
      //下载日志
      downLog() {
      	this.listLoading = true;
        this.LonbonAjax({    	 
          type: 'GET',
          url: '/api/v1/logDownload',
          data: {}
        }).then((res) => { //成功   
        	//console.log(JSON.stringify(res));			    			  	
			if(res.errorCode==200){					
				//window.location.href = res.data;
				window.location = res.data;
				this.listLoading = false;
			}						             
        }).fail((err) => { //失败              
           this.listLoading = false;
           this.$message({
	          message: this.$t('message.systemSet.downFail'),
	          type: 'error'
	       });
        });
      },
      
      //获取点播直播地址
      getChannel(){
      	this.LonbonAjax({    	 
          type: 'GET',
          url: '/api/v1/readChannel',
        }).then((res) => { //成功 
        	console.log(JSON.stringify(res));
			if(res.errorCode==200){					
				this.channelAdress = res.data;				
			}						             
        }).fail((err) => { //失败              
           console.log(JSON.stringify(err));
           /*this.$message({
	          message: this.$t('message.systemSet.getFail'),
	          type: 'error'
	       });*/
        });
      },
      saveChannel(){
      	this.saving=true;
      	this.LonbonAjax({    	 
          type: 'POST',
          url: '/api/v1/LiveBroadChannel',
          data: {value: this.channelAdress }
        }).then((res) => { //成功   
        	//console.log(JSON.stringify(res));			    			  	
			if(res.errorCode==200){	
				this.saving=false;
				this.channelAdress = res.data.value;
				this.$message({
		          message: this.$t('message.systemSet.setSuccess'),
		          type: 'success'
		       });
			}						             
        }).fail((err) => { //失败              
           this.saving=false;
           this.$message({
	          message: this.$t('message.systemSet.saveFail'),
	          type: 'error'
	       });
        });
      },
      //是否闲暇下载
      checkStatu(e){
      	if(e){
      		this.showFlag = true ;
      	}else{
      		this.showFlag = false ;
      	}
      	this.saveDownStyle();
      },
      //获取下载设置
      getDownStyle(){
    	let _this=this;
    	_this.LonbonAjax({    	 
          type: 'GET',
          url: '/api/v1/setting/0', //为0 
          data:{setting:'FREE_TIME_DOWNLOAD'}
        }).then((res) => { //成功   
        	console.log(JSON.stringify(res));			    			  	
			if(res.errorCode==200){
				_this.freeDownId = res.data.id;
				if(res.data.value=='1'){
					this.showFlag = true ;
					this.checkFlag = true ;
					_this.LonbonAjax({    	 
			          type: 'GET',
			          url: '/api/v1/setting/0',//为0  
			          data:{setting:'DOWNLOAD_PRIORITY_TIME'}
			        }).then((res) => { //成功   
			        	console.log(JSON.stringify(res));	
			        	_this.freeTimeId = res.data.id;
						_this.downTime = res.data.value;//显示下载时间
			        }).fail((err) => { //失败                         
			           
			        });
				}else{
					this.showFlag = false ;
					this.checkFlag = false ;
					_this.LonbonAjax({    	 
			          type: 'GET',
			          url: '/api/v1/setting/0',//为0  
			          data:{setting:'DOWNLOAD_PRIORITY_TIME'}
			        }).then((res) => { //成功   
			        	console.log(JSON.stringify(res));	
			        	_this.freeTimeId = res.data.id;						
			        }).fail((err) => { //失败                         
			           
			        });
				}
			}
        }).fail((err) => { //失败                         
           
        });
     },
     //保存下载设置
    saveDownStyle(){
    	let _this=this;
    	let postData=[];
    	//console.log(_this.freeDownId);
    	//console.log(_this.freeTimeId);
    	let data={id: _this.freeDownId};
    	let data2={id: _this.freeTimeId};
    	if(this.showFlag){
    		data.value='1';
    		if(_this.downTime){
    			data2.value = _this.downTime;
    		}else{
    			_this.$message({
		          message: this.$t('message.systemSet.selectWarning'),
		          type: 'warning'
		       });
		       return false;
    		}
    	}else{
    		data.value='0';
    		data2.value='';
    	}
    	
    	postData.push(data);
    	postData.push(data2);
    	_this.LonbonAjax({    	 
          type: 'POST',
          url: '/api/v1/setting',
          data: {values: JSON.stringify(postData) }
        }).then((res) => { //成功   
        	//console.log(JSON.stringify(res));			    			  	
			if(res.errorCode==200){					
				this.$message({
		          message: this.$t('message.systemSet.setSuccess'),
		          type: 'success'
		       });
			}						             
        }).fail((err) => {//失败              
           this.saving=false;
           this.$message({
	          message: this.$t('message.systemSet.saveFail'),
	          type: 'error'
	       });
        });
    },
    //审核开关
    changeAudit(e){    	
    	let _this=this;
    	let postData=[];
    	//alert(_this.auditId);
    	let data={id:_this.auditId};
    	if(e=='true'){
    		data.value='1'; 
    		_this.auditStatus = this.$t('message.systemSet.onFlag');
    	}else{
    		data.value='0'; 
    		_this.auditStatus = this.$t('message.systemSet.offFlag');
    	} 
    	
    	postData.push(data);
    	_this.LonbonAjax({    	 
          type: 'POST',
          url: '/api/v1/setting',
          data: {values: JSON.stringify(postData) }
        }).then((res) => { //成功   
        	console.log(JSON.stringify(res));			    			  	
			if(res.errorCode==200){				
				this.$message({
		          message: this.$t('message.systemSet.setSuccess'),
		          type: 'success'
		       });
			}else{
				if(e=='true'){					
		    		_this.auditSwitch = 'false';		    		
		    		_this.auditStatus = this.$t('message.systemSet.offFlag');
		    	}else{
		    		_this.auditSwitch = 'true';
		    		_this.auditStatus = this.$t('message.systemSet.onFlag');
		    	}
			}
        }).fail((err) => {//失败              
           if(e=='true'){
	    		_this.auditSwitch = 'false';
	    		_this.auditStatus = this.$t('message.systemSet.offFlag');
	    	}else{
	    		_this.auditSwitch = 'true';
	    		_this.auditStatus = this.$t('message.systemSet.onFlag');
	    	}
           this.$message({
	          message: this.$t('message.systemSet.saveFail'),
	          type: 'error'
	       });
        });
    },
     //获取审核设置
    getAudit(){
    	let _this=this;
    	_this.LonbonAjax({    	 
          type: 'GET',
          url: '/api/v1/setting/0', //为0 
          data:{setting:'AUDIT_SWITCH'}
        }).then((res) => { //成功   
        	//console.log(JSON.stringify(res));
        	if(res.errorCode==200){
        		_this.auditId = res.data.id;  //获取设置唯一id标识
				if(res.data.value=='1'){
					_this.auditShow=true;
					_this.auditSwitch = 'true';
					_this.auditStatus = this.$t('message.systemSet.onFlag');
				}else{
					_this.auditShow=true;
					_this.auditSwitch = 'false';
					_this.auditStatus = this.$t('message.systemSet.offFlag');
				}
			}
        }).fail((err) => { //失败                         
           
        });
     },
    //设备分配开关
    changeDevice(e){
    	let _this=this;
    	let postData=[];
    	//alert(_this.deviceId);
    	let data={id:_this.deviceId};
    	if(e=='true'){
    		data.value='1'; 
    		_this.deviceStatus = this.$t('message.systemSet.onFlag');
    	}else{
    		data.value='0'; 
    		_this.deviceStatus = this.$t('message.systemSet.offFlag');
    	} 
    	
    	postData.push(data);
    	_this.LonbonAjax({    	 
          type: 'POST',
          url: '/api/v1/setting',
          data: {values: JSON.stringify(postData) }
        }).then((res) => { //成功   
        	console.log(JSON.stringify(res));			    			  	
			if(res.errorCode==200){				
				this.$message({
		          message: this.$t('message.systemSet.setSuccess'),
		          type: 'success'
		       });
			}else{
				if(e=='true'){
		    		_this.deviceSwitch = 'false';
		    		_this.auditStatus = this.$t('message.systemSet.offFlag');
		    	}else{
		    		_this.deviceSwitch = 'true';
		    		_this.deviceStatus = this.$t('message.systemSet.onFlag');
		    	}
			}
        }).fail((err) => {//失败              
           if(e=='true'){
	    		_this.deviceSwitch = 'false';
	    		_this.deviceStatus = this.$t('message.systemSet.offFlag');
	    	}else{
	    		_this.deviceSwitch = 'true';
	    		_this.deviceStatus = this.$t('message.systemSet.onFlag');
	    	}
           this.$message({
	          message: this.$t('message.systemSet.saveFail'),
	          type: 'error'
	       });
        });
    },
      //获取设备分配设置
    getDevice(){
    	let _this=this;
    	_this.LonbonAjax({    	 
          type: 'GET',
          url: '/api/v1/setting/0', //为0 
          data:{setting:'DEVICE_SWITCH'},
        }).then((res) => { //成功   
        	//console.log(JSON.stringify(res));
        	if(res.errorCode==200){
        		_this.deviceId = res.data.id;  //获取设置唯一id标识
				if(res.data.value=='1'){
					_this.deviceShow=true;
					_this.deviceSwitch = 'true';
					_this.deviceStatus = this.$t('message.systemSet.onFlag');
				}else{
					_this.deviceShow=true;
					_this.deviceSwitch = 'false';
					_this.deviceStatus = this.$t('message.systemSet.offFlag');
				}
			}
        }).fail((err) => { //失败                         
           
        });
     },
    //任务编辑开关
    changeTask(e){
    	let _this=this;
    	let postData=[];
    	//alert(_this.taskId);
    	let data={id:_this.taskId};
    	if(e=='true'){
    		data.value='1'; 
    		_this.taskStatus = this.$t('message.systemSet.onFlag');
    	}else{
    		data.value='0'; 
    		_this.taskStatus = this.$t('message.systemSet.offFlag');
    	} 
    	
    	postData.push(data);
    	_this.LonbonAjax({    	 
          type: 'POST',
          url: '/api/v1/setting',
          data: {values: JSON.stringify(postData) }
        }).then((res) => { //成功   
        	console.log(JSON.stringify(res));			    			  	
			if(res.errorCode==200){				
				this.$message({
		          message: this.$t('message.systemSet.setSuccess'),
		          type: 'success'
		       });
			}else{
				if(e=='true'){
		    		_this.taskSwitch = 'false';
		    		_this.taskStatus = this.$t('message.systemSet.offFlag');
		    	}else{
		    		_this.taskSwitch = 'true';
		    		_this.taskStatus = this.$t('message.systemSet.onFlag');
		    	}
			}
        }).fail((err) => {//失败              
           if(e=='true'){
	    		_this.taskSwitch = 'false';
	    		_this.taskStatus = this.$t('message.systemSet.offFlag');
	    	}else{
	    		_this.taskSwitch = 'true';
	    		_this.taskStatus = this.$t('message.systemSet.onFlag');
	    	}
           this.$message({
	          message: this.$t('message.systemSet.saveFail'),
	          type: 'error'
	       });
        });
    },
      //获取任务编辑设置
    getTask(){
    	let _this=this;
    	_this.LonbonAjax({    	 
          type: 'GET',
          url: '/api/v1/setting/0', //为0 
          data:{setting:'TASK_SWITCH'}
        }).then((res) => { //成功   
        	console.log(JSON.stringify(res));
        	if(res.errorCode==200){
        		_this.taskId = res.data.id;  //获取设置唯一id标识
				if(res.data.value=='1'){
					_this.taskShow=true;
					_this.taskSwitch = 'true';
					_this.taskStatus = this.$t('message.systemSet.onFlag');
				}else{
					_this.taskShow=true;
					_this.taskSwitch = 'false';
					_this.taskStatus = this.$t('message.systemSet.offFlag');
				}
			}
        }).fail((err) => { //失败                         
           
        });
     },  
    },
    beforeCreate: function(){
    	console.log('555')
        	
    },
    created: function () {
        this.getChannel();
        this.getDownStyle();
        this.getAudit(); 
        this.getDevice();
        this.getTask();
    },
    
    beforeRouteEnter(to, from, next) {
      //传给父组建值

      next(vm => {
        vm.$emit('pageName', to.name)
      });


    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .sys-set{
  	width: 100%;
  	height: 100%;
  	background: #fff;
  	border-radius: 0.5em;
  	box-shadow: 0 5px 80px rgba(0, 0, 0, 0.1);
  	/*padding: 1.5em;*/
  	overflow-y: auto;
  }
  .basic-title{
  	font-size: 1.25em;
    font-weight: 700;
    color: #606266;
    margin-bottom: 0.5em;
    padding-left: 1.5em;
    padding-top: 0.8em;
  }
  /*.basic-content{
  	margin-bottom: 1.5em;
  }*/
  .basic-content span{
  	padding-left: 4.5em;
  	color: #898989;
  }
  .basic-lable{
  	padding-left: 4.5em;
  	color: #898989;
  }
  /*按钮样式*/
 .lonbon-btn{
 	  background-color: #18abbb;
    border-color: #18abbb;
    height: 2.3em;
    line-height: 0.2em;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
 }
 .item {
	padding:20px;
}
.item label{
	color: #9B9B9B;
	font-weight: normal;
}
#search-log{
	float: right;
}
/*button*/
.mybtn-primary{
	border: none;
	border-radius: 0.3em;
	color: white;
	background-color: #18abbb;
	padding: 0 1em;
	margin: 0 10px;
	height: 2em;
	min-width:7em;
	line-height: 2em;
	font-size: 1em !important;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}
.mybtn-primary:hover{
	background-color: #c6c6c6;
}
.my-input{
	  outline: none;
    border: 1px solid #e4e7ed;
    border-radius: 0.4em;
    height: 2em;
    text-indent: 12px;  
    width: 25em;
}
/*table*/
.table {
	position:relative;
	height:80%;
	margin-bottom:0;
}
.tabHeader {
	height:45px;
}
.head-table {
	width:100%;
}
.perfectScrollbar {
	height:-moz-calc()calc(100% - 45px);
	height:-webkit-calc()calc(100% - 45px);
	height:calc(100% - 45px);
	
}
.tab-footer {
    width: 100%;
    height: 10%;
    padding-top: 0.5em;
}

.tab-footer .totalCount {
    color: #828282;
    font-size: 1em;
    float: left;
}

.table thead {
  display: block;
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}
 .table thead td {  
  color: #1c1c1c;
}
.head-table tr{
	font-size: 1.125em !important;
    /*font-weight: bold !important;*/
    border: none !important;
}
 .table table tr {
   display: flex;
   width: 100%;    
	height: 3em;
	font-family: Microsoft YaHei;
	font-size: 1em;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #828282;
	border-bottom: 2px solid #D8DDDD;
}
 .table table tbody tr:nth-of-type(even) {
  /*background-color: #F1F3F6;*/
}
 .table table tbody tr:nth-of-type(odd) {
  /*background-color: #f7f7f9;*/
}
 .table table tbody tr:hover {
  background-color: #e6f3ff;
}
 .table table tbody tr.attr {
  background-color: #e6f3ff;
}
 .table table td {
  display: block;
  height: 45px;
  line-height: 45px;
  /*border: 1px solid #ffffff;*/
  text-indent: 0.5em;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.table table tr td:first-child {
	text-align: center;
}

 .table table td input {
  display: none;
}
 .table table td .table-label {
    display: inline-block;
    vertical-align: middle;
    margin-left: 2px;
    margin-bottom: 0;
    width: 20px;
    height: 20px;
    background: #ffffff;
    border: 1px solid #a5a5a5;
    border-radius: 3px;
    cursor:pointer;
}
 .table table td input[type=checkbox]:checked + label:after {
  opacity: 1;
  content: '';
  /*position: absolute;*/
  width: 15px;
  float: left;
  height: 8px;
  background: transparent;
  border: 3px solid #3880f1;
  border-top: none;
  border-right: none;
  transform: rotate(-56deg);
  margin-left: 2px;
  margin-top: 3px;
  box-shadow: none;
  text-shadow: none;
}
 .table table tbody td button {
  font-size: 1em;
  font-weight: normal;
  font-stretch: normal;
  background: none;
  border: none;
  color: #0f3bac;
  /*color: #1e6ac6;*/
}
 .table table tbody td button:focus {
  outline: none;
}
.time-select {
    width: 10em !important;
}
</style>
