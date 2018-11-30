<template>
	<div class="commonBox bx">
		<div class="commonBoxNavBox bx">
      <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" ondragstart="return false">
        <el-menu-item v-for="(item, index) in release_item " :key='index' :index='index+""' v-show="item.showFlag">
          <router-link :to="item.path">{{item.name}}</router-link>
        </el-menu-item>
      </el-menu>
		</div>
    <transition name='fade4' mode='out-in'>
      <router-view v-on:materialName='changeMaterial'></router-view>
    </transition>
	</div>
</template>

<script>
	export default {
		name: 'releaseMange',
		data() {
			return {
        activeIndex:'0',
				msgData: [{
					name: '发布管理',
					path: ''
				}],
				release_item: [{
						name: this.$t('message.releaseManage.menu.templateManage'),
						path: '/release/template',
            showFlag:false
					},
					{
						name: this.$t('message.releaseManage.menu.layoutManage'),
						path: '/release/layout',
            showFlag:false
					},
					{
						name: this.$t('message.releaseManage.menu.taskManage'),
						path: '/release/task',
            showFlag:false
					},{
            name:this.$t('message.releaseManage.menu.messageManage'),
            path:'/release/messageManage',
            showFlag:false
          }
				]
			}
		},
		beforeRouteEnter(to, from, next) {
      //传给父组建值
			next(vm => {
				vm.$emit('pageName', to.name)
			})

		},
		methods: {
      changeMaterial: function(val) {
        this.activeIndex = val;
      },
      //获取权限
      getAuthority(){
        let myPermission = window.localStorage["user_permissions"];
        myPermission = JSON.parse(myPermission);
        for(var i=0;i<this.release_item.length;i++){
          for(var j=0;j<myPermission.length;j++){
            //遍历一级菜单
            if(myPermission[j].child){
              for(var r=0;r<myPermission[j].child.length;r++){
                //遍历二级菜单节点
                if(this.release_item[i].path =='/release'+ myPermission[j].child[r].action){
                  this.release_item[i].showFlag = true;//显示存在的二级菜单
									
                }
              }
            }

          }

        }
      },
		},
    mounted(){
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
