<template>
  <div class="workLog br bx">
    <div class="workLog_title">操作日志</div>      
    <div class="workLog_li">
      <span class="importentIcon">时间段：</span>
      <div class="chooseBox paddingInput time bx">
        <el-time-select v-model="workLogData.signin_start" placeholder="选择时间" :picker-options="{
    start: '05:00',
    step: '00:15',
    end: '23:00'
  }">
        </el-time-select>
      </div>~
      <div class="chooseBox paddingInput time bx">
        <el-time-select v-model="workLogData.signin_end" placeholder="选择时间" :picker-options="{
    start: '05:00',
    step: '00:15',
    end: '23:00'
  }">
        </el-time-select>
      </div>
    </div>
   
  
    <el-button type="primary" class="common_title_btn" :loading="loadingFlag" @click="pushData">保存</el-button>
  </div>
</template>

<script>
  import {
    http
  } from "../../../api/config";

  export default {
    name: 'workLog',
    data() {
      return {
        loadingFlag: false,
        workLogData: {
          school_name: '',
          server_ip: '',
          signin_end: '',
          signin_start: '',
          signout_end: '',
          signout_start: '',
          warning_ip: '',
          week_start: '0'
        }
      }
    },
    methods: {
      change: function (e) {
        // console.log(e)
      },
      getData() { //获取数据
        let _this = this;
        // _this.loadingFlag = true; //加载按钮阀门
        _this.mkajax({
          type: 'get',
          url: http.system,
          data: {}
        }).then((res) => { //成功
          // _this.loadingFlag = false; //关闭按钮阀门
          _this.workLogData = res.data;
        }).fail((err) => { //失败
          // _this.loadingFlag = false; //关闭按钮阀门
        });
      },
      pushData() {
        var _this = this;
        _this.loadingFlag = true; //加载按钮阀门
        _this.mkajax({
          type: 'put',
          url: http.system,
          data: {
            school_name: _this.workLogData.school_name,
            server_ip: _this.workLogData.server_ip,
            signin_end: _this.workLogData.signin_end,
            signin_start: _this.workLogData.signin_start,
            signout_end: _this.workLogData.signout_end,
            signout_start: _this.workLogData.signout_start,
            warning_ip: _this.workLogData.warning_ip,
            week_start: _this.workLogData.week_start
          }
        }).then((res) => { //成功
          _this.$message({
            type: 'success',
            message: '修改成功!',
            duration: 888
          });
          _this.getData();
          _this.loadingFlag = false; //关闭按钮阀门
          _this.workLogData = res.data;
        }).fail((err) => { //失败
          _this.loadingFlag = false; //关闭按钮阀门
        });
      },

    },

    created: function () {
      
      

    },
    beforeRouteEnter(to, from, next) {
      //传给父组建值

      next(vm => {
        vm.$emit('pageName', to.name)
      });


    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .workLog {
    background: #fff;
    width: 100%;
    height: 100%;
    padding: 32px 70px;
    overflow: scroll;
    position: relative;

  }

  .common_title_btn {
    display: inline-block;
    left: 0;
    bottom: 0;


  }

  .importentIcon {
    position: relative;
    margin-left: 30px;
  }

  .importentIcon::before {
    content: '';
    width: 14px;
    height: 14px;
    position: absolute;
    left: -24px;
    top: 50%;
    transform: translateY(-50%);
    background: url('../../../../static/images/importent.png');
  }

  .workLog_title {
    line-height: 86px;
    color: #636363;
    font-size: 22px;
    text-align: left;
  }

  .workLog_li {
    display: flex;
    align-items: center;
    line-height: 64px;
    height: 64px;
  }

  .title {
    height: 34px;
    line-height: 34px;
    margin-right: 40px;
  }

  .chooseBox {
    border: 1px solid #d2d2d2;
    height: 30px;
    line-height: 30px;
    border-radius: 18px;
    position: relative;
  }

  .time {
    margin: 0 20px;
    width: 216px;
  }

  

  .chooseBox.time::after {
    content: '';
    width: 22px;
    height: 22px;
    position: absolute;
    right: 6px;
    background: url('../../../../static/images/time.png');
    top: 50%;
    transform: translateY(-50%);
  }

</style>
