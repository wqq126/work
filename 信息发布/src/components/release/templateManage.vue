<template>
  <div class="template-manage bx">
    <div class="page-title">{{$t('message.menu.release')}}</div>
    <div class="template-manage-header">
      <button class="el-button mybtn-primary el-button--primary" @click="use_template">{{$t('message.templateManage.action.application')}}</button>
      <!-- <button class="el-button mybtn-primary el-button--primary">{{$t("message.systemSet.exportBtn")}}</button> -->
      <!-- <button class="el-button mybtn-primary el-button--primary">{{$t('message.templateManage.action.importBn')}}</button> -->
      <button class="el-button mybtn-primary el-button--primary" @click="show_dele_dialog">{{$t('message.templateManage.action.batchDeleting')}}</button>
    </div>
    <div class="template-manage-main bx" style="overflow-y: scroll" @scroll="scrollChange">
      <table v-if="templates.length==0" style="width: 100%;height: 100%">
        <tr>
          <td style="text-align: center;color: #6f6f6f">{{$t('message.layoutManage.nodata')}}</td>
        </tr>
      </table>
        <div :class=" index | isleft" v-for="(item, index) in templates" :key="index" class="card-box bx" >
					<el-checkbox @change="add_dele(item.id)" :name="index+'name'" class='my_protocol'></el-checkbox>
					<label :for="index+'name'">test</label>
          <div class="imgbox">
						<img src="../../../static/images/picDefault.png" alt="">
          </div>
          <p>{{item.layout | layout }}</p>
        </div>
    </div>
    <div v-if="endScroll==true" class="loading" >{{loading}}</div>
    <!--添加布局弹框-->
    <add-layout :add_layout_dialog="add_layout_dialog" :edit_obj="edit_obj" v-on:close_dialog="close_dialog" v-on:modal_success="modal_success"></add-layout>
    <!--刪除組件-->
    <delete-dialog ref="deleteConfirm" :item_obj="{}" :delete_dialog_show="delete_dialog_show" :func="dele_template"
                   v-on:close_dele_dialog="close_dele_dialog"></delete-dialog>
  </div>

</template>

<script>
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  import addLayout from './layout/addLayout';
  Vue.use(VueScroller)
  import {http} from "../../api/config";
  import DeleteDialog from  './delete/deleteDialog';
  export default {
    name: "templateManage",
    components:{
      DeleteDialog,
      addLayout
    },
    data: function () {
      return {
        loading:this.$t('message.templateManage.loading'),
        delete_dialog_show:false, //删除框是否显示
        templates: [],
        delearr: [],
        noData: '',
        page: 1,
        limit: 15,
        add_layout_dialog:false,
        edit_obj:{
          templateId:''
        },
        startScroll:false,
        endScroll:false,
        bottomOffset:10,//距离底部10px 开始请求接口
        scrollDone:'',
      }
    },
    beforeRouteEnter(to, from, next) {
      //传给父组建值
      next(vm => {
        vm.$emit('pageName', to.name);
        vm.$emit('materialName', '0');
      })

    },
    filters: {
      isleft: function (v) {
        if (Math.round(v / 5) == v / 5) {
          if(v>4){
            return 'nomargin-left row';
          }else {
            return 'nomargin-left';
          }

        } else {
          if(v>4){
            return 'margin-left row';
          }else {
            return 'margin-left';
          }

        }
      },
      layout: function (layout) {
        if (!layout) {
          return 'no name';
        } else {
          return layout;
        }
      }
    },
    mounted: function () {
      var _this = this;
      _this.getTemplate();
    },
    methods: {
      //隱藏刪除彈框
      close_dele_dialog:function () {
        this.delete_dialog_show = false;
      },
      //获取模板
      getTemplate: function () {
        var _this = this;
        _this.page = 1;
        _this.LonbonAjax({
          type: 'GET',
          url: http.getTemplate,
          data: {
            page: _this.page,
            limit: _this.limit
          }
        }).then(function (res) {
          var data = res.data.data;
					console.log(data)
          _this.templates = [];
          _this.templates = _this.templates.concat(data);
        }, function (res) {
        })
      },
      //下拉
      refresh(done) {
        done()
      },
      //上拉
      infinite(done) {
        var _this = this;
        _this.scrollDone = done;
        _this.LonbonAjax({
          type: 'GET',
          url: http.getTemplate,
          data: {
            page: _this.page,
            limit: _this.limit
          }
        }).then(function (res) {
          var data = res.data.data;
          if(_this.page==1){
            _this.templates.shift();
          }
          _this.page = _this.page+1;
          _this.templates = _this.templates.concat(data);
          done();
        }, function (res) {
          done(true);
        })
      },
      //獲取要刪除模板的id
      add_dele: function (id) {
        var _this = this;
        var index = _this.delearr.indexOf(id);
        if (index >= 0) {
          _this.delearr.splice(index, 1);
        } else {
          _this.delearr.push(id);
        }
      },
      //显示删除弹框
      show_dele_dialog: function () {
        var _this = this;
        if (_this.delearr.length > 0) {
          this.$refs.deleteConfirm.opendelete();
        } else {
          this.$message({
            message: _this.$t('message.templateManage.deletSelect'),
            type: 'warning'
          });
        }
      },
      //隱藏增加彈框
      close_dialog: function() {
        this.add_layout_dialog = false;
      },
      //佈局增加成功
      modal_success: function() {
        var _this = this;
        _this.add_layout_dialog = false;
      },
      //刪除模板
      dele_template: function () {
        var _this = this;
        var data = _this.delearr.join(',');
        _this.LonbonAjax({
          url: http.getTemplate+'/0',
          type: 'DELETE',
          data: {
            templateIds: data
          }
        }).then(function (res) {
          _this.page = 1;
          _this.templates = [];
          _this.delearr = [];
          _this.$message.success(_this.$t('message.templateManage.template_delete_success'));
          _this.delete_dialog_show = false;
          _this.getTemplate();
        }, function (res) {
          _this.$message.success(_this.$t('message.templateManage.template_delete_error'));
          console.log(res)
        })
      },
      //应用模板
      use_template(){
        var _this = this;
        var id = _this.delearr.join(',');
        if (_this.delearr.length == 1) {
          // _this.templates.forEach((item,index)=>{
          //   var itemid = item.id;
          //   if(id==itemid){
          //     _this.edit_obj.templateName = item.layout;
          //     _this.add_layout_dialog = true;
          //   }
          // })
          _this.add_layout_dialog = true;
          _this.edit_obj.templateId = id;
        } else {
          this.$message({
            message: _this.$t('message.templateManage.use_template_no'),
            type: 'warning'
          });
        }
      },
      //滚动
      scrollChange(){
        var _this = this;
        var scrollContainer = $('.template-manage-main');
        var heiht = scrollContainer.height();
        var paddintTop = parseInt(scrollContainer.css('padding-top'));
        var scrollH = scrollContainer[0].scrollHeight;
        var scrollT = scrollContainer[0].scrollTop;
        if(heiht+scrollT>=scrollH-paddintTop){
          _this.endScroll = true;
          _this.LonbonAjax({
            type: 'GET',
            url: http.getTemplate,
            data: {
              page: _this.page,
              limit: _this.limit
            }
          }).then(function (res) {
            _this.page = _this.page+1;
            var data = res.data.data;
            _this.templates = _this.templates.concat(data);
            // scrollContainer[0].scrollTo(scrollH);
            _this.endScroll = false;
          }, function (res) {
            _this.loading = _this.$t('message.templateManage.nomore');
            setTimeout(function () {
              _this.endScroll = false;
            },3000);
          })
        }

      }
    }
  }
