<template>
  <div class="workLog br bx">
    <div class="item">
				<label>{{$t("message.systemSet.timeSlot")}}：</label>
				<!--<input type="text" class="my-input"  id="start-time" v-model="filters.startTime"  placeholder="开始日期"/>-->
				<el-date-picker
		      v-model="filters.startTime"
		      type="datetime" :placeholder="inputInert" value-format="timestamp"
		      prefix-icon="none"
		      >
		      
		    </el-date-picker>
				<label >~</label>
				<!--<input type="text" class="my-input"  id="end-time" v-model="filters.endTime" placeholder='结束日期'/>-->
				<el-date-picker
		      v-model="filters.endTime"
		      type="datetime"		      
		      :placeholder="inputInert2"
		      value-format="timestamp"
		      prefix-icon="none"
		      
		    >
		    </el-date-picker>
				 <el-button class="mybtn-primary" type="primary" id="search-log" @click="batchRemove">{{$t("message.systemSet.deletBtn")}}</el-button>
         <el-button class="mybtn-primary" type="primary" id="search-log" v-on:click="getLog" >{{$t("message.systemSet.updateBtn")}}</el-button>
         <el-button class="mybtn-primary" type="primary" id="search-log" v-on:click="downLog">{{$t("message.systemSet.exportBtn")}}</el-button>        
         <el-button class="mybtn-primary" type="primary"  v-on:click="searchLog">{{$t("message.systemSet.searchBtn")}}</el-button>
   	 </div>
   	 <!--列表-->
    <el-table :data="logs" class="my-table" @sort-change="sortChange"  @selection-change="selsChange" highlight-current-row v-loading="listLoading" height="77%" style="width: 100%; ">
      <el-table-column type="selection"  style="width:5%;"></el-table-column>
      <!--<el-table-column type="index" label=" 序号 " width="100"></el-table-column>-->
      <el-table-column type="index" :index="indexMethod"  :label='$t("message.systemSet.orderNum")'  width="100"></el-table-column>
      <el-table-column prop="desc"    :label='$t("message.systemSet.actionDetail")' show-overflow-tooltip style="width: 30%;" ></el-table-column>
      <el-table-column prop="userName"    :label='$t("message.systemSet.userName")'  style="width: 10%;" ></el-table-column>
      <el-table-column prop="userAddress" :label='$t("message.systemSet.loginIp")' style="width: 20%;"></el-table-column>
      <el-table-column prop="createTime" :label='$t("message.systemSet.time")'  style="width: 20%;" sortable="custom"></el-table-column>
      <el-table-column  :label='$t("message.systemSet.action")'  style="width: 10%;">
      	<template slot-scope="scope">					
					<el-button class="single-del" type="text"  size="small" @click="handleDel(scope.$index, scope.row)">{{$t("message.systemSet.singleDel")}}</el-button>
				</template>
      </el-table-column>
      <div slot="empty">
				<p :style="{'marginTop': '23px'}">{{emptyData}}</p>
			</div>
    </el-table>
    <!--工具条-->
		<el-col :span="24" class="toolbar">			
			<el-pagination background  layout="total,sizes,prev, pager, next,jumper" 
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange" 
				:page-sizes="[10,20,30, 50]" 
				:page-size="limit" 
				:current-page="page"
				:total="total" style="float:right;">
			</el-pagination>
		</el-col>
  </div>
</template>

