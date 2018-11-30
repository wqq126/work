<template>
  <el-dialog :show-close='false' :close-on-click-modal='false' :title="title"
             @open="init"
             :visible.sync="region_image_dialog" width="713px" center>
    <div class="layout-body task-form">
      <el-form label-width="20%" :model='imageForm' :rules="imageRules" ref="ruleForm">
				<!-- 名称 -->
      	<el-form-item :label="$t('message.releaseManage.name')" prop="name" class="required">
      		<el-input style='width: 80%;' v-model.trim='imageForm.name'></el-input>
      	</el-form-item>
				<!-- 持续时间 -->
      	<el-form-item :label="$t('message.releaseManage.duration')" >
      		<el-input type='number' style='width: 80%;' v-model="imageForm.duration" >
      			</el-option>
      		</el-input>
					{{$t('message.releaseManage.second')}}
      	</el-form-item>
				<!-- 拉伸方式 -->
				<el-form-item :label="$t('message.releaseManage.StretchingMode')" class="item" >
					<el-select v-model="imageForm.scan_type">
						<el-option v-for="item in img_scan" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
      	<!-- 水平位置 -->
      	<el-form-item :label="$t('message.releaseManage.HorizontalPosition')" class="item" v-if="imageForm.scan_type=='center'">
      		<el-select v-model="imageForm.img_x_type" >
      			<el-option v-for="item in img_x" :key="item.value" :label="item.label" :value="item.value">
      			</el-option>
      		</el-select>
      	</el-form-item>
				<!-- 垂直位置 -->
				<el-form-item :label="$t('message.releaseManage.HorizontalPosition')" class="item" v-if="imageForm.scan_type=='center'">
					<el-select v-model="imageForm.img_y_type" >
						<el-option v-for="item in img_y" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
      	<div style="text-align: center;">
      		<el-button class="el-button mybtn-primary el-button--primary" type="primary" @click="add_region('ruleForm')">{{$t('message.releaseManage.okBtn')}}</el-button>
      		<el-button class="el-button mybtn-primary el-button--primary" @click="close_region('ruleForm')">{{$t('message.cancelChange')}}</el-button>
      	</div>
      </el-form>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
		    <el-button :disabled="save_disabled" class="el-button mybtn-primary el-button--primary" @click='add_region' type="primary">{{$t('message.releaseManage.okBtn')}}</el-button>
		    <el-button class="el-button mybtn-primary el-button--primary" @click="close_region">{{$t('message.cancelChange')}}</el-button>
		  </span> -->
  </el-dialog>
</template>

<script>
  export default {
    name: "image-region",
    props:{
      region_image_dialog:{
        type:Boolean,
        require:true
      },
      func:{
        type:Function,
        require:true
      },
      dropregionid:{
        type:String,
        require:true
      },
      media_list_edit_item:{
        type:Object
      },

    },
    data:function () {
      return {
				imageForm:{
					name:'',
					duration:10,
					scan_type:'',
					img_x_type:'center',
					img_y_type:'middle'
				},
				imageRules:{
					name: {
						required: true,
						message: this.$t('message.layoutManage.layout_name'),
						trigger: 'blur'
					},
				},
				title:'',
        save_disabled:false,
        img_scan:[
          {
            value:'center',
            label:this.$t('message.releaseManage.keepaspectratio')
          },
          {
            value:'stretch',
            label:this.$t('message.releaseManage.stretching')
          }
        ],
        img_x:[
          {
            value:'left',
            label:this.$t('message.releaseManage.left'),
          },
          {
            value:'right',
            label:this.$t('message.releaseManage.right'),
          },
          {
            value:'center',
            label:this.$t('message.releaseManage.center'),
          }
        ],
        img_y:[
          {
            value:'top',
            label:this.$t('message.releaseManage.top'),
          },
          {
            value:'middle',
            label:this.$t('message.releaseManage.center'),
          },
          {
            value:'bottom',
            label:this.$t('message.releaseManage.bottom'),
          }
        ]
      }
    },
    methods:{
      inputChange(type){
        var key = type+'_error';
        this[key] = '';
      },
      init:function () {
        var _this = this;
        _this.save_disabled = false;
        var region_data = _this.media_list_edit_item;
        if(region_data.mediaName){
          _this.imageForm.duration= region_data.duration;
          _this.imageForm.name= region_data.mediaName;
          _this.title = _this.$t('message.layoutDesign.editmedia');
          var scaleType = region_data.options.scaleType;
          _this.imageForm.scan_type = region_data.options.scaleType;
          if(scaleType=='center') {
            _this.imageForm.img_x_type = region_data.options.align;
            _this.imageForm.img_y_type = region_data.options.valign;
          }
        }else {
          _this.imageForm.scan_type = 'stretch';
          _this.imageForm.img_x_type = 'center';
          _this.imageForm.img_y_type = 'middle';
          _this.imageForm.duration='10';
          _this.imageForm.name=region_data.name ||  region_data.type;
          _this.title = _this.$t('message.layoutDesign.addmedia');
					_this.name_error =11
        }
      },
      close_region:function (formName) {
				this.$refs[formName].resetFields();
        this.$emit('close_region','image');
      },
      add_region:function(formName){
				this.$refs[formName].validate((valid)=>{
					if (valid){
						var _this = this;
						var option={
							scaleType:_this.imageForm.scan_type,
							align:_this.imageForm.img_x_type,
							valign:_this.imageForm.img_y_type,
							duration:_this.imageForm.duration,
							name:_this.imageForm.name
						};
						_this.save_disabled = true;
						this.$emit('save_media',option,_this.dropregionid,_this.media_list_edit_item);
					}
				})
      }
    }
  }
</script>

<style scoped>


  .layout-body {
    margin: 0;
    padding: 0;
  }


  .item label {
    text-align: right;
    display: inline-block;
    width: 20%;
  }
  .item .error{
    color: red;
    height: 20px;
    line-height: 20px;
    padding-left: 21%;
    font-size: 14px;
  }
  .item .el-select,
  .item .el-input {
    width: 80%;
  }
	
	
</style>
