<template>
  <div class="onlineUpdate br bx">
    <div class="item">
				<label>{{$t("message.systemSet.model")}}：</label>
		    <el-select v-model="defaultOption" filterable placeholder="请选择" @change='changeStyle'>
			    <el-option
			      v-for="item in options"
			      :key="item.deviceModel"
			      :label="item.deviceModel"
			      :value="item.deviceModel"			      
			      >
			     <i slot="suffix" class="el-select__caret el-input__icon el-icon-date"></i>
			    </el-option>
			  </el-select>
							        
         <el-button class="mybtn-primary" type="primary" id="search-log" @click = "batchUpdate">{{$t("message.systemSet.upgradeBtn")}}</el-button>
   	 </div>
   	 <!--列表-->
    <el-table :data="devices" class="my-table" @selection-change="selsChange" highlight-current-row v-loading="listLoading" height="77%" style="width: 100%;">
      <el-table-column type="selection" :selectable='checkboxInit'  style="width:5%;"></el-table-column>
      <el-table-column type="index" :index="indexMethod"  :label='$t("message.systemSet.orderNum")'  width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="display"    :label='$t("message.systemSet.deviceName")'  style="width: 20%;" ></el-table-column>
      <el-table-column show-overflow-tooltip prop="deviceModel"    :label='$t("message.systemSet.model")'  style="width: 15%;" ></el-table-column>
      <el-table-column prop="status" :label='$t("message.systemSet.deviceStatus")' style="width: 10%;" :formatter="formatStatu">
      	<template slot-scope="scope">
					<span class='offline' v-if='scope.row.status==0'>{{$t('message.systemSet.offLine')}}</span>
					<span v-else class='online'>{{$t('message.systemSet.onLine')}}</span>
				</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="suptUpgrade" :label='$t("message.systemSet.ifSupportUp")' :formatter="formatSup"  style="width: 10%;">
      	<template slot-scope="scope">
					<span class='offline' v-if='scope.row.suptUpgrade==0'>{{$t('message.systemSet.no')}}</span>
					<span v-else class='online'>{{$t('message.systemSet.yes')}}</span>
				</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="clientVersion" :label='$t("message.systemSet.version")'  style="width: 30%;"></el-table-column>
      <el-table-column  :label='$t("message.systemSet.action")'  style="width: 10%;">
      	<template slot-scope="scope">					
					<el-button class="single-del " type="text" size="small" :class="checkShow(scope.$index, scope.row)"  @click="handleUpdate(scope.$index, scope.row)" >{{$t("message.systemSet.upgradeBtn")}}</el-button>
				</template>
      </el-table-column>
    </el-table>
    <!--工具条-->
		<el-col :span="24" class="toolbar">			
			<el-pagination background  layout="total,sizes,prev, pager, next,jumper" 
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange" 
				:current-page="page"
				:page-sizes="[10,20,30, 50]" 
				:page-size="limit"  
				:total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		<!--升级界面-->
		<el-dialog
		  :title='$t("message.systemSet.dilogTile")'
		  :visible.sync="updateFormVisible"
		  width="30%"
		  center>		  		  
		  <el-row>
			  <el-col :span="6">
			  	<div style="min-height: 36px;" class="label-div">
			  	   <span style="width: 30%;"><i class="el-icon-star-on" style="color: red;"></i>{{$t("message.systemSet.onlinePackage")}}：</span>
			   </div></el-col>
			  <el-col :span="18">
			  	<div style="min-height: 36px;">
				  	<el-select v-model="defaultFile" filterable :placeholder='$t("message.systemSet.pleaseSelect")' @change='changeSelectFile' style="width: 100%;">
					    <el-option v-for="item in files" :key="item.fileName" :label="item.fileName" :value="item.id">
					     
					    </el-option>
					  </el-select>
				  </div>
			  </el-col>
			</el-row>
			<el-row style="margin: 5px 5px;">
			   <el-col :span="24"><div style="text-align: right;font-size: 0.6em;">{{$t("message.systemSet.warmText")}}</div></el-col>
			</el-row>
			<el-row>
			   <el-col :span="6"><div class="label-div"><i class="el-icon-star-on" style="color: red;"></i>{{$t("message.systemSet.localPackage")}}：</div></el-col>
			   <el-col :span="12"><div><input type="text" class="my-input-new" v-model="file_name"/></div></el-col>
			   
			   <el-col :span="6"><div>			   
	        <a class="mybtn-primary-new" href="#">
	                                                    {{$t("message.systemSet.scan")}}
	            <form >	                            
	                <input  id="file-path" type="file" name="file" @change="changefile"/>
	            </form>
	        </a>
	       </div></el-col>
			</el-row>
		  <span slot="footer" class="dialog-footer">	    
		    <el-button type="primary" @click="showProgress" class="mybtn-primary">{{$t("message.systemSet.confirmBtn")}}</el-button>
		    <el-button type="primary" @click="updateFormVisible = false" class="mybtn-primary">{{$t("message.systemSet.cancelBtn")}}</el-button>
		  </span>
		</el-dialog>
		<!--升级进度界面-->
		<el-dialog
		  title="设备升级"
		  :visible.sync="updateProgress"	
		  :show-close.sync="close_flag"
		  :close-on-click-modal.sync="flag"
		  width="30%"		  
		  center>
		  <span>
		  	<el-progress :text-inside="true" :stroke-width="18" :percentage="78" status="success">
		  		
		  	</el-progress>
		  </span>
		  <div style="text-align: center;">
		  	正在升级中,请稍后....
		  </div>
		  <span slot="footer" class="dialog-footer">
		    
		  </span>
		</el-dialog>
  </div>
