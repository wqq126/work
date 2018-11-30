<template>
  <!--<el-dialog @open="init" :show-close='false' :close-on-click-modal='false'-->
  <!--:title="$t('message.releaseManage.tip')"-->
  <!--:visible.sync="delete_dialog_show" width="503px"-->
  <!--center>-->
  <!--<div class="dele-body">-->
  <!--<img src="../../../../static/images/confirmtip.png" alt=""/>-->
  <!--<span>{{text}}</span>-->
  <!--</div>-->
  <!--<span slot="footer" class="dialog-footer">-->
  <!--<el-button  class="el-button mybtn-primary el-button&#45;&#45;primary" @click="func(item_obj.id)" >{{$t('message.releaseManage.okBtn')}}</el-button>-->
  <!--<el-button class="el-button mybtn-primary el-button&#45;&#45;primary" @click="close_dele_dialog">{{$t('message.cancelChange')}}</el-button>-->
  <!--</span>-->
  <!--</el-dialog>-->
  <div>

  </div>
</template>

<script>
  export default {
    name: "delete-dialog",
    props: {
      delete_dialog_show: {
        type: Boolean,
        require: true,
      },
      func: {
        type: Function,
        require: true
      },
      item_obj: {
        type: Object,
      }
    },
    data: function () {
      return {
        text: '',
      }
    },
    methods: {
      opendelete(name, id) {
        var name = name?':'+name : '';
        var id = id || '';
        this.text = this.$t('message.releaseManage.delete_sure') + name + '?';
        this.$confirm(this.text, this.$t('message.releaseManage.tip'), {
          title: ' ',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          this.func(id)
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: this.$t('message.releaseManage.deleted_deleted')
          // });
        });
      },
      init: function () {
        if (this.item_obj.layout) {
          this.text = this.$t('message.releaseManage.delete_sure') + this.item_obj.layout + '?';
        } else {
          this.text = this.$t('message.releaseManage.delete_sure') + '?';
        }
      },
      close_dele_dialog: function () {
        var _this = this;
        _this.$emit('close_dele_dialog', false);
      }
    }

  }
</script>

<style scoped>
  .el-dialog__body {
    width: 503px;
  }

  .dele-body img {
    position: relative;
    left: -50px;
  }

  .dele-body span {
    display: inline-block;
    position: relative;
    top: -33px;
  }

  .row {
    background: white;
    height: 240px;
    width: 100px;
    display: inline-block;
    width: 18.9%;
    font-size: 0rem;
    margin-top: 30px;
  }

  button {
    width: 115px;
    background: #18abbb;
    color: white;
    outline: none;
    border: none;
    height: 35px;
    border-radius: 8px;
  }

  .dele-body {
    text-align: center;
  }

</style>
