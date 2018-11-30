<template>
	<div class="home">
		<div class="page-title" >{{$t("message.menu.home")}}</div>
		<div class="cards">
			<div class="card">
			  	<div class="card-body" id="mediaInfoPie">
			  		
			  	</div>
			  	<div class="card-foot">
			  		<el-row>
					  <el-col :span="5">{{$t("message.home.material.videos")}}：</el-col>
					  <el-col :span="6">{{mediaInfo.video.count}}{{$t("message.home.material.duan")}}</el-col>
					  <el-col :span="12">{{mediaInfo.video.sum}}{{mediaInfo.video.unit}}</el-col>
					</el-row>
					<el-row>
					  <el-col :span="5">{{$t("message.home.material.pictures")}}：</el-col>
					  <el-col :span="6">{{mediaInfo.image.count}}{{$t("message.home.material.zhang")}}</el-col>
					  <el-col :span="12">{{mediaInfo.image.sum}}{{mediaInfo.image.unit}}</el-col>
					</el-row>
					<el-row>
					  <el-col :span="5">{{$t("message.home.material.files")}}：</el-col>
					  <el-col :span="6">{{mediaInfo.text.count}}{{$t("message.home.material.fen")}}</el-col>
					  <el-col :span="12">{{mediaInfo.text.sum}}M</el-col>
					</el-row>
					<el-row>
					  <el-col :span="5">{{$t("message.home.material.others")}}：</el-col>
					  <el-col :span="6">{{mediaInfo.live.count}}{{$t("message.home.material.ge")}}</el-col>
					  <el-col :span="12">{{mediaInfo.live.sum}}M</el-col>
					</el-row>
					<el-row>
					  <el-col :span="5">{{$t("message.home.material.total")}}：</el-col>
					  <el-col :span="12" :offset="6">{{mediaInfo.mediaSum}}{{mediaInfo.mediaSumUnit}}</el-col>
					</el-row>
			  	</div>
		  	</div>
		  	
		  	<div class="card">
			  	<div class="card-body" id="displayInfoPie">
			  		
			  	</div>
			  	<div class="card-foot">
			  		<el-row>
					  <el-col :span="8">{{$t("message.home.device.active")}}：</el-col>
					  <el-col :span="12">{{displayInfo.activeCount}}/{{displayInfo.count}}</el-col>
					</el-row>
					<el-row>
					  <el-col :span="8">{{$t("message.home.device.free")}}：</el-col>
					  <el-col :span="12">{{displayInfo.freeCount}}/{{displayInfo.count}}</el-col>
					</el-row>
					<el-row>
					  <el-col :span="8">{{$t("message.home.device.off")}}：</el-col>
					  <el-col :span="12">{{displayInfo.offCount}}/{{displayInfo.count}}</el-col>
					</el-row>
			  	</div>
		  	</div>
		  	
		  	<div class="card">
			  	<div class="card-body" id="diskUsedPie">
			  		
			  	</div>
			  	<div class="card-foot">
			  		<el-row>
					  <el-col :span="8">{{$t("message.home.disk.used")}}：</el-col>
					  <el-col :span="12">{{spaceInfo.mUsed}}G/{{spaceInfo.mTotal}}G</el-col>
					</el-row>
			  	</div>
		  	</div>
		  	
		  	<div class="card">
			  	<div class="card-body" id="cpuUsedPie">
			  		
			  	</div>
			  	<div class="card-foot">
			  		<el-row>
					  <el-col :span="8">{{$t("message.home.cpu.used")}}：</el-col>
					  <el-col :span="12">{{spaceInfo.cpuPercent}}</el-col>
					</el-row>
			  	</div>
		  	</div>
		</div>
		<div class="foot">
			<label>{{$t("message.home.version.server")}}：</label> <span>{{spaceInfo.serverVersion}}</span>
			<!--<label>{{$t("message.home.version.web")}}：</label> <span>{{spaceInfo.webVersion}}</span>-->
		</div>
	</div>
</template>