</script>

<style scoped>
  .template-manage {
    height: 97%;
  }

  .template-manage-header {
    text-align: right;
    margin-top: 1%;
    padding-right: 20px;
  }

  .template-manage-header button:not(:last-child) {
    margin-right: 30px;
  }

  .template-manage-main {
    height: 90%;
    position: relative;
    margin-top: 30px;
    padding-top: 10px;
  }

  .row {
    margin-top: 30px;
  }

  .template-manage-main .card-box {
    padding: 10px;
    position: relative;
    background: white;
    height: 240px;
    width: 100px;
    display: inline-block;
    width: 18.9%;
    font-size: 0rem;
  }

  .template-manage-main .card-box p {
    font-size: 1rem;
    color: #6f6f6f;
  }

  .template-manage-main .margin-left {
    margin-left: 1.25%;
  }

  .template-manage-main .card-box .imgbox {
    width: 100%;
    height: 80%;
  }
	.template-manage-main .card-box .imgbox img{
		width: 100%;
		height: 100%;
	}
  .template-manage-main .card-box p {
    height: 20%;
    text-align: center;
  }

  .scroller {
    position: relative;
    height: 200px;
  }
  .my_protocol{
    position: absolute;
    top: -10px;
    left: 0px;
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  /*隐藏掉我们模型的checkbox*/

  .my_protocol .input_agreement_protocol {
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: none;
    display: inline-block;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    filter:alpha(opacity=0);

  }


  /*未选中时*/

  .my_protocol .input_agreement_protocol+span {
    width: 20px;
    height: 20px;
    display: inline-block;
    /*background: url(./icon_checkbox.png) no-repeat;*/
    background-position-x: 0px;
    background-position-y: -25px;
    position: relative;
    top: 3px;
    border: 1px solid #a5a5a5;
    background: white;
    border-radius: 4px;
  }


  /*选中checkbox时,修改背景图片的位置*/

  .my_protocol .input_agreement_protocol:checked+span:after {
    /*background-position: 0 0px*/
    opacity: 1;
    content: '';
    /* position: absolute; */
    width: 15px;
    float: left;
    height: 8px;
    background: transparent;
    border: 3px solid #18abbb;
    border-top: none;
    border-right: none;
    transform: rotate(-56deg);
    margin-left: 2px;
    margin-top: 3px;
    box-shadow: none;
    text-shadow: none;
  }
  .loading{
    height: 30px;
    width: 90%;
    position: absolute;
    bottom: 0;
    text-align: center;
    color: #18abbb;
  }
</style>
