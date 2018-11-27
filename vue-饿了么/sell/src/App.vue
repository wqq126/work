<template>
  <div id="app">
		<!-- 头部 -->
		<mt-header title="独家新闻">
			<mt-button @click='go_back' slot="left" icon="back">返回</mt-button>
		</mt-header>
		<keep-alive>
		<router-view/>
		</keep-alive>
		<!-- 底部导航 -->
		<mt-tabbar class='my-nav'>
			<router-link to='/' class='mint-tab-item' id="首页">
				<i class="icon iconfont icon-index"></i>
			</router-link>
			<router-link to='/' class='mint-tab-item' id="热点">
				<i class="icon iconfont icon-redian"></i>
			</router-link>
			<router-link to='/' class='mint-tab-item' id="直播">
				<i class="icon iconfont icon-lives"></i>
			</router-link>
			<router-link to='/' class='mint-tab-item' id="我的">
				<i class="icon iconfont icon-meActive"></i>
			</router-link>
		</mt-tabbar>
  </div>
</template>

<script>
export default {
  name: 'App',
	methods:{
		go_back(){
			this.$router.back(-1)
		}
	}
}
</script>

<style>
	body,html{
		margin: 0;
		padding: 0;
		height: 100%;
	}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
	width: 100%;
	height: 100%;
}
.my-nav {
		background: #26a2ff;
	}

	.my-nav .icon {
		color: red !important;
	}
</style>