<script>
	var Highcharts = require('highcharts');
	
	export default {
		name: 'home',
		data() {
			return {
				mediaInfo:{
					mediaSum: 0,
					mediaSumUnit: "M",
					video:{
						sum: 0,
						count: 0,
						unit: 'M'
					},
					image:{
						sum: 0,
						count: 0,
						unit: 'M'
					},
					text:{
						sum: 0,
						count: 0
					},
					live:{
						sum: 0,
						count: 0
					}
				},
				displayInfo:{
					count: 0,
				    offCount: 0,
				    activeCount: 0,
				    freeCount: 0
				},
				spaceInfo:{
					mUsed: 0,
					mTotal: 0,
					cpuPercent: 0,
					serverVersion: localStorage.packVersion,
					webVersion: localStorage.webVersion
				},
				mediaInfoChart: {
					model: null,
					options:{
						title:{
							text:this.$t('message.home.material.title'),
							align:"left",
							x: 10,
							y: 25,
							style:{
								"fontSize": "20px",
								"fontWeight": "bold",
						    }
						},
						subtitle: {
						    text: this.$t('message.home.material.subtitle'),
						    verticalAlign: "middle",
						    style:{
						    	"fontSize": "20px"
						    }
						},
						credits: {
							enabled: false
						},
						exporting: {
				            enabled:false
						},
						tooltip: {
							pointFormat: '<b>{point.percentage:.1f}%</b>'
						},
						plotOptions: {
							pie: {
								showInLegend: true,
								allowPointSelect: true,
								cursor: 'pointer'
							}
						},
						series: [{
							type: 'pie',
							dataLabels: {
								connectorWidth: 0,
								connectorPadding: -25,
								formatter: function() {
									if (this.percentage > 0){
										return this.percentage.toFixed(1) + ' %';
									}
								},
								style: {
									"fontSize": "12px"
								}
							},
							innerSize: '75%',
							size: '70%',
							data: []
						}]
					}
				},
				displayInfoChart: {
					model: null,
					options:{
						title:{
							text: this.$t('message.home.device.title'),
							align:"left",
							x: 10,
							y: 25,
							style:{
								"fontSize": "20px",
								"fontWeight": "bold",
						    }
						},
						subtitle: {
						    text: this.$t('message.home.device.subtitle'),
						    verticalAlign: "middle",
						    style:{
						    	"fontSize": "20px"
						    }
						},
						credits: {
							enabled: false
						},
						exporting: {
				            enabled:false
						},
						tooltip: {
							pointFormat: '<b>{point.percentage:.1f}%</b>'
						},
						plotOptions: {
							pie: {
								showInLegend: true,
								allowPointSelect: true,
								cursor: 'pointer'
							}
						},
						series: [{
							type: 'pie',
							dataLabels: {
								connectorWidth: 0,
								connectorPadding: -25,
								formatter: function() {
									if (this.percentage > 0){
										return this.percentage.toFixed(1) + ' %';
									}
								},
								style: {
									"fontSize": "14px"
								}
							},
							innerSize: '75%',
							size: '70%',
							data: []
						}]
					}
				},
				diskUsedChart: {
					model: null,
					options:{
						title:{
							text: this.$t('message.home.disk.title'),
							align:"left",
							x: 10,
							y: 25,
							style:{
								"fontSize": "20px",
								"fontWeight": "bold",
						    }
						},
						subtitle: {
						    text: this.$t('message.home.disk.subtitle'),
						    verticalAlign: "middle",
						    style:{
						    	"fontSize": "20px"
						    }
						},
						credits: {
							enabled: false
						},
						exporting: {
				            enabled:false
						},
						tooltip: {
							pointFormat: '<b>{point.percentage:.1f}%</b>'
						},
						plotOptions: {
							pie: {
								showInLegend: true,
								allowPointSelect: true,
								cursor: 'pointer'
							}
						},
						series: [{
							type: 'pie',
							dataLabels: {
								connectorWidth: 0,
								connectorPadding: -25,
								formatter: function() {
									if (this.percentage > 0){
										return this.percentage.toFixed(1) + ' %';
									}
								},
								style: {
									"fontSize": "14px"
								}
							},
							innerSize: '75%',
							size: '70%',
							data: []
						}]
					}
				},
				cpuUsedChart: {
					model: null,
					options:{
						title:{
							text: this.$t('message.home.cpu.title'),
							align:"left",
							x: 10,
							y: 25,
							style:{
								"fontSize": "20px",
								"fontWeight": "bold",
						    }
						},
						subtitle: {
						    text: this.$t('message.home.cpu.subtitle'),
						    verticalAlign: "middle",
						    style:{
						    	"fontSize": "20px"
						    }
						},
						credits: {
							enabled: false
						},
						exporting: {
				            enabled:false
						},
						tooltip: {
							pointFormat: '<b>{point.percentage:.1f}%</b>'
						},
						plotOptions: {
							pie: {
								showInLegend: true,
								allowPointSelect: true,
								cursor: 'pointer'
							}
						},
						series: [{
							type: 'pie',
							dataLabels: {
								connectorWidth: 0,
								connectorPadding: -25,
								formatter: function() {
									if (this.percentage > 0){
										return this.percentage.toFixed(1) + ' %';
									}
								},
								style: {
									"fontSize": "14px"
								}
							},
							innerSize: '75%',
							size: '70%',
							data: []
						}]
					}
				}
			}
		},
		methods: {
			//素材种类
			getMediaInfo(){
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/mediaInfo'
				}).then((res) => {
					var data = res.data;
					var mediaSum = 0;
					var mediaCount = 0;
					for(var i=0;i<data.length;i++){
						mediaSum += data[i].mediaSum;
						mediaCount += data[i].mediaCount;
					}
					_this.mediaInfoChart.options.series[0].data = [];
					let flag = false; //用于判断该环形图是否有数据
					let seriesData = [];
					for(var i=0;i<data.length;i++){
						var mediaInfo = data[i];
						console.log(mediaInfo)
						var itemJson = {};
						itemJson.count = mediaInfo.mediaCount,
						itemJson.y = Math.round(mediaInfo.mediaCount / mediaCount * 10000) / 100.00
						if(mediaInfo.type == 'video'){
							this.mediaInfo.video.count = mediaInfo.mediaCount;
							let videoSum = (mediaInfo.mediaSum/1024)/1024;
							if(videoSum>1024){
								videoSum = videoSum/1024;
								this.mediaInfo.video.unit = 'G';
							}
							this.mediaInfo.video.sum = videoSum.toFixed(1);
							itemJson.name = this.$t('message.home.material.videos');
							itemJson.color = "#26ACEB";
							seriesData[0] = itemJson;
						}else if(mediaInfo.type == 'image'){
							this.mediaInfo.image.count = mediaInfo.mediaCount;
							let imageSum = (mediaInfo.mediaSum/1024)/1024;
							if(imageSum>1024){
								imageSum = imageSum/1024;
								this.mediaInfo.image.unit = 'G';
							}
							this.mediaInfo.image.sum = imageSum.toFixed(1);
							itemJson.name = this.$t('message.home.material.pictures');
							itemJson.color = "#FBC620";
							seriesData[1] = itemJson;
						}else if(mediaInfo.type == 'text'){
							this.mediaInfo.text.count = mediaInfo.mediaCount;
							this.mediaInfo.text.sum = ((mediaInfo.mediaSum/1024)/1024).toFixed(1);
							itemJson.name = this.$t('message.home.material.files');
							itemJson.color = "#8BE32D";
							seriesData[2] = itemJson;
						}else if(mediaInfo.type == 'live'){
							this.mediaInfo.live.count = mediaInfo.mediaCount;
							this.mediaInfo.live.sum = ((mediaInfo.mediaSum/1024)/1024).toFixed(1);
							itemJson.name = this.$t('message.home.material.others');
							itemJson.color = "#C3C3C1";
							seriesData[3] = itemJson;
						}
						//向环形图中写入数据
//						itemJson.count = mediaInfo.mediaSum,
//						itemJson.y = Math.round(mediaInfo.mediaSum / mediaSum * 10000) / 100.00
						if(mediaInfo.mediaSum > 0){
							flag = true;
						}
					}
					_this.mediaInfoChart.options.series[0].data = seriesData;
					mediaSum = (mediaSum/1024)/1024;
					if(mediaSum>1024){
						mediaSum = mediaSum/1024;
						this.mediaInfo.mediaSumUnit = 'G';
					}
					this.mediaInfo.mediaSum = mediaSum.toFixed(1);
					//制作环形图
					_this.mediaInfoChart.model = Highcharts.chart('mediaInfoPie', _this.mediaInfoChart.options);
					//将环形图的副标题替换为“无数据统计”
					if(!flag){
						_this.mediaInfoChart.model.subtitle.update({
							text: this.$t('message.home.nodata')
						});
					}
				}).fail((err) => {
					console.log(err);
				});
			},
			//设备状态
			getDisplayInfo(){
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/displayInfo'
				}).then((res) => {
					var data = res.data;
					console.log(data)
					this.displayInfo = data;
					//向环形图中写入数据
					var count = data.count;
					_this.displayInfoChart.options.series[0].data = [];
					_this.displayInfoChart.options.series[0].data.push({
						name: this.$t('message.home.device.active'),
						count: count,
						y: Math.round(data.activeCount / count * 10000) / 100.00,
						color: "#FBC620"
					});
					_this.displayInfoChart.options.series[0].data.push({
						name: this.$t('message.home.device.free'),
						count: count,
						y: Math.round(data.freeCount / count * 10000) / 100.00,
						color: "#26ACEB"
					});
					_this.displayInfoChart.options.series[0].data.push({
						name: this.$t('message.home.device.off'),
						count: count,
						y: Math.round(data.offCount / count * 10000) / 100.00,
						color: "#C3C3C1"
					});
					//制作环形图
					_this.displayInfoChart.model = Highcharts.chart('displayInfoPie', _this.displayInfoChart.options);
				}).fail((err) => {
					console.log(err);
				});
			},
			//磁盘使用和CPU使用
			getSpaceSize(){
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/spaceSize'
				}).then((res) => {
					var data = res.data;
					console.log(data)
					//--磁盘使用--
					//总空间
					var mTotal = data.mTotal;
					//已用空间
					var mUsed = data.mUsed;
					//可用空间
					var unUsed = mTotal - mUsed;
					//已使用CPU
					var usedCpu = data.cpu.percent;
					//服务器版本号
					var uptime = data.uptime;
					this.spaceInfo.mUsed = mUsed;
					this.spaceInfo.mTotal = mTotal;
					this.spaceInfo.cpuPercent = usedCpu;
					_this.diskUsedChart.options.series[0].data = [];
					_this.diskUsedChart.options.series[0].data.push({
						name: this.$t('message.home.disk.used'),
						count: mUsed,
						y: Math.round(mUsed / mTotal * 10000) / 100.00,
						color: "#26ACEB"
					});
					_this.diskUsedChart.options.series[0].data.push({
						name: this.$t('message.home.disk.available'),
						count: unUsed,
						y: Math.round(unUsed / mTotal * 10000) / 100.00,
						color: "#C3C3C1"
					});
					//制作环形图
					_this.diskUsedChart.model = Highcharts.chart('diskUsedPie', _this.diskUsedChart.options);
					
					//--CPU使用--
					//已使用CPU
					var usedCpuNum = usedCpu.substring(0, usedCpu.length-1);
					//未使用CPU
					var unUsedCpuNum = 100-usedCpuNum;
					_this.cpuUsedChart.options.series[0].data = [];
					_this.cpuUsedChart.options.series[0].data.push({
						name: this.$t('message.home.cpu.used'),
						count: parseInt(usedCpuNum),
						y: parseInt(usedCpuNum),
						color: "#FBC620"
					});
					_this.cpuUsedChart.options.series[0].data.push({
						name: this.$t('message.home.cpu.unused'),
						count: parseInt(unUsedCpuNum),
						y: parseInt(unUsedCpuNum),
						color: "#C3C3C1"
					});
					//制作环形图
					_this.cpuUsedChart.model = Highcharts.chart('cpuUsedPie', _this.cpuUsedChart.options);
				}).fail((err) => {
					console.log(err);
				});
			},
		    getLang(){   
		        this.$i18n.locale = window.localStorage['current_lan'];
		        this.$i18n.mergeLocaleMessage('en', window.localStorage['current_lan'])
		    },
		     
		    
		},
		created() {
			this.getLang();
			this.getMediaInfo();
			this.getDisplayInfo();
			this.getSpaceSize();
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$emit('pageName', to.name)
			})
		}
	}
</script>

<style scoped>
	.home{
		width: 100%;
		height: 100%;
	}
	.foot{
		width: 100%;
		height: 5%;
		text-align: right;
	}
	.foot span{
		margin-right: 2%;
	}
	.cards{
		height: 88.2%;
		margin: 0 0.8em;
		padding-top: 3.5em;
	}
	.cards .card{
		width: 23%;
		height: 96%;
		margin:0% 1% 1% 1%; 
		float: left;
		background-color: white;
		border-radius: 0.5em;
	}
	.card-body{
		height: 70%;
	}
	.card-foot{
		width: 80%;
		margin: 0 auto;
		margin-top: 5%;
	}
	.card-foot .el-row {
	    margin-bottom: 1em;
	}
	.card-foot .el-row .el-col {
		text-align: right;
  	}
  	.highcharts-container {
  		border-radius: 0.5em !important;
  	}
</style>