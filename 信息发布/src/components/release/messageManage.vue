<template>
<div class="message-manage">
	<div class="page-title">{{$t('message.menu.release')}}</div>
	<div class="message-manage-header bx">
		<button class="el-button mybtn-primary el-button--primary" @click="PostMessage.dialogVisible = true">
			{{$t('message.messageManage.post_message')}}
		</button>
		<button class="el-button mybtn-primary el-button--primary" @click="handleDelete()">
			{{$t('message.releaseManage.delete')}}
		</button>
	</div>
		<el-table :data="List.data" class="my-table" @selection-change="selectionChange" v-loading="listLoading"  highlight-current-row  style="width: 100%;"  height="calc(100% - 90px - 2.5em)">
			<el-table-column type="selection" width='50'></el-table-column>
			<!-- 序号 -->
			<el-table-column  :label="$t('message.messageManage.num')" type="index" :index="indexMethod" width='60'></el-table-column>
			<!-- 消息标题 -->
			<el-table-column  :label="$t('message.messageManage.Notification_title')" prop="title" style="width: 20%;"show-overflow-tooltip ></el-table-column>
			<!-- 发布内容 -->
			<el-table-column  :label="$t('message.messageManage.message_content')" prop="content" style="width: 25%;" show-overflow-tooltip></el-table-column>
			<!-- 设备分组 -->
			<el-table-column  :label="$t('message.messageManage.device')" prop="displayGroups" style="width:5%;"show-overflow-tooltip >
				<template slot-scope='scope'>
					<div class='cell' v-if='scope.row.displayGroups'>{{scope.row.displayGroups}}</div>
				</template>
			</el-table-column>
			<!-- 持续时间 -->
			<el-table-column  :label="$t('message.messageManage.duration')" prop="duration" style="width:5%;" ></el-table-column>
			<!-- 状态 -->
			<el-table-column  :label="$t('message.messageManage.state')" prop="state" style="width:100;" >
				<template  slot-scope="scope">
						<span v-if='scope.row.state' class=' working'>
							{{$t('message.messageManage.processing')}}
						</span>
						<span v-else class='paused'>
							{{$t('message.messageManage.over')}}
						</span>
					</template>
			</el-table-column>
			<!-- 发布人员 -->
			<el-table-column  :label="$t('message.messageManage.publisher')"  prop="username" style="width:80;" show-overflow-tooltip></el-table-column>
			<!-- 发布日期 -->
			<el-table-column  :label="$t('message.messageManage.release_date')" prop="createTime" style="width:100;"  ></el-table-column>
			<!-- 操作 -->
			<el-table-column  :label="$t('message.messageManage.options')" style="width:130;" >
				<template slot-scope="scope">
					<!-- 重发 -->
					<el-button class="tableBtn"  type="text" size="small" @click="resend(scope.row)">{{$t('message.messageManage.action.resend')}}</el-button>
					<!-- 详情 -->
					<el-button class="tableBtn"  type="text" size="small" @click="detail(scope.row)">{{$t('message.messageManage.action.details')}}</el-button>
					<!-- 删除 -->
					<el-button class="tableBtn"  type="text" size="small" @click="handledelete(scope.row)">{{$t('message.messageManage.action.delete')}}</el-button>
				</template>
			</el-table-column>
			<div slot='empty'>
				<p>{{emptyDataTip}}</p>
			</div>
		</el-table>
		<!-- 工具条 -->
		<el-col :span="24" class="toolbar">
				<el-pagination background  layout="total,sizes,prev, pager, next,jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[10,20,30, 50]"
					:page-size="List.limit"
					:current-page="List.page"
					:total="List.total" style="float:right;"
					>
				</el-pagination>
		</el-col>

		<!-- 发布新消息弹出框 -->
		<el-dialog :show-close='false' :close-on-click-modal='false' :title="$t('message.messageManage.new_message')" @close="PostMessageInit('releaseNotice')" :visible.sync="PostMessage.dialogVisible" center width="50%" style="border-radius:8px;" >
			<el-row>
				<el-col :span="8" class="deviceTree">
					<el-row class="title" style="font-weight:bold;font-size:1.25rem;">{{$t('message.messageManage.choose_dev')}}</el-row>
					<el-tree
						:data="treeData"
			        	:empty-text="$t('message.layoutManage.nodata')"
			            :props="defaultProps"
			            show-checkbox
			            ref="devTree"
			            node-key="groupId"
			            default-expand-all
			            @check-change="taskHandleCheckChange"
					>
					</el-tree>
				</el-col>
				<el-col :span="13" class="messageContent">
				<el-form style="padding:1em;overflow-y:scroll;height:29em;width:96%;"ref='releaseNotice' :model="ReleaseInfo" :rules="ReleaseRule">
					<!-- 消息标题 -->
					<el-form-item prop="title" class="required" style="margin-bottom:1em;">
						<el-row class="item-box4">
							<el-col :span="6">
								<label>
									<img src="../../../static/images/importent.png">
									<span>{{$t('message.messageManage.title')}}</span>
								</label>:
							</el-col>
							<el-col :span="13">
								<el-input v-model="ReleaseInfo.title"></el-input>
							</el-col>
						</el-row>
					</el-form-item>
					<!-- 消息内容 -->
					<el-form-item prop="message" class="required">
						<el-row class="item-box1">
							<el-col :span="6">
								<label>
									<img src="../../../static/images/importent.png">
									<span>{{$t('message.messageManage.messageContent')}}</span>
								</label>:
							</el-col>
							<el-col :span="13">
								<el-input type="textarea" :placeholder="$t('message.messageManage.Limit')" @input="decInput" maxlength="140" :rows="5" v-model="ReleaseInfo.message"></el-input>
								<br>
								<span style="color:red;">{{rement}}/140</span>
							</el-col>
						</el-row>
					</el-form-item>
					<!-- 字体大小 -->
					<el-form-item prop="fontSize" class="required font">
						<el-row class="item-box5">
							<el-col :span="6">
								<label>
									<span>{{$t('message.messageManage.Font_size')}}</span>
								</label>:
							</el-col>
							<el-col :span="8">
								<el-input-number v-model="ReleaseInfo.font_size" :controls="false"></el-input-number>
							</el-col>
							<el-col :span="2">
								%
							</el-col>
						</el-row>
					</el-form-item>
					<!-- 通知等级 -->
					<el-form-item prop="noticeLevel" class="required">
					<el-row class="item-box2">
						<el-col :span="6">
							<label>
								<img src="../../../static/images/importent.png">
								<span>{{$t('message.messageManage.level')}}</span>
							</label>:
						</el-col>
						<el-col :span="10">
							<el-select v-model="ReleaseInfo.noticeLevel">
								<el-option
								v-for="item in level"
								:key = "item.value"
								:label="item.label"
								:value="item.value"
								>
								</el-option>
							</el-select>
						</el-col>
					</el-row>
					</el-form-item>
					<!-- 持续时长 -->
					<el-row class="item-box3">
						<el-col :span="6">
							<label style="height: 3em;line-height: 3em;display: inline-block;">
								<img src="../../../static/images/importent.png">
								<span>{{$t('message.messageManage.duration')}}</span>
							</label>:
						</el-col>
						<el-col :span="5">
							<el-form-item prop="day" class="required" >
								<el-input-number style="width:4em;" :controls="false" v-model="ReleaseInfo.day"></el-input-number>
								<span style="margin-left:10%;">{{$t('message.messageManage.Day')}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item prop="hour" class="required" >
								<el-input-number style="width:4em;" :controls="false" v-model="ReleaseInfo.hour"></el-input-number>
								<span style="margin-left:10%;">{{$t('message.messageManage.Hour')}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item prop="min" class="required" >
								<el-input-number style="width:4em;" :controls="false" v-model="ReleaseInfo.min"></el-input-number>
								<span style="margin-left:10%;">{{$t('message.messageManage.Min')}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<!-- 添加素材 -->
					<el-form-item>
						<el-row class="item-box6">
						<el-col :span="6">
						<label>
							<span>{{$t('message.messageManage.add_material')}}</span>:
						</label>
					</el-col>
					<el-col style="margin-left:1em;">
						<div>
							<!--图片-->
							<li v-for="item in mediaList"  v-show="item.type=='image'"   style="width:6em;height:6em;float:left;margin:1em 0.5em;position:relative;">
								<span style="width:20px;height:20px;margin:0;position:absolute;top:-18px;right:-9px;cursor:pointer; " @click="deleMedia(item)">
										<img src="../../../static/images/dele.png" height="20" width="20">
								</span>
								<img :src=" item | media_type" style="width:auto; max-width:100%; height:6em;">
							</li>
							<!--直播-->
							<li v-for="item in mediaList"    v-show="item.type=='live'"     class="live-li" style="width:6em;height:6em;float:left;margin:1em 0.5em;position:relative;">
								<span style="width:20px;height:20px;margin:0;position:absolute;top:-18px;right:0px;cursor:pointer; " @click="deleMedia(item)">
									<img src="../../../static/images/dele.png" height="20" width="20">
								</span>
								<img src="../../../static/images/live2.png" style="width:47%;height:50%;">
								<span style="text-overflow:ellipsis;overflow:hidden;display:block;white-space:nowrap; margin:0;">{{item.name}}</span>
							</li>
							<!--视频-->
							<li v-for="item in mediaList"  v-show="item.type=='video'"    style="width:6em;height:6em;float:left;margin:1em 0.5em;position:relative;">
								<span style="width:20px;height:20px;margin:0;position:absolute;top:-18px;right:0px;cursor:pointer; " @click="deleMedia(item)">
									<img src="../../../static/images/dele.png" height="20" width="20">
								</span>
								<img class="media-img" :src=" item | media_type" alt="">
            					<div class="media-info bx">
              						<span>{{item.name}}</span>
            					</div>
							</ol>
							<li style="width:6em;height:6em; float:left;margin:1em;">
								<el-button class="image-button" @click="addMeterial()">
									<img src="../../../static/images/addImage.png" width="100%" height="100%">
								</el-button>
							</li>
							</div>
					</el-col>
				</el-row>
				</el-form-item>
				</el-form>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" class='mybtn-primary' @click="Release()">{{$t('message.messageManage.Release')}}</el-button>
				<el-button type="primary" class='mybtn-primary' @click="PostMessage.dialogVisible=false">{{$t('message.messageManage.Cancel')}}</el-button>
			</div>
		</el-dialog>
		<!-- 添加素材弹框 -->
		<el-dialog :show-close='false' :close-on-click-modal='false' :title="$t('message.messageManage.add_material')" :visible.sync="AddMaterial.dialogVisible" center width="50%" top="8vh" style="border-radius:8px;" class="metrial">
			<el-row>
				<el-col class="deviceTree2" style="padding:1em 0;">
					<div class="serach">
						<el-input class='examine-name-input' :placeholder="$t('message.messageManage.Search_material')"
                  				@keydown.13.native="get_media()" prefix-icon="el-icon-search" v-model="source_name">
        		</el-input>
          <el-button type="primary" class='mybtn-primary' @click="get_media()">{{$t('message.messageManage.Search_material')}}</el-button>
          </div>
					<div class="show">
						<ul class="design-source-list bx">
          					<li @click="get_media('image')" :class="media_type=='image'? 'active':'noactive'" style="cursor: pointer;">
            					<img src="../../../static/images/image.png" alt="">
            					<br>
            					<span>{{$t('message.layoutDesign.image')}}</span>
          					</li>
          					<li @click="get_media('live')" :class="media_type=='live'? 'active':'noactive'" style="cursor: pointer;">
            					<img src="../../../static/images/live.png" alt="">
            					<br>
            					<span>{{$t('message.layoutDesign.live')}}</span>
          					</li>
          					<li @click="get_media('video')" :class="media_type=='video'? 'active':'noactive'" style="cursor: pointer;">
            					<img src="../../../static/images/video.png" alt="">
            					<br>
            					<span>{{$t('message.layoutDesign.video')}}</span>
          					</li>
        				</ul>
					<div style="width:82%;height:94%;padding:1em 1.5em;float:left;overflow-y:scroll;overflow-x:hidden;">
							<!--图片-->
            				<el-checkbox-group  v-show="media_type=='image'" v-model="media_image_checked">
            					<!-- <div>
 									<el-checkbox v-for="(item,index) in media_image"  :key="index" :label="item.mediaId" style="float:left;width:21%;height:5em;margin:1em 0.75em;position: relative;">
 										<img class="media-img" :src=" item | media_type">
 										<div class="media-info bx">
              								<span  class="media_image">{{item.name}}</span>
              								<span  class="el-icon-view eyebox" @click.stop="preview_media(item)"></span>
            							</div>
            						</el-checkbox>
            					</div> -->
            					<div  v-for="(item,index) in media_image" :key="index" :label="item.mediaId" style="float:left;width:21%;height:5em;margin:1em 0.75em;position: relative;font-size:16px">
            						<el-checkbox class="imageNo" :key="index" :label="item.mediaId">
            							<!-- <img class="media-img" :src=" item | media_type"> -->
            						</el-checkbox>
        							<img class="media-img" :src=" item | media_type">
									<div class="media-info bx">
              							<span>{{item.name}}</span>
              							<span class="el-icon-view eyebox" @click.stop="preview_media(item)"></span>
            						</div>
            					</div>
            				</el-checkbox-group>
							<!--直播-->
							<el-checkbox-group  v-show="media_type=='live'" v-model="media_media_checked" >
								<!-- <el-checkbox v-for="(item,index) in media_media"  :key="index" :label="item.mediaId" style="float:left;width:21%;height:5em;margin:1em 0.75em;position: relative;">
									<img class="media-img" src="../../../static/images/live2.png" alt="">
									<div class="media-info bx">
            							<span class="media_live">{{item.name}}</span>
            							<span class="el-icon-view eyebox" @click="previewMedia(item)"></span>
            						</div>
            					</el-checkbox> -->
            					<div v-for="(item,index) in media_media"  :key="index" :label="item.mediaId" style="float:left;width:21%;height:5em;margin:1em 0.75em;position: relative;font-size:16px">
            						<el-checkbox class="imageNo" :key="index" :label="item.mediaId">
            						</el-checkbox>
            						<img class="media-img" src="../../../static/images/live2.png" alt="">
									<div class="media-info bx">
            							<span class="media_live">{{item.name}}</span>
            							<span class="el-icon-view eyebox" @click="previewMedia(item)"></span>
            						</div>
            					</div>
							</el-checkbox-group>
							<!--视频-->
							<el-checkbox-group  v-show="media_type=='video'" v-model="media_video_checked" >
								<!-- <el-checkbox v-for="(item,index) in media_video"  :key="index" :label="item.mediaId" style="float:left;width:21%;height:5em;margin:1em 0.75em;position: relative;">
								<img class="media-img" :src=" item | media_type" alt="">
            					<div class="media-info bx">
              						<span>{{item.name}}</span>
              						<span class="el-icon-view eyebox" @click="preview_media(item)"></span>
            					</div>
            					</el-checkbox> -->
            					<div v-for="(item,index) in media_video"  :key="index" :label="item.mediaId" style="float:left;width:21%;height:5em;margin:1em 0.75em;position: relative;font-size:16px">
            						<el-checkbox class="imageNo" :key="index" :label="item.mediaId">
            						</el-checkbox>
            						<img class="media-img" :src=" item | media_type" alt="">
            						<div class="media-info bx">
              							<span>{{item.name}}</span>
              							<span class="el-icon-view eyebox" @click="preview_media(item)"></span>
            						</div>
            					</div>
							</el-checkbox-group>
					</div>
					</div>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" class="mybtn-primary" @click="Sure()">{{$t('message.messageManage.Sure')}}</el-button>
				<el-button type="primary" class="mybtn-primary" @click="Back()">{{$t('message.messageManage.Cancel')}}</el-button>
			</div>
		</el-dialog>
		<!-- 详情查看 -->
		<el-dialog :show-close='false' :close-on-click-modal='false' :title="$t('message.messageManage.Message_details')"  :visible.sync="centerDialogVisible" center height="80%" width="55%" style="border-radius:8px;">
			<el-row :gutter="15">
					<!-- 发布分组 -->
				<el-col :span="8">
				<el-col :span="14">
					<label style="font-size:20px;">
						{{$t('message.messageManage.Choosedev')}}:
					</label>
				</el-col>
				<el-col :span="10" class="detailTree">
					<el-tree
			        	:data="treeData"
			        	:empty-text="$t('message.layoutManage.nodata')"
			           	:props="defaultProps"
			           	show-checkbox
			           	ref="devTree2"
			           	node-key="id"
			           	default-expand-all
			           	:default-checked-keys="Detail.displayGroupIds"
						>
					</el-tree>
				</el-col>
				</el-col>
				<el-col :span="14">
					<el-form style="background-color:rgb(255,255,255);width:100%;height:auto;" ref='DetailMessage'>
					<!-- 标题 -->
					<el-form-item >
						<el-col :span="6">
							<label style="font-size:20px;">
								{{$t('message.messageManage.Notification_title')}}:
							</label>
						</el-col>
						<el-col :span="18">
							<span v-text="Detail.title"></span>
						</el-col>
					</el-form-item>
				<!-- 内容 -->
				<el-form-item>
					<el-col :span="6">
						<label style="font-size:20px;">
							{{$t('message.messageManage.messageContent')}}:
						</label>
					</el-col>
					<el-col :span="15">
						<div class="detailContent" v-text="Detail.content"></div>
					</el-col>
				</el-form-item>
				<!-- 通知等级 -->
				<el-form-item>
					<el-col :span="6">
						<label style="font-size:20px;">
							{{$t('message.messageManage.level')}}:
						</label>
					</el-col>
					<el-col :span="10">
						<span v-if="Detail.msgLevel== 1" class="paused">
							{{$t('message.messageManage.Important_notice')}}
						</span>
						<span v-else>
							{{$t('message.messageManage.Ordinary_notice')}}
						</span>
					</el-col>
				</el-form-item>
				<!-- 发布人员 -->
				<el-form-item>
					<el-col :span="6">
						<label style="font-size:20px;">
							{{$t('message.messageManage.publisher')}}:
						</label>
					</el-col>
					<el-col :span="10">
						<span v-text="Detail.username"></span>
					</el-col>
				</el-form-item>
				<!-- 发布格式 -->
				<el-form-item>
					<el-col :span="6">
						<label style="font-size:20px;">
							{{$t('message.messageManage.Font_size')}}:
						</label>
					</el-col>
					<el-col :span="10">
						<span v-text="Detail.msgSet.titleSet">
						</span>
					</el-col>
				</el-form-item>
				<!-- 发布日期 -->
				<el-form-item>
					<el-col :span="6">
						<label style="font-size:20px;">
							{{$t('message.messageManage.release_date')}}:
						</label>
					</el-col>
					<el-col :span="10">
						<span v-text="Detail.createTime"></span>
					</el-col>
				</el-form-item>
				<!-- 状态 -->
				<el-form-item>
					<el-col :span="6">
						<label style="font-size:20px;">
							{{$t('message.messageManage.state')}}:
						</label>
					</el-col>
					<el-col :span="10">
						<span v-if="Detail.state == 1" class="working">
							{{$t('message.messageManage.processing')}}
						</span>
						<span v-else class='paused'>
							{{$t('message.messageManage.over')}}
						</span>
					</el-col>
				</el-form-item>
				<!-- 所选素材 -->
				<el-form-item>
					<el-col :span="6">
						<label style="font-size:20px;">
							{{$t('message.messageManage.selected_material')}}:
						</label>
					</el-col>
					<el-col :span="30">
						<ul >
							<!-- <span v-if="this.Detail.mediaArr.length == 0"> -->
							<li v-for="item in Detail.mediaArr" v-if="item.type=='image'" style="float:left;margin:0 0.5em;">
								<img :src=" item | media_type" style="width:auto; max-width:100%; height:6em;" @click="preview_media(item)">
							</li>
							<li v-for="item in Detail.mediaArr" v-if="item.type=='live'" style="float:left;margin:0 0.5em;">
								<img :src=" item | media_type" style="width:auto; max-width:100%; height:5em;" @click="previewMedia(item)">
							</li>
							<li v-for="item in Detail.mediaArr" v-if="item.type=='video'" style="float:left;margin:0 0.5em;">
								<img :src=" item | media_type" style="width:auto; max-width:100%; height:5em;" @click="preview_media(item)">
							</li>
						</ul>
					</el-col>
				</el-form-item>
				</el-form>
			</el-col>
		</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" class='mybtn-primary' @click="clearDetail('DetailMessage')">{{$t('message.messageManage.close')}}</el-button>
			</div>
		</el-dialog>
		<!--图片预览组件-->
    	<image-preview v-on:close_preview="close_preview" :media_preview_path="media_preview_path"
                   :image_preview_show="image_preview_show"></image-preview>
    	<!--视频预览组建-->
    	<video-preview v-on:close_preview="close_preview" :media_preview_path="media_preview_path"
                   :video_preview_show="video_preview_show"></video-preview>
        <!--//流媒体预览-->
		<el-dialog :title="$t('message.material.btnPreview')" :close-on-click-modal='false' @close='disposeVideo' center :visible.sync="mediaPreview" width="40%">
			<el-row>
				<video-player  class="video-player vjs-custom-skin"
					     ref="videoPlayer"
					     :playsinline="true"
					     :options="playerOptions"
				></video-player>
			</el-row>
		</el-dialog>
</div>
</template>
<script>
  import Vue from 'vue'
  import VideoPlayer from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  import '../../../static/liMarquee/liMarquee.css'
  Vue.use(VideoPlayer)
  import VueDraggableResizable from 'vue-draggable-resizable'
  import {http} from "../../api/config";
  import ImagePreview from './layout/imagePreview';
  import videoPreview from './layout/videoPreview';
  import MediaList from './layout/mediaList'
  import Limarquee from 'limarquee'
  require('webpack-jquery-ui')
  export default {
  name: 'messageManage',
  components: {
      ImagePreview,
      videoPreview,
    },
    beforeRouteEnter(to, from, next) {
      //传给父组建值
      next(vm => {
        vm.$emit('pageName', to.name);
        vm.$emit('materialName', '3');
      })
    },
  data(){
  	return{
  		List:{
  			sels:[],
  			data:[],
  			page: 1,
			limit: 20,
			total: 0,
			displayGroups:'',
			start_time:'',
			end_time:'',
			current_time:'',
  		},
  		ReleaseInfo:{
  			title:'',
  			message:'',
  			noticeLevel:0,
  			font_size:100,
  			devIds:[],
  			mediaArr:'',
  			day:1,
  			hour:1,
  			min:1,
  		},
  		Detail:{
  			displayGroupIds:[],
  			msgSet:{
  				titleSet:'',
  				contentSet:'',
  			}
  		},
  		media_type: 'image',
  		sels:[],
        media_list: [],
        meterialList:[],//所选素材id
        mediaList:[],//所选素材全部属性
        mediaAll:[],
        source_name: '',
  		PostMessage:{dialogVisible:false,},
  		AddMaterial:{dialogVisible:false,},
  		centerDialogVisible: false,
  		mediaPreview:false,
  		media_preview_path: '',
        image_preview_show: false,
        video_preview_show: false,
  		treeData:[],
  		listLoading:true,
  		emptyDataTip:'',
  		defaultProps: {
		    children: 'child',
          	label: 'displayGroup'
		},
		rement:0,
		level:[{
			label:this.$t('message.messageManage.Ordinary_notice'),
			value:0
		},{
			label:this.$t('message.messageManage.Important_notice'),
			value:1
		}],
		ReleaseRule:{
			title:[{
				required:true,
				message:this.$t('message.messageManage.rule.title'),
				trigger:'blur'
			}],
			message:[{
				required:true,
				message:this.$t('message.messageManage.rule.message'),
				trigger:'blur'
			}],
			noticeLevel:[{
				required:true,
				message:this.$t('message.messageManage.rule.level'),
				trigger:'blur'
			}],
			day:[{
				required:true,
				message:this.$t('message.messageManage.rule.day'),
				trigger:'blur'
			}],
			hour:[{
				required:true,
				message:this.$t('message.messageManage.rule.hour'),
				trigger:'blur'
			}],
			min:[{
				required:true,
				message:this.$t('message.messageManage.rule.min'),
				trigger:'blur'
			}],
		},
		playerOptions : {
		        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
		        autoplay: true, //如果true,浏览器准备好时开始回放。
		        muted: false, // 默认情况下将会消除任何音频。
		        loop: false, // 导致视频一结束就重新开始。
		        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
		        language: localStorage.getItem('current_lan'),
		        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
		        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
		        techOrder: ['html5', 'flash'],
		        sources: [{
		          type: "",
		          src: "" //url地址
		        }, {
		            withCredentials: false,
		            type: 'application/x-mpegURL',
		            src:''
		          }
		        ],
		        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
		        controlBar: {
                    timeDivider: false,
                    durationDisplay: false,
                    remainingTimeDisplay: false,
                       fullscreenToggle: true, //全屏按钮
                       progressControl:true
                    }
			    },
		media_image:[],
		media_media:[],
		media_video:[],
		media_image_sel:[],
		media_media_sel:[],
		media_video_sel:[],
		media_image_checked:[],
		media_media_checked:[],
		media_video_checked:[],
  	}
  },
  created(){
  	this.getList();
  	this.stateChange();
  	this.getGroupList();
  	this.get_media();
  	this.getMedia();
  },
  filters: {
      media_type: function (item) {
        var type = item.type;
        var path = '';
        switch (type) {
          case 'image':
            if (item.options) {
              path = http.url + item.options.uri;
            } else {
              path = http.url + item.path;
            }
            break;
          case 'video':
            path = require('../../../static/images/video.png');
            break;
          case 'webpage':
            path = require('../../../static/images/webpage.png');
            break;
          case 'text':
            path = require('../../../static/images/text.png');
            break;
          case 'live':
            path = require('../../../static/images/live.png');
            break;
        }
        return path;
      },

  },
  computed:{

  },
  methods:{
  	getList(){
  		let _this= this;
  		_this.LonbonAjax({
  			type :'GET',
  			url  :'/api/v1/msg',
  			data :{
  				limit:_this.List.limit,
  				page :_this.List.page
  			}
  		}).then((res)=>{
  		let listData = res.data.data;
  		_this.List.total = res.data.total;
  		for(let i =0;i<listData.length;i++){
  			listData[i].state = _this.stateChange(listData[i].createTime,listData[i].duration);
  			listData[i].createTime = _this.timestampToTime(listData[i].createTime);
  			listData[i].duration = _this.durationChange(listData[i].duration);
  		};
  		_this.List.data = listData;
  		_this.listLoading = false;
  		_this.emptyDataTip = this.$t('message.messageManage.Nodata');
  		}).fail((err)=>{
  			_this.listLoading = false;
  			_this.List.data =[];
  			_this.total = 0;
  			_this.emptyDataTip = this.$t('message.messageManage.Nodata');
  			if(400!=err.errorCode){
  				_this.$message.error(err.message);
  			}
  			else if(_this.page>1){
  				_this.page--;
  				_this.getList();
  			}
  		})
  	},
  	decInput(){
  		var txtVal = this.ReleaseInfo.message.length;
   		this.rement = txtVal;
  	},
  	getArrEqual(arr1, arr2) {
    	let newArr = [];
    	for (let i = 0; i < arr2.length; i++) {
        	for (let j = 0; j < arr1.length; j++) {
         	   	if(arr1[j] === arr2[i]){
                newArr.push(arr1[j]);
            	}
        	}
    	}
    	return newArr;
	},
	//选择素材
	addMeterial(){
		this.AddMaterial.dialogVisible=true;
		// console.log(this.mediaList);
		// console.log(this.media_image_checked);
		for(var i=0;i<this.mediaList.length;i++){
			if(this.mediaList[i].type == 'image'){
				this.media_image_checked.push(this.mediaList[i].mediaId)
			}
			if(this.mediaList[i].type == 'live'){
				this.media_media_checked.push(this.mediaList[i].mediaId)
			}
			if(this.mediaList[i].type == 'video'){
				this.media_video_checked.push(this.mediaList[i].mediaId)
			}
		}
	},
	//选择素材返回
	Back(){
		this.AddMaterial.dialogVisible=false;
		this.media_image_checked = [];
		this.media_media_checked = [];
		this.media_video_checked = [];
	},
	Sure(){
		var arr = new Array();
		arr = arr.concat(this.media_image_checked);
		arr = arr.concat(this.media_media_checked);
		arr = arr.concat(this.media_video_checked);
		this.mediaList = this.ArrayC(arr);
		this.meterialList =this.ArrayC(arr);
		var MediaAll = this.mediaAll;
		var MeterialList = new Array();
		for(var i=0;i<this.mediaList.length;i++){
			for(var j=0;j<MediaAll.length;j++){
				if(this.mediaList[i]==MediaAll[j].mediaId){
					MeterialList.push(MediaAll[j]);
				}
			}
		}
		this.mediaList = MeterialList;
		this.AddMaterial.dialogVisible=false;
	},
	// 数组去重
	ArrayC(arr){
		var result = []; //结果数组
    	for(var i = 0; i < arr.length; i++)
    		{
        	//如果在结果数组result中没有找到arr[i],则把arr[i]压入结果数组result中
        	if (result.indexOf(arr[i]) == -1) result.push(arr[i]);
    		}
    	return result;
	},
  	// 多项删除
  	handleDelete(){
  		var sel = this.sels;
  		if(sel.length<=0){
  			this.$message({
  				message:this.$t('message.systemSet.noSelect'),
  				type:'warning'
  			});
  			return false;
  		}
  		var ids = this.sels.map(item => item.id).toString();
  		this.$confirm(
  			this.$t('message.systemSet.delConfirm'),{
  				type: 'warning'
		}).then(() => {
		let delArray = {id:ids};
		this.LonbonAjax({
			type:'POST',
			url:'/api/v1/deleteMsg',
			data:delArray,
		}).then((res)=>{
			this.$message({
			    message: this.$t('message.systemSet.delSuccess'),
			    type: 'success'
			});
			this.getList();
		}).fail((err)=>{
				this.$message({
			          message: this.$t('message.systemSet.delFail'),
			          type: 'error'
			       });
		});
		}).catch(()=>{
		});
  	},
  	// 单行删除
  	handledelete(user){
  		// console.log("1");
  		let id = user.id;
  		this.$confirm(this.$t('message.authority.user.tips.delConfirm'),{
  			type:'warning'
  		}).then(()=>{
  			this.LonbonAjax({
  				type:'POST',
  				url:'/api/v1/deleteMsg',
  				data:{id}
  			}).then((res)=>{
  				this.$message({
							message: this.$t('message.systemSet.delSuccess'),
							type: 'success'
						});
  				this.getList();
  			}).fail((err)=>{
  			this.$message({
			          message: this.$t('message.systemSet.delFail'),
			          type: 'error'
			       });
  		});
  		}).catch(()=>{

  		})
  	},
  	// 状态判断
  	stateChange(time,time2){
  		var createTime 	= time*1000;
  		var duration 	= time2;
  		var currentTime = (new Date()).getTime();
  		var sum = createTime + duration;
  		// console.log(sum);
  		if(sum>currentTime){
  			return 1;
  		}else{
  			return 0;
  		}
  	},
  	// 时间戳转换
  	timestampToTime (time) {
				var time = new Date(time*1000);
				var y = this.zeroBu(time.getFullYear()); //年
				var m = this.zeroBu(time.getMonth() + 1); //月
				var d = this.zeroBu(time.getDate()); //日
				var times = y + "-" + m + "-" + d;
				return times;
	},
	zeroBu (n) {
		if(n < 10) {
			return '0' + n;
		} else {
			return n
		}
	},
	// 时长
	durationChange(value){
		var Sec = parseInt(value)/1000;
		var Min = 0;
		var Hou = 0;
		var Day = 0;
		if(Sec>=60){
			Min = parseInt(Sec/60);
			Sec = parseInt(Sec%60);
			if(Min>60){
				Hou = parseInt(Min/60);
				Min = parseInt(Min%60);
				if(Hou>=24){
					Day = parseInt(Hou/24);
					Hou = parseInt(Hou%24);
				}
			}
		}
		var result = Day+this.$t('message.messageManage.Day')+this.zeroBu(Hou)+this.$t('message.messageManage.Hour')+this.zeroBu(Min)+this.$t('message.messageManage.Min');
		return result;
	},
	// 详情
	detail(table){
		let data = table;
		this.LonbonAjax({
			type:'GET',
			url:'/api/v1/msg/'+data.id,
		}).then((res)=>{
			var a = res.data.msgSet;
			this.Detail = res.data;
			this.Detail.state = this.stateChange(res.data.createTime,res.data.duration);
			this.Detail.createTime = this.timestampToTime(res.data.createTime);
			this.centerDialogVisible = true;
			this.Detail.msgSet = JSON.parse(this.Detail.msgSet);
      this.Detail.msgSet.titleSet = this.Detail.msgSet.titleSet;
      this.Detail.displayGroupIds = res.data.displayIds;
		})
	},
	// 重发
	resend(table){
		this.$confirm(
			this.$t('message.messageManage.Resend'),{
				type:'warning'
			}).then(()=>{
			let Data = table;
			this.LonbonAjax({
				type:'POST',
				url:'/api/v1/resendMsg',
				data:{
					id:Data.id,
				}
			}).then((res)=>{
				this.listLoading = false;
				this.getList();
			}).fail((err)=>{
				this.$message({
			          message: this.$t('message.messageManage.Resend_fail'),
			          type: 'error'
			       });
			});
			}).catch(()=>{

			})
	},
  	handleCurrentChange(val) {
  		this.List.data = [];
  		this.emptyDataTip = '';
		this.List.page = val;
		this.getList();
	},
	handleSizeChange(val) {
	    this.List.limit = val
	    this.getList();
	},
	selectionChange(sels) {
		this.sels = sels;
		// console.log(this.sels);
	},
	indexMethod(index){
		index = (this.List.page - 1) * (this.List.limit) + index + 1
		return index;
	},
	// 删除所选
	deleMedia(item){
			var List = this.mediaList;
			var id = item.mediaId;
			for(var i=0 ;i<List.length;i++){
				if((this.mediaList[i].mediaId)==id){
					this.mediaList.splice(i,1);
				}
			}
			this.media_video_checked=[];
			this.media_media_checked=[];
			this.media_image_checked=[];
	},
	//树形图
	taskHandleCheckChange(data, checked, indeterminate){
		this.ReleaseInfo.devIds = this.$refs['devTree'].getCheckedNodes();
	},
	// 发布新信息
	Release(){
		this.$refs['releaseNotice'].validate((valid)=>{
			if(!valid){
				return false;
			}
      let deviceList = this.ReleaseInfo.devIds;
			let deviceIds = [];
			for(let i= 0;i<deviceList.length;i++){
				if(deviceList[i].hasOwnProperty('child')==false){
					deviceIds.push(deviceList[i].id);
				}
			}
			let sunTime = 0;
			sunTime = (this.ReleaseInfo.day*86400+this.ReleaseInfo.hour*3600+this.ReleaseInfo.min*60)*1000;
			let Setstr = {
				"titleSet":this.ReleaseInfo.font_size+"%",
				"contentSet":this.ReleaseInfo.font_size+"%",
      }
      if(deviceIds.length<=0){
        this.$message({
					message:this.$t('message.messageManage.rule.device'),
					type:'warning'
				})
      }else{
			this.LonbonAjax({
				type:'POST',
				url:'/api/v1/msg',
				data:{
					title:this.ReleaseInfo.title,
					content:this.ReleaseInfo.message,
					duration:sunTime,
					level:this.ReleaseInfo.noticeLevel,
					device:deviceIds.toString(),
					set:JSON.stringify(Setstr),
					media:this.meterialList.toString(),
				}
			}).then((res)=>{
				this.getList();
				this.PostMessage.dialogVisible = false;
				this.mediaList = [];
				this.meterialList =[];
				this.AddMaterial.dialogVisible=false;
				this.media_video_checked=[];
			this.media_media_checked=[];
			this.media_image_checked=[];
			}).fail((err)=>{
      });
      }
		})
	},
	// 清空弹出框
	PostMessageInit(formName){
		this.ReleaseInfo.title = '';
		this.ReleaseInfo.message = '';
		this.ReleaseInfo.noticeLevel = 0;
		this.ReleaseInfo.font_size = 100;
		this.ReleaseInfo.day = '1';
		this.ReleaseInfo.hour = '1';
		this.ReleaseInfo.min = '1';
    this.$refs.devTree.setCheckedKeys([]);
		this.ReleaseInfo.mediaArr = '';
		this.meterialList = [];
		this.mediaList = [];
		this.rement = 0;
		this.$refs[formName].resetFields();
	},
	clearDetail(formName){
		this.$refs.devTree2.setCheckedKeys([]);
		this.centerDialogVisible = false;
	},
   	//获取media
    get_media(type){
    	// this.source_name = "";
        var _this = this;
        if(type){
        	_this.media_type = type;
        }
        _this.LonbonAjax({
          url: http.media,
          type: 'GET',
          data: {
            limit: 0,
            mediaType: _this.media_type,
            mediaName: _this.source_name
          }
        }).then(function (res) {
          var data = res.data;
          _this.media_list = data;
          if(_this.media_type=="image"){
        	_this.media_image = _this.media_list;
        	_this.media_media=[];
        	_this.media_video=[];
	        }else if(_this.media_type=="live"){
	        	_this.media_media = _this.media_list;
	        	_this.media_image=[];
	        	_this.media_video=[];
	        	// console.log(_this.media_image_checked);
	        }else if(_this.media_type=="video"){
	        	_this.media_video = _this.media_list;
	        	_this.media_image=[];
	        	_this.media_media=[];
	        }
          // console.log(_this.media_list)
        }, function (res) {
         	if(res.errorCode == 400) {
         		if(_this.media_type=="image"){
	        		_this.media_image = [];
		        }else if(_this.media_type=="live"){
		        	_this.media_media = [];
		        	// console.log(_this.media_image_checked);
		        }else if(_this.media_type=="video"){
		        	_this.media_video = [];
		        }
         	}
        })
    },
   // 获取全部素材
   	getMedia(){
   		this.LonbonAjax({
   			url:http.media,
   			type:'GET',
   			data:{
   				limit:0,
   			}
   		}).then((res)=>{
   			this.mediaAll = res.data;
   		}).fail((err)=>{
   			return false;
   		})
   	},
    //素材预览
    preview_media(item) {
        var type = item.type;
        this.media_preview_path = http.url + item.path;
        // console.log(type);
        switch (type) {
          case 'image':
            this.image_preview_show = true;
            break;
          case 'video':
            this.video_preview_show = true;
            break;
          case 'live':
            break;
          case 'text':
            break;
          case 'webpage':
            break;
        }
    },
    /*直播预览*/
	previewMedia (item) {
		let mediaId = item.mediaId;
		let urlOption = {
			url:http.getMediaUrl + mediaId,
			type:"GET"
		}
		this.LonbonAjax(urlOption).then((res) => {
			let mediaUrl = res.data.url||item.path;
			let path = mediaUrl;
			//地址输入错误的情况
			if (mediaUrl.includes('http://')) {
				let addrSuffix = mediaUrl.substring(mediaUrl.lastIndexOf('.'), mediaUrl.length);
				let videoType = ".mp4.flv.f4v.webm.avi.wmv.rmvb";
				if (!videoType.includes(addrSuffix)) {
					this.$message.error(this.$t('message.material.mediaAddressError'));
					return;
					}
				}
			this.playerOptions.sources[0].src = mediaUrl;
			this.mediaPreview = true;
			}, (err) => {

			});
	},
	//销毁视频
	disposeVideo() {
		this.$refs.videoPlayer.player.pause();
		this.playerOptions.sources[0].src = '';
		this.playerOptions.sources[0].type = '';
	},
    //关闭预览
      close_preview: function (type) {
        this[type] = false;
    },
	//获取设备分组
	getGroupList () {
		let groupOption = {
		url:http.groupList,
		type:'GET',
		data:{
		userId: localStorage.getItem('userId')
			}
		}
		this.LonbonAjax(groupOption).then((res) => {
			var data = res.data;
			var tmpObj = {
			    displayGroup:this.$t('message.taskManage.nogroup'),
			    child:[]
			};
			    var last = data.pop();
			    if(last.noGroup.length>0){
			        tmpObj.child = last.noGroup;
			        data.push(tmpObj);
			    }
			    this.treeData = data;

		    })
		},
  	beforeRouteEnter(to, from, next) {
      //传给父组建值
      next(vm => {
        vm.$emit('pageName', to.name);
        vm.$emit('materialName', '3');
      })
    },
}
}
</script>
<style scoped>
    .tableBtn {
		border: none;
		color: #18abbb;
		font-size: 1em;
		background: none;
		padding-left: 0px;
		padding-top: 0px;
		padding-bottom: 0px;
		padding-right:0px;
	}
	.page-box {
    	padding: 0 10px;
    	text-align: right;
    	margin-top: 20px;
    	height: 8%;
  	}
  	.message-manage {
		height: 100%;
		background-color: #FFF;
		border-radius:0.5em;
	}
    .message-manage-header {
     	text-align: right;
    	background: white;
    	padding-top: 1%;
    	padding-bottom: 1%;
    	padding-right: 20px;
    }
    .paused {
		color:#ff0c0c;
	}
	.working {
		color:#05b72b;
	}
    .image-button{
    	width:100%;
    	height:100%;
    	padding:0;
    }
  	.message-manage-header button:not(:last-child){
    	margin-right: 30px;
  	}
  	.toolbar {
		margin-top:1em;
		padding-right:2em;
	}
	.deviceTree {
		width:31%;
		padding:1em;
		border:1px solid #ccc;
		height:31em;
		overflow:auto;
		border-radius: 8px;
	.title{
			font-size: 1.2rem;
    		font-weight: bold;
    		margin-bottom:0.5em;
		}
	}
	.messageContent{
		border:1px solid #ccc;
		height:31em;
		border-radius:8px;
		width:65%;
		margin-left:1em;
	}
	.el-form{
		height:23em;
		width:36em;
	}
	.el-form-item{
		margin-bottom:0.5em;
	}
	.item-box3 .el-input{
		width:68%;
	}
	.item-box5 span,.item-box6 span{
		margin-left:1em;
	}
	.item-box3 .el-input .el-input__inner{
		padding:0;
	}
	.design-source-list {
    	float: left;
    	width: 10%;
    	height: 100%;
    	border-right: 1px solid #c9c9c9;
	}
    .design-source-list li {
      padding: 0.8em 0;
      text-align: center;
    }
    .active {
      background: #cdfafa;
    }
  	.serach{
  		padding:0 1em;
  		margin-bottom:1em;
  		width:100%;
  	}
    .examine-name-input{
      width: 20%;
    }
  	.show{
  		width:100%;
  		border:1px solid #ccc;
  		height:94.5%;
  		border-radius: 8px;
  	}
  	.deviceTree2{
		width:100%;
		padding:1em;
		border:1px solid #ccc;
		height:40em;
		border-radius: 8px;
	.title{
			font-size: 1.2rem;
    		font-weight: bold;
    		margin-bottom:0.5em;
		}
	}
	.design-source-box {
    	border-right: 1px solid #c9c9c9;
    	padding: 5px;
    	float: left;
    	width: 70%;
    	height: 100%;
    	overflow-x: hidden;
    	position: relative;
	}
     .design-source-box .live-li {
      text-align: left;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      position: relative;
  	}
    .design-source-box .live-li  img {
        width: 30px;
        height: 30px;
        float: left;
      }
    .design-source-box .live-li  span {
        position: absolute;
        left: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-left: 10px;
        width: 60%;
      }
    .media-img {
      height:5em;
      width:auto;
      max-width:100%;
       position: absolute;
    	top: 47%;
    	left: 50%;
    	transform: translate(-50%, -50%);
    }
    .detailContent{
    	display:inline-block;
    	width:100%;
    	text-overflow: ellipsis;
		word-wrap: break-word;
    }
    .media-info {
      text-align: left;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      background: rgba(203, 203, 203, 0.9);
      color: #ffffff;
      height: 20px;
      line-height: 20px;
      padding: 0 5px;
  	}
    .media-info  span {
        display: inline-block;
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    .media-info .eyebox {
        cursor: pointer;
        color: #ffffff;
        cursor: pointer;
        height: 20px;
        line-height: 20px;
        width: 22px;
        position: absolute;
        right: 0;
        top: 0;
    }
    i {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: red;
    }
    .meterial{
    	border:1px solid #ccc;
		height:31em;
		border-radius:8px;
		width:36em;
		margin-left:1em;
		padding:1em 0 0 2em ;
    }
    .my_protocol{
    	position: absolute;
    	top: -13px;
    	right: 0px;
    	display: inline-block;
  	}
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
  	.my_protocol .input_agreement_protocol+span {
    	width: 20px;
    	height: 20px;
    	display: inline-block;
    	/*background: url(./icon_checkbox.png) no-repeat;*/
    	background-position-x: 0px;
    	background-position-y: -25px;
    	position: relative;
    	top: -10px;
    	left:90%;
    	border: 1px solid #a5a5a5;
    	background: white;
    	border-radius: 4px;
    	cursor:pointer;
  	}
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
  	.pic .el-checkbox__label{
  		padding:0;
  		height:100%;
  	}
  	deleBtn{
  		position:absolute;
  		top:0;
  		right:0;
  	}
  .metrial .el-dialog--center{
  	margin-top:8vh !importent;
  }
td .el-button--small {
		border: none;
		color: #18abbb;
		font-size: 1em;
		background: none;
		padding-left: 0px;
		padding-top: 0px;
		padding-bottom: 0px;
	}
	.media_live{
		display:inline-block;
		width:80%;
		height:100%;
		overflow: hidden;
    	white-space: nowrap;
    	text-overflow: ellipsis;
	}
	.detailTree{
		width:90%;
		padding:1em;
		border:1px solid #ccc;
		height:31em;
		overflow:auto;
		border-radius: 8px;
	}

</style>

<style>
.message-manage .messageContent .el-form-item__error {
		width:79%;
		top:85%;
	}
.message-manage .messageContent .font .el-form-item__error{
	width:60%;
	top:85%;
}
.imageNo .el-checkbox__label{
		display:none !important;
	}
</style>
