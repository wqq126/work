<template>
	<div class="commonBox bx">
		<div class="page-title">{{$t("message.authority.title")}}</div>
		<div class="commonBoxNavBox bx">
			<!--<ul class="commonBoxNav br mb14">
				<li v-for="(item,index) in msgData" :class="{active:index==navActiveStutas}">
					<router-link :to="item.path">{{item.name}}</router-link>
				</li>
			</ul>-->
			<el-menu :default-active="navActiveStutas" class="el-menu" mode="horizontal">   		
    		<el-menu-item v-for="(item, index) in msgData" :key='index' :index='index+""' v-show="item.showFlag">			  	
			  	<router-link :to="item.path">{{item.name}}</router-link>
			  </el-menu-item>
    	</el-menu> 
		</div>

		<transition name='fade2' mode='out-in'>
			<router-view v-on:pageName='changeNavActiveStutas'></router-view>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'systemSet',
		data() {
			return {
				msgData: [{
						name: this.$t('message.authority.tabRole'),
						path: '/roleManage',
						showFlag:false,
					},
					{
						name: this.$t('message.authority.tabUser'),
						path: '/userManage',
						showFlag:false
					}
				],
				navActiveStutas: '0'
			}
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit('pageName', to.name)
			})
		},
		methods: {
			changeNavActiveStutas: function(data) {
				switch(data) {
					case 'roleManage':
						this.navActiveStutas = '0';
						break;
					case 'userManage':
						this.navActiveStutas = '1';
						break;
				}
			},
		    getLang(){   
		        this.$i18n.locale = window.localStorage['current_lan'];
		        this.$i18n.mergeLocaleMessage('en', window.localStorage['current_lan'])
		    },
		    getAuthority(){				
				let myPermission = window.localStorage["user_permissions"];
				myPermission = JSON.parse(myPermission);
				for(var i=0;i<this.msgData.length;i++){					
					for(var j=0;j<myPermission.length;j++){
						if(myPermission[j].child){
							for(var r=0;r<myPermission[j].child.length;r++){
								if(this.msgData[i].path == myPermission[j].child[r].action){
							      this.msgData[i].showFlag = true;//显示存在的二级菜单	
						    	}
							}
						}
					}
				}
			}
		},
		created() {
			this.getLang();
			this.getAuthority();
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
	.el-menu {
		border-radius:6px;
	}
	.el-menu-item {
		margin: 0 1.6em !important;
		padding:0;
		height:3em !important;
		line-height:3em !important;
		font-size:1.375em;
		&.is-active {
			  border-bottom: 2px solid #17acbb !important;
		}
	}
	a {
		display:inline-block;
		height:100%;
		width:100%;
		text-decoration: none;
	}
	.is-active a {
		color:#17acbb !important;
	}
</style>