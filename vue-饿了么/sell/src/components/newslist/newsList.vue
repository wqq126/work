<template>
	<div class="page-loadmore" v-loading="loading" >
		<news-tips></news-tips>
		<div class="page-loadmore-wrapper"  @scroll='list_scroll($event)' ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
			<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="loadmore">
				<ul class="page-loadmore-list">
					<router-link v-for="(item,index) in list" v-if="item.digest!='#' && item.imgsrc!=''" :to="{path:'/homedetail',query:{docid:item.docid}}">
						<li  class="page-loadmore-listitem" >
							<h4>{{item.title}}</h4>
							<div  class="mycard clearfix">
								<img :src="item.imgsrc" alt="暂无">
								<div class="mycard-contain">
									<div class="digest">{{item.digest}}</div>
									<div class="card-tip">
										<span>{{item.source}}</span>
									</div>
								</div>
							</div>
						</li>
					</router-link>
				</ul>
				<div slot="top" class="mint-loadmore-top">
					<span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
					<span v-show="topStatus === 'loading'">
						<mt-spinner type="snake"></mt-spinner>
					</span>
				</div>
				<div slot="bottom" class="mint-loadmore-bottom">
					<span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
					<span v-show="bottomStatus === 'loading'">
						<mt-spinner type="snake"></mt-spinner>
					</span>
				</div>
			</mt-loadmore>
		</div>
	</div>
</template>
<script type="text/babel">
	import { MessageBox } from 'mint-ui';
	import newsTips from '../newstips/newsTips'
	export default {
		components: {
			newsTips,
		},
    data() {
      return {
				loading:true,
				tid:'T1348647853363',
				start_num: 0,
				end_num: 20,
        list: [],
        allLoaded: false,
        wrapperHeight: 0,
        topStatus: '',
				bottomStatus:'',
				scrollTop:'',
      };
    },
		beforeRouteEnter(to,form,next){
			if(form.name=='homedetail'){
				to.meta.isBack = true;
				
				// to.meta.scroll = this.scrollTop;
			}
			next();
		},
    methods: {
			list_scroll(ev){
				this.scrollTop = $('.page-loadmore-wrapper')[0].scrollTop;
			},
			//获取列表
			get_list(active) {
				var _this = this;
				var ajax_list_url = 'nc/article/headline/'+_this.tid+'/'+ _this.start_num + '-' + _this.end_num + '.html';
				_this.$api.get(ajax_list_url).then(function(res){
					_this.loading = false;
					if(res.data){
						var data = res.data[_this.tid];
						data.shift();
						 _this.list = _this.list.concat(data);
						 if(active=='more'){
							 _this.$refs.loadmore.onBottomLoaded();
						 }else{
							 _this.$refs.loadmore.onTopLoaded();
						 }
					}
				}).catch(function(res){
					MessageBox.confirm('网络开小差了，请重试?').then(action => {
						_this.get_detail();
					});
					_this.loading = false;
					if(active=='more'){
						_this.$refs.loadmore.onBottomLoaded();
					}else{
						_this.$refs.loadmore.onTopLoaded();
					}
				})
			},
			//加载更多
      loadBottom(id) {
				var size = this.end_num - this.start_num; 
				this.start_num = this.start_num+size;
				this.end_num = this.end_num+size;
				this.get_list('more');
      },
			//刷新
      loadTop() {
        this.start_num = 0;
				this.end_num = 10;
				this.get_list();
      },
		},
		//检测路由变化刷新列表
		watch:{
			'$route':function(to,form){
				if(form.name!='homedetail' && to.name!='homedetail'){
					this.loading = true;
					this.tid = to.query.tid;
					this.list = [];
					this.get_list();
				}
			}
			
		},
		activated(){
			if(!this.$route.meta.isBack){
				if(this.$route.query.tid){
						this.tid = this.$route.query.tid;
				}
				this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 70;
				this.get_list();
			}else{
				this.$route.meta.isBack=false;
				$('.page-loadmore-wrapper')[0].scrollTop = this.scrollTop;
			}
			
		},
  };
</script>

<style scoped="scoped">
	.loading-background,
	.mint-loadmore-top span {
		-webkit-transition: .2s linear;
		transition: .2s linear
	}

	.mint-loadmore-top span {
		display: inline-block;
		vertical-align: middle
	}

	.mint-loadmore-top span.is-rotate {
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg)
	}

	.page-loadmore .mint-spinner {
		display: inline-block;
		vertical-align: middle
	}

	.page-loadmore-desc {
		text-align: center;
		color: #666;
		padding-bottom: 5px
	}

	.page-loadmore-desc:last-of-type,
	.page-loadmore-listitem {
		border-bottom: 1px solid #eee
	}
	.page-loadmore-list a{
		color: #828282;
		text-decoration: none;
	}
	.page-loadmore-list {
		padding: 0;
		margin: 0;
	}

	.page-loadmore-listitem {
		height: 100px;
		text-align: center;
		margin-top: 10px;
	}

	.page-loadmore-listitem:first-child {
		border-top: 1px solid #eee
	}

	.page-loadmore-wrapper {
		overflow: scroll
	}

	.mint-loadmore-bottom span {
		display: inline-block;
		-webkit-transition: .2s linear;
		transition: .2s linear;
		vertical-align: middle
	}

	.mint-loadmore-bottom span.is-rotate {
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg)
	}
	.page-loadmore-listitem h4 {
		margin: 0 0 10px 0;
		padding: 0;
		text-align: left;
		text-indent: 10px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #000000;
	}
	.mycard{
		padding: 0 10px;
	}
	.mycard img{
		box-sizing: border-box;
		float: left;
		width: 20%;
		height: 50px;
	}
	.mycard-contain{
		float: right;
		width: 80%;
	}
	.digest{
		overflow: hidden;
		margin-bottom: 20px;
		text-indent: 2rem;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.card-tip{
		padding-right: 2rem;
		text-align: right;
	}
</style>
