<template>
  <div class="commonBox bx" ondragstart="return false;"> 
  	<div class="page-title" >{{$t("message.systemSet.title")}}</div>
    <div class="commonBoxNavBox bx">
      <el-menu :default-active="navActiveStutas" class="el-menu" mode="horizontal">   		
    		<el-menu-item v-for="(item, index) in msgData" :key='index' :index='index+""' v-show="item.showFlag">			  	
			  	<router-link :to="item.path">{{item.name}}</router-link>
			  </el-menu-item>
    	</el-menu>   
    </div>
    
     <transition name='fade5' mode='out-in'>
    	<router-view v-on:pageName='changeNavActiveStutas'></router-view>
    </transition>
  </div>
</template>

<script>
	
  export default {
    name: 'systemSet',
    data() {
      return {
        msgData: [ 
        {
          name: this.$t('message.systemSet.baseSet'),
          path: '/systemSet/basicSetup',         
          showFlag:false
        },
        {
          name: this.$t('message.systemSet.playRecord'),
          path: '/systemSet/playRecord',         
          showFlag:false
        },
        {
          name: this.$t('message.systemSet.actionLog'),
          path: '/systemSet/workLog',
          showFlag:false
        },
        {
          name: this.$t('message.systemSet.onlineUpgrade'),
          path: '/systemSet/onlineUpdate',
          showFlag:false
        }
        
        ],
        navActiveStutas: '0',
        
      }
    },
    beforeRouteEnter(to, from, next) {    	
      //传给父组建值
      next(vm => {
        vm.$emit('pageName', to.name)
      })

    },
    methods: {
      changeNavActiveStutas: function (data) {
        switch (data) {
          case 'basicSetup':
            this.navActiveStutas = '0';
            break;
          case 'playRecord':
            this.navActiveStutas = '1';
            break;
          case 'workLog':
            this.navActiveStutas = '2';
            break;
          case 'onlineUpdate':
            this.navActiveStutas = '3';
            break;
          
        }
      },      
      //获取权限zw 0827
			getAuthority(){				
				let myPermission = window.localStorage["user_permissions"];
				//console.log("myPermission:"+myPermission);
				myPermission = JSON.parse(myPermission);
				for(var i=0;i<this.msgData.length;i++){					
					for(var j=0;j<myPermission.length;j++){
						//遍历一级菜单
						if(myPermission[j].child){
							for(var r=0;r<myPermission[j].child.length;r++){
								//遍历二级菜单节点
								if(this.msgData[i].path =='/systemSet'+ myPermission[j].child[r].action){
							      this.msgData[i].showFlag = true;//显示存在的二级菜单	
							      
						    }
							}
						}
						
					}
					
				}
			},
    },
    mounted() {
    	//this.msgData[1].showFlag = false;
    	this.getAuthority();
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