<script>
  import {http} from "../../../api/config";
  import '../../../assets/css/common.css' 
  var i = 0;
  export default {
    name: 'workLog',
    data() {
      return {
      	inputInert:this.$t('message.systemSet.startDate'),
      	inputInert2:this.$t('message.systemSet.endDate'),
      	filters: {
					startTime: '',
					endTime:''
				},
				start:'',
				end:'',
        listLoading: false,//进度过渡页
        searchLoading:false,//搜索按钮加载
        refleshLoading:false,//刷新按钮加载
        logs: [],//表格数据
				total: 0,
				limit: 20,
				page: 1,				
				sels: [],//列表选中列      
				value1:'',
				number_index: 1,
				sort:"desc",
				emptyData: this.$t("message.releaseManage.empty_data"),
      }
    },
    methods: {
      change: function (e) {
        // console.log(e)
      },
      handleCurrentChange(val) {
      	this.emptyData = '';
      	this.logs = [];
				this.page = val;
				this.getLog();
			},
			handleSizeChange(val) {
	      this.limit = val
	      this.getLog();
	    },
	    selsChange(sels) {
	    	console.log(sels);
				this.sels = sels;
			},
			indexMethod(index){				
				index = (this.page - 1) * (this.limit) + index + 1
				return index;				
			},
//			/*导出表格*/
//			handleDownload() {
//	      this.listLoading = true;
//	      this.searchLoading = true;
//	      this.refleshLoading = true;
//	      import('@/vendor/Export2Excel').then(excel => {
//	        const tHeader = [this.$t("message.systemSet.actionDetail"), this.$t("message.systemSet.userName"), this.$t("message.systemSet.loginIp"), this.$t("message.systemSet.time")]
//	        const filterVal = ['desc', 'userName', 'userAddress', 'createTime']
//	        const data = this.formatJson(filterVal, this.logs)
//	        excel.export_json_to_excel({
//	          header: tHeader,
//	          data,
//	          filename: 'control-logs'
//	        })
//	        this.listLoading = false;
//	        this.searchLoading = false;
//	        this.refleshLoading = false;
//	      })
//	    },
	    //导出日志
      downLog() {
      	//alert();
      	this.listLoading = true;
        this.LonbonAjax({    	 
	          type: 'GET',
	          url: '/api/v1/logDownload',
	          data: {}
	        }).then((res) => { //成功   
			        	//console.log(JSON.stringify(res));			    			  	
						if(res.errorCode==200){					
							window.location.href = res.data;
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
	    formatJson(filterVal, jsonData) {
	      return jsonData.map(v => filterVal.map(j => {
	        if (j === 'timestamp') {
	          return parseTime(v[j])
	        } else {
	          return v[j]
	        }
	      }))
	    },
			//删除
			handleDel(index, row) {
				this.$confirm(this.$t('message.systemSet.delConfirm'),  {
					type: 'warning',
					
				}).then(() => {
					this.listLoading = true;	
					this.searchLoading = true;
					this.refleshLoading = true;
					let singleDel = { logId: row.id };					
					console.log(singleDel);
					this.LonbonAjax({    	 
              type: 'POST',
              url: '/api/v1/actionLog',
              data: singleDel
            }).then((res) => { //成功            	              
							this.listLoading = false;
							this.searchLoading = false;
							this.refleshLoading = false;
              this.$message({
			          message: this.$t('message.systemSet.delSuccess'),
			          type: 'success'
			       });
			       this.getLog();
            }).fail((err) => { //失败              
               this.listLoading = false;
               this.searchLoading = false;
               this.refleshLoading = false;
               this.$message({
			          message: this.$t('message.systemSet.delFail'),
			          type: 'error'
			       });
            });
				}).catch(() => {

				});
			},
			//批量删除
			batchRemove() {
				var ids = this.sels.map(item => item.id).toString();
				if(!ids){
					this.$message({
	          message: this.$t('message.systemSet.noSelect'),
	          type: 'warning'
	        });
	        return false;
				}
				this.$confirm(this.$t('message.systemSet.delConfirm'),  {
					type: 'warning'
				}).then(() => {					
					let delArray = { logId: ids };
					console.log(delArray);
					this.LonbonAjax({    	 
              type: 'POST',
              url: '/api/v1/actionLog',
              data: delArray
            }).then((res) => { //成功            	              
							this.listLoading = false;
							this.searchLoading = false;
							this.refleshLoading = false;
              this.$message({
			          message: this.$t('message.systemSet.delSuccess'),
			          type: 'success'
			       });
			       this.getLog();
            }).fail((err) => { //失败              
               this.listLoading = false;
               this.searchLoading = false;
               this.refleshLoading = false;
               this.$message({
			          message: this.$t('message.systemSet.delFail'),
			          type: 'error'
			       });
            });
				}).catch(() => {

				});
			},
			//时间排序
			sortChange( column, prop, order ){
				let _this = this;
				//console.log(column);
				if(column.order=="ascending"){
					 this.sort = "asc";					 
				}else{
					 this.sort = "desc";
				}
				_this.getLog();
			},
			searchLog(){
				let _this = this;
				_this.page = 1;
				//点击搜索时才可以把搜索条件赋值
				 _this.start = this.filters.startTime;        
         _this.end = this.filters.endTime; 
				_this.getLog();
			},
      getLog() { //获取数据
        let _this = this;
        this.listLoading = true;
        this.searchLoading = true;
        this.refleshLoading = true;
        let start_time = this.start;        
        let end_time =this.end; 
        _this.filters.startTime = this.start;        
        _this.filters.endTime =this.end; 
        if(start_time) {					  
					  start_time = start_time / 1000;					  
				}
				if(end_time) {					
					end_time = end_time / 1000;
					
				}
				if(start_time && end_time) {
					if(end_time <= start_time) {														
						this.$message({
		          message: this.$t('message.systemSet.endStart'),
		          type: 'warning'
		       });
		      
		       this.listLoading = false;
		       this.searchLoading = false;
		       this.refleshLoading = false;
						return false;
					}
				}
      	 _this.LonbonAjax({    	 
              type: 'GET',
              url: '/api/v1/actionLog',
              data:{
              	limit: this.limit,
              	page: this.page,
              	timeStart: start_time,
              	timeEnd: end_time,
              	timeOrder: this.sort,
              }
            }).then((res) => { //成功
            	
              this.total = res.data.total;
							this.logs = res.data.data;
							this.listLoading = false;
							this.searchLoading = false;
							this.refleshLoading = false;
              
            }).fail((err) => { //失败
            	_this.emptyData = _this.$t("message.releaseManage.empty_data");
               this.logs=[];
               this.total=0;
               this.listLoading = false;
               this.searchLoading = false;
               this.refleshLoading = false;
            });
      },
      
      //更改当前语言
      getLang(){   
      	//alert(window.localStorage['current_lan'])
         this.$i18n.locale = window.localStorage['current_lan'];
         this.$i18n.mergeLocaleMessage('en', window.localStorage['current_lan'])
      }
      

    },

    created: function () {            

    },
    mounted() {
    	this.getLang();
			this.getLog();			
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
  .workLog {
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

  .workLog_title {
    line-height: 86px;
    color: #636363;
    font-size: 22px;
    text-align: left;
  }

  .workLog_li {
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
/*td .el-button--small {
		border: none;
		color: #18abbb;
		font-size: 1em;
		background: none;
		padding-left: 0px;
		padding-top: 0px;
		padding-bottom: 0px;
	}*/
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

</style>
