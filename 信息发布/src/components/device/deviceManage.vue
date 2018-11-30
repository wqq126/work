<template>
  <div class="commonBox bx" ondragstart="return false;">
  	<el-row class='page-title'>{{this.$t('message.deviceGroup.deviceM')}}</el-row>
    <div class="commonBoxNavBox bx">
    	
    	<el-menu :default-active="activeIndex" class="el-menu" mode="horizontal">
    		
    		<el-menu-item v-for="(item, index) in deviceItem" :key='index' :index='index+""' v-show="item.showFlag">
			  	<!--<el-input :value='activeIndex'></el-input>-->
			  	<router-link :to="item.path">{{item.name}}</router-link>
			  </el-menu-item>
    	</el-menu>
    </div>
    <transition name='fade2' mode='out-in'>
    	<router-view :devicename.sync='activeIndex'></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'deviceMange',
    data() {
      return {
      	/*刷新页面，3个菜单项都会有is-active类，默认为非菜单项itemCode*/
      	activeIndex: '4',
        deviceItem: [{
          name: this.$t('message.deviceGroup.deviceInfo'),
          path: '/device/deviceInfo',
          itemCode:0,
          showFlag:false
        },
        {
          name: this.$t('message.deviceGroup.groupM'),
          path: "/device/deviceGroup",
          itemCode:1,
          showFlag:false
        },
        {
          name: this.$t('message.deviceGroup.timingTask'),
          path: '/device/timeTask',
          itemCode:2,
          showFlag:false
        }
        ],
      }
    },
    methods:{
    	//获取权限
			getAuthority(){				
				let myPermission = window.localStorage["user_permissions"];
				//console.log("myPermission:"+myPermission);
				myPermission = JSON.parse(myPermission);
				for(var i=0;i<this.deviceItem.length;i++){					
					for(var j=0;j<myPermission.length;j++){
						//遍历一级菜单
						if(myPermission[j].child){
							for(var r=0;r<myPermission[j].child.length;r++){
								//遍历二级菜单节点
								if(this.deviceItem[i].path =='/device'+ myPermission[j].child[r].action){
							      this.deviceItem[i].showFlag = true;//显示存在的二级菜单	
							      
						    }
							}
						}
						
					}
					
				}
			}
    },
    mounted () {
    	this.getAuthority();
    },
    beforeRouteEnter(to, from, next) {
      //传给父组建值
      next(vm => {
        vm.$emit('pageName', to.name)
      })

    },
    
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
