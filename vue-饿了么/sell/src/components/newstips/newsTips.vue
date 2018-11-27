<template>
	<el-menu :default-active="activeIndex" class="el-menu-demo">
		<el-menu-item @click='enter_tip($event)' v-for=" (item,index) in newstips" :index="index+''">
			<router-link :to="{path:'/',query:{tid:item.tid}}">
				{{item.tname}}
			</router-link>
		</el-menu-item>
	</el-menu>
</template>

<script>
	export default {
		name: 'newstips',
		data() {
			return {
				activeIndex:'',
				newstips: [],
				tid: '',
			};
		},
		watch:{
			'$route':function(to,from){
				var _this = this;
				_this.tid = to.query.tid;
				_this.router_change();
			}
		},
		mounted() {
			var _this = this;
			_this.tid = _this.$route.query.tid;
			_this.$api.get('nc/topicset/ios/subscribe/manage/listspecial.html').then((res) => {
				_this.newstips = res.data.tList;
				_this.router_change();	
			})
		},
		methods: {
			enter_tip(ev){
				var offsetLeft = ev.$el.offsetLeft;
				var pageLeft = $(ev.$el).offset().left;
				var halfScreen = $('html').width()/2;
				if(pageLeft>halfScreen){
					$(ev.$el).parent()[0].scrollLeft = $(ev.$el).parent()[0].scrollLeft + pageLeft - halfScreen;
				}else{
					$(ev.$el).parent()[0].scrollLeft = $(ev.$el).parent()[0].scrollLeft - pageLeft - halfScreen;
				}
			},
			router_change(){
				var _this = this;
				_this.newstips.forEach((item,index)=>{
					if(item.tid==_this.tid){
						_this.activeIndex = index+'';
					}
				})
			}
		}

	}
</script>

<style scoped="scoped">
	.newstips {
		white-space: nowrap;
		width: 100%;
		overflow: scroll;
		padding-right: 20px;
		box-sizing: border-box;
	}
	a {
		color: darkgray;
		text-decoration: none;
	}
	.el-menu{
		white-space: nowrap !important;
		overflow-x: scroll;
		overflow-y: hidden;
		height: 30px;
		margin: 0 !important;
	}
	.el-menu-item{
		display: inline-block !important;
		padding: 0 10px !important;
		line-height: 30px;
		height: 30px;
	}
	.is-active a{
		color: #409EFF !important;
	}
</style>
