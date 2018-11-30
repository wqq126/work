<template>
  <el-dialog :show-close='false'
             :close-on-click-modal='false'
             :visible.sync="image_preview_show"
             top="10%"
             class="image-preview"
             width="50%">
      <img :src="media_preview_path" alt="">
    <button class="el-dialog__headerbtn" @click="close_preview">
      <i class="el-dialog__close el-icon el-icon-close"></i>
    </button>
  </el-dialog>
</template>

<script>
  export default {
    name: "image-preview",
    props:{
      image_preview_show:{
        type:Boolean,
        require:true
      },
      media_preview_path:{
        type:String,
        require:true
      }
    },
    methods:{
      close_preview:function () {
        this.$emit('close_preview','image_preview_show')
      }
    }
  }
</script>

<style scoped lang="less">
.image-preview .el-dialog__header{
  padding: 0;
}
</style>
<style lang="less">
  .image-preview .el-dialog__header{
    padding: 0;
  }
  .image-preview .el-dialog{
    height: 50%;
    width: 50%;

    .el-dialog__headerbtn{
      border-radius: 50%;
      background: rgba(89,89,89,0.7);
      width: 30px;
      height: 30px;
      top: -15px;
      right: -15px;
      i{
        color: white;
      }
    }
  }
  .image-preview .el-dialog__body{
    height: 100%;
//     width: 100%;
//     padding: 0;
    text-align: center;
    img{
      height: 90%;
      width: 90%;
    }
  }
</style>
