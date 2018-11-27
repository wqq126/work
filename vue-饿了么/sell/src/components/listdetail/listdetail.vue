<template>
	<div class="listDetail" v-loading="loading">
		<h2 class="detail-title">{{detail.title}}</h2>
		<p>{{detail.dkeys}}</p>
		<div class="detail-body" v-html="detail.body">
			
		</div>
		<div class="detail-source">{{detail.source}}&nbsp;&nbsp;&nbsp;{{detail.ec}}</div>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	export default {
		name:'listDetail',
		data() {
			return {
					loading:true,
					detail:{}
			};
		},
		activated(){
			this.detail = {};
			this.loading = true;
			this.get_detail();
		},
		methods: {
			get_detail() {
				var _this = this;
				var ajax_url = 'nc/article/'+_this.$route.query.docid+'/full.html';
				_this.$api.get(ajax_url).then(function(res){
				_this.loading = false;	
				var data = res.data[_this.$route.query.docid];
				var reg = /<!--IMG#\d+-->/g;
				var i= 0;
				data.body = data.body.replace(reg,function(a){
					var result = "<img width='100%' src="+data.img[i].src+" />"
					i++;
					return result;
				})
				_this.detail = data;
				}).catch(function(res){
					_this.loading = false;
					MessageBox.confirm('网络开小差了，请重试?').then(action => {
						_this.get_detail();
					});
				})
			}
		},
	}
</script>

<style scoped="scoped">
	.listDetail{
		overflow: scroll;
		padding-bottom: 10px;
		height: calc(100% - 80px);
	}
	.detail-title{
		white-space: nowrap;
		overflow: hidden;
		width: 100%;
		text-overflow: ellipsis;
		padding: 0;
		margin: 0;
		text-align: left;
		text-indent: 10px;
	}
	.detail-body{
		box-sizing: border-box;
		padding: 0 10px;
		width: 100%;
		overflow: hidden;
	}
	.detail-body img{
		width: 100px !important;
		height: auto;
	}
	.detail-source{
		text-align: right;
		color: #828282;
		padding-right: 10px;
	}
</style>