</template>

<script>
  import {http} from "../../../api/config";
  import CryptoJS from 'crypto-js/crypto-js';
  /*import '../../../assets/css/common.css'*/
  var i = 0;	
  export default {
    name: 'onlineUpdate',
    data() {
      return {
      	filters: {
					startTime: '',
					endTime:''
				},
        listLoading: false,//进度过渡页
        devices: [],//表格数据
				total: 0,
				limit: 20,
				page: 1,				
				sels: [],//列表选中列      
				value1:'',				
				/*下拉测试*/
				options: [],
       defaultOption: '',      
       updateFormVisible: false,//升级界面是否显示
       updateProgress: false,
       close_flag:true,
       flag:false,       
       cur_deviceStyle:'' ,//当前所选设备类型
       file_name:this.$t("message.systemSet.pleaseSelect"),
       files:[],
       defaultFile: '',
       selectFileId:'',     
       updateDevice:'',
       fileData: {},//本地文件
       localFlag:false,  //本地&在线升级标志
       onlineFlag:false,
			
				
      }
    },
    methods: {
    	//切换页数
      handleCurrentChange(val) {
      	this.devices = [];
				this.page = val;
				this.getDeviceList();
			},
			//改变每页显示条数
			handleSizeChange(val) {
	      this.limit = val
	      this.getDeviceList();
	    },
	    selsChange(sels) {
	    	console.log(sels);
				this.sels = sels;
			},
			//序号初始化
			indexMethod(index){				
				index = (this.page - 1) * (this.limit) + index + 1
				return index;				
			},
			          
      
			//是否支持升级显示转换
			formatSup (row, column) {				
				return row.suptUpgrade == 1 ? this.$t('message.systemSet.yes') : row.suptUpgrade == 0 ? this.$t('message.systemSet.no') : '未知';
			},
			//在线状态显示转换
			formatStatu (row, column) {
				return row.status == 1 ? this.$t('message.systemSet.onLine') : row.status == 0 ? this.$t('message.systemSet.offLine') : '未知';
			},
			test(row, column){
				return 'online';
			},
			/*是否显示升级按钮*/
			checkShow (index, row){
				if(row.suptUpgrade != 1||row.status != 1){
					return "no-update-btn";
				}
			},
			//初始化checkbox
			checkboxInit(row,index){
	      if (row.suptUpgrade != 1||row.status != 1) {
	      	return 0;//不可勾选
	      }else if(row.suptUpgrade == 1&&row.status == 1){
	      	return 1;//可勾选
	      }
	        
	    },
			//点击单个升级
			handleUpdate(index, row) {
				this.updateFormVisible = true;//显示升级
				this.updateDevice = row.id ;//要升级的设备id
				let singleUpdate = row.id ;					
				console.log(singleUpdate);				
				 
			},
			
			
			//获取所有设备类型
			getDeviceType(){
				let _this = this;
        this.listLoading = true;
         _this.LonbonAjax({    	 
              type: 'GET',
              url: '/api/v1/deviceModel',              
            }).then((res) => { //成功            	              
							console.log(JSON.stringify(res));
							this.listLoading = false;
              this.options = res.data;
              //this.options.push({deviceModel: "全部"});
              if(this.options){
              	this.defaultOption = this.options[0].deviceModel;//默认选择第一个类型
              	this.cur_deviceStyle = this.options[0].deviceModel;
              	this.getDeviceList();
              }
              
            }).fail((err) => { //失败
               this.options=[];               
               this.listLoading = false;
            });
			},
			//切换设备类型
			changeStyle(val){
				this.cur_deviceStyle = val;
				/*if(val=="全部"){
					this.cur_deviceStyle = '';
				}*/
				this.getDeviceList();
			},
			//获取升级包
			getUpdateFile(){
				let _this = this;
        this.listLoading = true;       
         _this.LonbonAjax({    	 
              type: 'GET',
              url: '/api/v1/softwareUpgrade',              
            }).then((res) => { //成功            	              
							console.log(JSON.stringify(res));						
							this.listLoading = false;
              this.files = res.data;   
              this.files.push({id: "",fileName: this.$t("message.systemSet.pleaseSelect")});
            }).fail((err) => { //失败
               this.files=[];               
               this.listLoading = false;
            });
			},
			
			//选择升级包 获取id
			changeSelectFile(val){
				 //alert(val);
				if(val){
				 	 this.onlineFlag = true;
					 this.localFlag = false;
					 this.selectFileId = val;
					 this.file_name = this.$t("message.systemSet.pleaseSelect");  //将文件上传置为空
				}else{
					this.onlineFlag = false;
				}
				 
				 
			},
			//选择本地文件
			changefile(e){
				
        var _this = this
        let file = e.target.files[0];
        if(file){
        	//alert(file.name.indexOf(".lonbon"))
        	if(file.name.indexOf(".lonbon")>0){
	        	_this.fileData = file; 
	          this.file_name = file.name;
	          this.localFlag = true;
	          this.onlineFlag = false;
        	}else{
        		this.$message({
		          message: this.$t("message.systemSet.fileTypeWarning"),
		          type: 'warning'
		        });
        		return false;
        	}
        	
        }else{
        	 this.file_name = this.$t("message.systemSet.pleaseSelect");
        	 this.localFlag = false;
        }        
         this.selectFileId = ''  ;//在线文件包选择恢复默认“请选择”
         this.defaultFile = this.$t("message.systemSet.pleaseSelect");
         
         
      },
      //点击多个设备升级
      batchUpdate(){
      	
      	var ids = this.sels.map(item => item.id).toString();
      	console.log(ids);
      	if(!ids){
					this.$message({
	          message: this.$t('message.systemSet.noselectDevice'),
	          type: 'warning'
	        });
	        return false;
				}
      	this.updateFormVisible = true;//显示升级
      	this.updateDevice = ids;
      },
			//点击确定升级
			showProgress(){
				
				
				let _this = this;
				//this.updateProgress=true;//显示升级进度	          
				if(!(_this.localFlag||_this.onlineFlag)){
					_this.$message({//失败返回
            message: this.$t('message.systemSet.noUpStyle'),
            type: 'error',
            duration:1666
          });
          return false;
				}else{
					if(_this.localFlag){ //选择本地包上传升级
						console.log("本地包")
						this.onlocalUpdate();
					}
					if(_this.onlineFlag){
						//console.log("在线包")
						this.onlineUpdate();
					}
				}
        _this.updateFormVisible=false;	    
				
				
			},
			//选择在线升级
			onlineUpdate(){
				const upLoading = this.$loading({
          lock: true,
          text: this.$t('message.systemSet.upGradeLoading'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
       });				
				console.log(this.cur_deviceStyle+'----'+this.updateDevice);
				this.LonbonAjax({    	 
              type: 'POST',
              url: '/api/v1/softwareUpgrade', 
              data: {
              	package: this.selectFileId,
              	displayDeviceModel: this.cur_deviceStyle,
              	device:this.updateDevice
              } ,
              
            }).then((res) => { //成功            	              
							console.log(JSON.stringify(res));
							if(res.errorCode==200){
								this.$message({//
			            message: this.$t('message.systemSet.upgradeSuccess'),
			            type: 'success',
			            duration:1666
			          });
							}
							this.listLoading = false;
              upLoading.close();
            }).fail((err) => { //失败
               upLoading.close();         
               this.listLoading = false;
            });
			},
			//选择本地升级包升级
			onlocalUpdate(){
				const upLoading = this.$loading({
          lock: true,
          text: this.$t('message.systemSet.upGradeLoad'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       
				let _this=this;
				let param = new FormData();
	      let file = this.fileData;
	      param.append('file', file);
	      param.append("displayDeviceModel",this.cur_deviceStyle);	      
	      param.append("device",_this.updateDevice);
	      console.log(this.cur_deviceStyle+'....'+this.updateDevice);
	      var header = {};
				    var token = localStorage.getItem('token');
					  if (token) {
					       var type = 'POST';
					       var timestamp = Date.parse(new Date());
					       var hashkey = type + "," + "/api/v1/softwareUpgrade" + ",{" + timestamp + "}";
					       var sha256 = CryptoJS.HmacSHA256(hashkey, token).toString();
					       var word = CryptoJS.enc.Utf8.parse(sha256);
					       var auth = CryptoJS.enc.Base64.stringify(word);       
					
					    let Authorization=`Token token="${token}",timestamp="${timestamp}",auth="${auth}"`;
					      header = {
					        Authorization: Authorization
					    };    
					  }
            $.ajax({
					    url: window.localStorage["rootUrl"]+'/api/v1/softwareUpgrade',
					    type: 'POST',
					    data: param,
					    processData:false,
					    mimeType:"multipart/form-data",
					    timeout: 6000,
					    contentType: false,
					    dataType: "json",
					    cache: false,
					    headers: header,
					    success: function (res) {
					      console.log(JSON.stringify(res));
					      if(res.errorCode==200){
					      	_this.getUpdateFile();
									_this.$message({//失败返回
				            message: _this.$t('message.systemSet.upgradeSuccess'),
				            type: 'success',
				            duration:1666
				          });
								}
					      this.listLoading = false;
					      upLoading.close();
					      
					    },
					    error: function (err) {
					      _this.listLoading = false;
					      upLoading.close();
					      _thisthis.$message({
					        message: this.$t('message.systemSet.errorText'),
					        type: 'error'
					      })
					    }
					  });
			},
			//获取设备列表
      getDeviceList() { //获取数据
        let _this = this;
        this.listLoading = true;
      	 _this.LonbonAjax({    	 
              type: 'GET',
              url: '/api/v1/displayPartList',
              data:{
              	limit: this.limit,
              	page: this.page, 
              	deviceModel: this.cur_deviceStyle
              }
            }).then((res) => { //成功
            	//console.log(JSON.stringify(res));
              this.total = res.data.total;
							this.devices = res.data.data;
							this.listLoading = false;
              
            }).fail((err) => { //失败
               this.devices=[];
               this.total=0;
               this.listLoading = false;
            });
      },
      

    },

    created: function () {            

    },
    mounted() {
			//this.getDeviceList();
			this.getDeviceType();
			this.getUpdateFile();
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
  .onlineUpdate {
    /*background: #fff;
    width: 100%;
    height: 100%;
    padding: 32px 70px;
    overflow: scroll;
    position: relative;*/
    
    width: 100%;
  	height: 100%;
  	background: #fff;
  	border-radius: 0.5em;
  	box-shadow: 0 5px 80px rgba(0, 0, 0, 0.1);

  }

  .common_title_btn {
    display: inline-block;
    left: 0;
    bottom: 0;


  }

  .importentIcon {
    position: relative;
    margin-left: 30px;
  }

  .importentIcon::before {
    content: '';
    width: 14px;
    height: 14px;
    position: absolute;
    left: -24px;
    top: 50%;
    transform: translateY(-50%);
    background: url('../../../../static/images/importent.png');
  }

  .onlineUpdate_title {
    line-height: 86px;
    color: #636363;
    font-size: 22px;
    text-align: left;
  }

  .onlineUpdate_li {
    display: flex;
    align-items: center;
    line-height: 64px;
    height: 64px;
  }

  .title {
    height: 34px;
    line-height: 34px;
    margin-right: 40px;
  }

  .chooseBox {
    border: 1px solid #d2d2d2;
    height: 30px;
    line-height: 30px;
    border-radius: 18px;
    position: relative;
  }

  .time {
    margin: 0 20px;
    width: 216px;
  }

  

  .chooseBox.time::after {
    content: '';
    width: 22px;
    height: 22px;
    position: absolute;
    right: 6px;
    background: url('../../../../static/images/time.png');
    top: 50%;
    transform: translateY(-50%);
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
	padding:1.0em;
}
.item label{
	color: #3a3a3a;
	font-weight: normal;
}
#search-log{
	float: right;
}

.toolbar{
	    margin-top: 1em;
}

/*日期选择器*/
.el-input--prefix .el-input__inner{
	  outline: none;
    border: 1px solid #e4e7ed;
    border-radius: 0.4em;
    height: 2.25em;
    text-indent: 12px;
    width: 15.625em;
    background: url(../../../../static/images/date-icoin.png) no-repeat right 10px center !important;
    text-indent: 1em !important;
}
.el-date-editor {
    height: 100%;   
    
}

.no-update-btn{
	display: none;
}
.my-input-new{
	background: #ffffff;
	float: left;
	outline: none;
    border: 1px solid #e4e7ed;
    border-radius: 0.4em;
    height: 2.25em;
    text-indent: 12px;
    min-width: 15.625em;
    width: 100%;
    
    line-height: 0.25em;
    color: inherit;
}
.mybtn-primary-new{
	border: none;
	border-radius: 0.3em;
	color: white;
	background-color: #18abbb !important;
	padding: 0 1em;
	height: 2em;
	/*min-width:7em;*/
	line-height: 2em;
	font-size: 1em !important;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
	float: right;
	
}
.mybtn-primary-new:hover{
	background-color: #23b9c1 !important;
}
.mybtn-primary-new:active{
	background-color: #04a1a5 !important;
}
.label-div{
	float: right;
	line-height: 1.8em;
}
.file{
	  display: inline-block;
    position: relative;
    /* margin-right: 15%; */
    width: 50px;
    height: 2em;
    line-height: 2em;
    background-color: #1985ce;
    border-radius: 15px;
    text-align: center;
    color: #FFFFFF;
    font-size: 1em;
    /* float: right; */
}
.show-file-name-cis{
	height: 2em;
	width: 50%;
	border-radius: 1em !important;
	background: #ffffff;
	float: left;
	outline: none;
    border: 1px solid #e4e7ed;
    border-radius: 0.4em;
    height: 2.25em;
    text-indent: 12px;
    min-width: 15.625em;
    width: 100%;
    
    line-height: 0.25em;
    color: inherit;
}
#file-path{
	width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
}
  .online {
		color: #05b72b !important;
	}
	
	.offline {
		color:#ff0c0c !important;
	}
	
	.single-del{
	
	  border: none;
	color: #18abbb;
	font-size: 1em;
	background: none;
	padding-left: 0px;
	padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 0;
}
</style>
