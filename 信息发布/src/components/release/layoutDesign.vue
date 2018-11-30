<template>
	<div class="design">
		<div class="page-title">{{$t('message.menu.release')}}</div>
		<div class="design-header bx btnbox">
			<el-row :gutter="24">
				<el-input class='examine-name-input' :placeholder="$t('message.examineManage.input_name')" @keydown.enter.native="get_media"
				 prefix-icon="el-icon-search" v-model="source_name">
				</el-input>
				<button class="el-button mybtn-primary el-button--primary" @click="get_media">
					{{$t('message.layoutManage.search')}}
				</button>
				<button class="el-button mybtn-primary el-button--primary fl" @click="go_back">
					{{$t('message.layoutManage.back')}}
				</button>
				<button class="el-button mybtn-primary el-button--primary fl" @click="update_display">
					{{$t('message.layoutManage.update_display')}}
				</button>
				<button class="el-button mybtn-primary el-button--primary fl" @click="save_as_template">
					{{$t('message.layoutManage.save_as_template')}}
				</button>
				<button class="el-button mybtn-primary el-button--primary fl" @click="edit_layout">
					{{$t('message.releaseManage.edit')}}
				</button>
				<a class="el-button mybtn-primary el-button--primary fl previewBtn" :href="'./static/preview/preview.html?layoutid='+layout.id"
					target="_blank">{{$t('message.layoutManage.preview')}}
				</a>
			</el-row>
		</div>
		<div class="design-main bx">
			<div class="design-box bx">
				<ul class="design-source-list bx" ondragstart="return false">
					<li @click="search_media('image')" :class="media_type=='image'? 'active':'noactive'">
						<img src="../../../static/images/image.png" alt="">
						<br>
						<span>{{$t('message.layoutDesign.image')}}</span>
					</li>
					<li @click="search_media('live')" :class="media_type=='live'? 'active':'noactive'">
						<img src="../../../static/images/live.png" alt="">
						<br>
						<span>{{$t('message.layoutDesign.live')}}</span>
					</li>
					<li @click="search_media('video')" :class="media_type=='video'? 'active':'noactive'">
						<img src="../../../static/images/video.png" alt="">
						<br>
						<span>{{$t('message.layoutDesign.video')}}</span>
					</li>
					<li @click="search_media('text')" :class="media_type=='text'? 'active':'noactive'">
						<img src="../../../static/images/text.png" alt="">
						<br>
						<span>{{$t('message.layoutDesign.text')}}</span>
					</li>
					<li @click="search_media('webpage')" :class="media_type=='webpage'? 'active':'noactive'">
						<img src="../../../static/images/webpage.png" alt="">
						<br>
						<span>{{$t('message.layoutDesign.webpage')}}</span>
					</li>
				</ul>
				<ul class="design-source-box bx">
					<!--图片-->
					<li v-for="(item,index) in media_list" :key="index" draggable="true" @dragstart="mediadragstart($event,item)" v-if="item.type=='image'">
						<img class="media-img" :src=" item | media_type" alt="">
						<div class="media-info bx">
							<span>{{item.name}}</span>
							<span class="el-icon-view eyebox" @click="preview_media(item)"></span>
						</div>
					</li>
					<!--直播-->
					<li v-for="(item,index) in media_list" :key="index" draggable="true" @dragstart="mediadragstart($event,item)"
					 class="live-li" v-if="item.type=='live'">
						<img src="../../../static/images/live2.png" alt="">
						<span class="">{{item.name}}</span>
						<span class="el-icon-view eyebox" @click="preview_media(item)"></span>
					</li>
					<!--视频-->
					<li v-for="(item,index) in media_list" :key="index" draggable="true" @dragstart="mediadragstart($event,item)" v-if="item.type=='video'">
						<img class="media-img" :src=" item | media_type" alt="">
						<div class="media-info bx">
							<span>{{item.name}}</span>
							<span class="el-icon-view eyebox" @click="preview_media(item)"></span>
						</div>
					</li>
					<!--文本-->
					<li v-for="(item,index) in media_list" :key="index" draggable="true" @dragstart="mediadragstart($event,item)" v-if="item.type=='text'">
						<img class="media-img" :src=" item | media_type" alt="">
						<div class="media-info bx">
							<span>{{$t('message.layoutDesign.text')}}</span>
							<!--<span class="el-icon-view eyebox" @click="preview_media(item)"></span>-->
						</div>
					</li>
					<!--网页-->
					<li v-for="(item,index) in media_list" :key="index" draggable="true" @dragstart="mediadragstart($event,item)" v-if="item.type=='webpage'">
						<img class="media-img" :src=" item | media_type" alt="">
						<div class="media-info bx">
							<span>{{$t('message.layoutDesign.webpage')}}</span>
							<!--<span class="el-icon-view eyebox" @click="preview_media(item)"></span>-->
						</div>
					</li>
					<li v-for="(item,index) in media_list" :key="index" draggable="true" @dragstart="mediadragstart($event,item)" v-if="item.type=='nodata'">
						{{$t('message.layoutManage.nodata')}}
					</li>
				</ul>
				<div class="design-layout bx">
					<div class="design-layout-header">
						<label>{{$t('message.layoutDesign.background')}}</label>:
						<el-color-picker color-format="hex" v-model="layout.background" @active-change="layout_background_change" @change="layout_background_change"></el-color-picker>
						<label>X</label>:
						<input type="text" class="bx" v-model="layout.x" disabled>
						<label>Y</label>:
						<input type="text" class="bx" v-model="layout.y" disabled>
						<label>W</label>:
						<input type="text" class="bx" v-model="layout.w" disabled>
						<img @click="keepscan" id="keepscanBtn" style="cursor: pointer" src="../../../static/images/noscan.png" alt="">
						<label>H</label>:
						<input type="text" class="bx" v-model="layout.h" disabled>
					</div>
					<div class="design-contain bx">
						<div class="draw-box bx" @scroll="drawScroll" @mousemove="dropover" v-on:drop.stop='drop($event)'
						 v-on:dragover.stop='allowDrop($event)'>
							<!--//画布-->
							<div class="regionsboxcontainer" style="height: 100%;overflow: hidden;min-height: 1080px;min-width: 1920px">
								<router-x></router-x>
								<router-y></router-y>
								<div class="regionsbox bx" v-bind:style="{width:layout.width+'px',height:layout.height+'px',background:layout.background}">
									<!--region-->
									<div class="region-media-show-box" :id="item.regionId" v-for="(item,index) in layout.regions" :key="index"
									 @dblclick="edit_region({regionId:item.regionId,width:item.regionWidth,height:item.regionHeight})" @click="clikregion(item.regionId)"
									 :class="istable(item.regionId)" v-on:drop.stop="drop_media($event,item)" v-on:dragover.stop="allowDrop($event)"
									 @mouseenter="enter_region" @mouseleave="out_region" v-bind:style="{width:item.percentW+'%',height:item.percentH+'%',top:item.percentT+'%',left:item.percentL+'%',border: '1px solid '+layout.background}">
										<!--顶部-->
										<div class="region-action-box region-action-drop">
											<button @mouseenter="show_menu_li" class="el-button mybtn-primary el-button--primary my-menu">
												{{$t('message.releaseManage.operation')}}
											</button>
											<ul>
												<li @click="edit_region({regionId:item.regionId,width:item.regionWidth,height:item.regionHeight})">
													{{$t('message.releaseManage.edit')}}
												</li>
												<li @click="dele_region(item.regionId)">
													{{$t('message.releaseManage.delete')}}
												</li>
											</ul>

										</div>
										<!--region显示-->
										<div class="region-media-box-main region-action-drop bx" v-if="region_media[item.regionId]" v-bind:style="{'text-align':region_media[item.regionId].medias[0].options.align,'vertical-align':region_media[item.regionId].medias[0].options.valign}"
										 :class=" region_media[item.regionId].medias[0] | region_media_img">
											<div class="text-region-box" style="background: darkgrey;width: 100%;height: 100%;" v-if="region_media[item.regionId].medias[0].type == 'text' "
											 draggable="false">
												<div v-if="region_media[item.regionId].medias[0].options.effect !='none'" class="bx container text-region-maarquee"
												 :class="'container'+index" :classname="'container'+index" :effect="region_media[item.regionId].medias[0].options.effect"
												 :speed="region_media[item.regionId].medias[0].options.speed" v-html="checkhtml(region_media[item.regionId].medias[0].options.raw)"
												 :style="{padding:'0 5px',height:'100%','text-align':'left',background:'darkgrey'}">
												</div>
												<!--没有滚动效果-->
												<div v-else class="bx text-region-maarquee" v-html="checkhtml(region_media[item.regionId].medias[0].options.raw)"
												 :style="{'text-align':'left',background:'darkgrey',
                             height:'100%',
                             width:'100%',
                             position:'absolute','overflow-y':'scroll'}">
												</div>
											</div>
											<img v-else :src=" region_media[item.regionId].medias[0] | media_type" :width="region_media[item.regionId].medias[0].options.autoWidth"
											 :height="region_media[item.regionId].medias[0].options.autoHeight" alt="" draggable="false">
										</div>
										<!--底部-->
										<div class="region-media-box-footer region-action-drop bx" v-if="region_media[item.regionId]">
											<span class="region-media-info region-action-drop" v-if="region_media[item.regionId]">
												{{region_media[item.regionId].medias[0].mediaName}}
											</span>
											<span class="eyebox region-action-drop bx">
												<i @click="pre_media($event,region_media[item.regionId])" :class=" region_media[item.regionId].currentMedia < region_media[item.regionId].allMedias ? 'caret-left-normal' : 'caret-left-no'">
												</i>
												<i @click="next_media($event,region_media[item.regionId])" :class=" region_media[item.regionId].currentMedia < region_media[item.regionId].allMedias ? 'caret-right-no' : 'caret-right-normal'"></i>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--保存为模板组件-->
		<add-template :template_dialog="template_dialog" :layoutid="layout.id" v-on:close_dialog="cloe_template"></add-template>
		<!--图片预览组件-->
		<image-preview v-on:close_preview="close_preview" :media_preview_path="media_preview_path" :image_preview_show="image_preview_show"></image-preview>
		<!--视频预览组建-->
		<video-preview v-on:close_preview="close_preview" :media_preview_path="media_preview_path" :media_previe_live="media_previe_live"
		 :video_preview_show="video_preview_show"></video-preview>
		<!-- 直播预览 -->
		<live-preview v-on:close_preview="close_preview" :media_preview_path="media_preview_path" :media_previe_live="media_previe_live"
		 :video_preview_show="live_preview_show">

		</live-preview>
		<!--图片增加编辑-->
		<image-region v-on:save_media="save_media" v-on:close_region="close_region" :region_image_dialog="add_regions.region_image_dialog"
		 :dropregionid="dropregionid" :media_list_edit_item="media_list_edit_item"></image-region>
		<!--视频增加编辑-->
		<!--add_regions.region_video_dialog-->
		<video-region v-on:save_media="save_media" v-on:close_region="close_region" :region_video_dialog="add_regions.region_video_dialog"
		 :media_list_edit_item="media_list_edit_item" :dropregionid="dropregionid"></video-region>
		<!--文本组件-->
		<text-region v-on:save_media="save_media" v-on:close_region="close_region" :region_text_dialog="add_regions.region_text_dialog"
		 :media_list_edit_item="media_list_edit_item" :dropregionid="dropregionid"></text-region>
		<!-- 网页 -->
		<webpage-region v-on:save_media="save_media" v-on:close_region="close_region" :region_webpage_dialog="add_regions.region_webpage_dialog"
		 :media_list_edit_item="media_list_edit_item" :dropregionid="dropregionid"></webpage-region>
		<!--素材编辑-->
		<media-list :regionId="layout.regionId" :layoutId="layout.id" v-on:close_region="close_region"
		 v-on:dele_media_success="dele_media_success" v-on:save_media_sort="save_media_sort" v-on:media_edit="media_edit"
		 :media_lsit_edit="media_lsit_edit" :media_lsit_dialog="media_lsit_dialog"></media-list>
		<!--编辑布局弹框-->
		<add-layout :add_layout_dialog="add_layout_dialog" :edit_obj="edit_obj" v-on:close_dialog="close_dialog"
		 v-on:modal_success="close_dialog"></add-layout>
	</div>
</template>

<script>
	import Vue from "vue";
	import "../../../static/liMarquee/liMarquee.css";
	import AddTemplate from "./layout/addTemplate";
	import VueDraggableResizable from "vue-draggable-resizable";
	import {
		http
	} from "../../api/config";
	import ImagePreview from "./layout/imagePreview";
	import videoPreview from "./layout/videoPreview";
	import livePreview from './layout/livePeview';
	import RouterX from "./layout/routerX";
	import RouterY from "./layout/routerY";
	import ImageRegion from "./layout/imageRegion";
	import VideoRegion from "./layout/videoRegion";
	import TextRegion from "./layout/textRegion";
	import WebpageRegion from "./layout/webpageRegion";
	import MediaList from "./layout/mediaList";
	import addLayout from "./layout/addLayout";
	import Limarquee from "limarquee";
	require("webpack-jquery-ui");
	// require ('webpack-jquery-ui / css')// ommit，如果你不想加载基本的css主题

	export default {
		name: "layout-design",
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit("pageName", to.name);
				vm.$emit("materialName", "1");
			});
		},
		components: {
			VueDraggableResizable,
			AddTemplate,
			ImagePreview,
			videoPreview,
			RouterX,
			RouterY,
			ImageRegion,
			VideoRegion,
			livePreview,
			TextRegion,
			WebpageRegion,
			MediaList,
			addLayout
		},
		data: function() {
			return {
				listData: ["item2", "item3"],
				add_layout_dialog: false,
				edit_obj: {},
				add_region_x: "",
				add_region_y: "",
				start_drop_mouse: false, //用来获取拖拽结束时的位置
				dragging: false,
				media_list_edit_item: {}, //media编辑时的对象
				media_lsit_edit: [], //素材编辑

				media_lsit_dialog: false, //素材编辑弹框是否显示
				show_region_action: -1,
				region_media: {}, //region下的media
				startdrop: false,
				dropregionid: "",
				isaddregion: false, //是否增加区域
				media_drag: {},
				media_preview_path: "", //素材预览地址
				media_previe_live: false, //预览是否是直播
				image_preview_show: false,
				video_preview_show: false,
				live_preview_show: false,
				template_dialog: false,
				layout: {
					x: "",
					y: "",
					h: "",
					w: "",
					id: "",
					regions: [],
					campaignId: "",
					regionId: "",
					background: "#000000",
					activeId: "",
					width: "",
					height: "",
					draw_init: false,
					draw_resize: false,
					keepscan: false,
					scan: 1
				},
				add_regions: {
					region_image_dialog: false,
					region_video_dialog: false,
					region_text_dialog: false,
					region_webpage_dialog: false
				},
				source_name: "",
				media_type: "image",
				media_list: [],
				font_size: [{
						value: "16"
					},
					{
						value: "18"
					},
					{
						value: "20"
					}
				],
				font_size_value: ""
			};
		},
		computed: {
			checkhtml() {
				var _this = this;
				return function(str) {
					var htmleditor = str;
					var nowTime = _this.strToTime();
					var reg = new RegExp('\\[Clock\\|DD/MM/YYYY]','g');;
					var result = htmleditor.replace(reg,nowTime);
					return result;
				};
			},
			istable() {
				var _this = this;
				return function(id) {
					var item = _this.region_media[id];
					if (item) {
						var scaleType = item.medias[0].options.scaleType;
						if (scaleType == "center") {
							return "display-table";
						} else {
							return "no-table";
						}
					}
				};
			},
			region_width_com() {
				var _this = this;
				return function(width) {
					var percent = parseInt((width / _this.layout.width) * 100) + "%";
					console.log("width" + percent);
					return percent;
				};
			},
			region_height_com() {
				var _this = this;
				return function(height) {
					var percent = parseInt((height / _this.layout.height) * 100) + "%";
					console.log("height" + percent);
					return percent;
				};
			},
			region_left_com() {
				var _this = this;
				return function(left) {
					var percent = parseInt((left / _this.layout.width) * 100) + "%";
					console.log("left" + percent);
					return percent;
				};
			},
			region_top_com() {
				var _this = this;
				return function(top) {
					var percent = parseInt((top / _this.layout.height) * 100) + "%";
					console.log("top" + percent);
					return percent;
				};
			}
		},
		filters: {
			media_type: function(item) {
				var type = item.type;
				var path = "";
				switch (type) {
					case "image":
						if (item.options) {
							path = http.url + item.options.uri;
						} else {
							path = http.url + item.path;
						}
						break;
					case "video":
						path = require("../../../static/images/video.png");
						break;
					case "webpage":
						path = require("../../../static/images/webpage.png");
						break;
					case "text":
						path = require("../../../static/images/text.png");
						break;
					case "live":
						path = require("../../../static/images/live.png");
						break;
				}
				return path;
			},
			region_media_img: function(item) {
				if (item.type == "image") {
					var scaleType = item.options.scaleType;
					//拉伸
					if (scaleType == "stretch") {
						return "stretch";
					} else {
						//保持宽高比
						return "scanimage";
					}
				} else {
					return "noimage";
				}
			}
		},
		mounted: function() {
			var _this = this;
			_this.get_media();
			_this.layout.id = _this.$route.params.id;
			_this.read_layout();
			$(".regionsbox").resizable({
				minHeight: 250,
				minWidth: 450,
				containment: ".regionsboxcontainer",
				// 				create: function() {
				// 					$(this).find(".ui-resizable-e").css("background", _this.layout.background);
				// 					$(this).find(".ui-resizable-s").css("background", _this.layout.background);
				// 					$(this).find(".ui-resizable-se").css({
				// 						background: _this.layout.background,
				// 						right: "-5px",
				// 						bottom: "-5px"
				// 					});
				// 				},
				resize: function(e, re) {
					_this.layout.w = re.size.width;
					_this.layout.h = re.size.height;
				},
				stop: function(e, re) {
					_this.layout.w = re.size.width;
					_this.layout.h = re.size.height;
					_this.layout.draw_resize = false;
					_this.save_layout("draw");
				}
			});
		},
		methods: {
			//布局滚动
			drawScroll() {
				var _this = this;
				var scrollContainer = $('.draw-box');
				var scrollH = scrollContainer[0].scrollLeft;
				var scrollT = scrollContainer[0].scrollTop;
				$('.scale-x').css('top', scrollT);
				$('.scale-y').css('left', scrollH);
			},
			strToTime() {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var day = now.getDate();
				// var weak = now.getDay();
				var hour = now.getHours();
				var minute = now.getMinutes();
				if (hour < 10) {
					hour = "0" + hour;
				}
				if (minute < 10) {
					minute = "0" + minute;
				}
				return day + "/" + month + "/" + year;
			},
			//获取今天的日期
			getNowFormatDate: function(day) {
				var day = day || 0;
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				var hour = date.getHours();
				var minute = date.getMinutes();
				var second = date.getSeconds();
				hour = hour < 10 ? '0' + hour : hour;
				minute = minute < 10 ? '0' + minute : minute;
				second = second < 10 ? '0' + second : second;
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate =
					year + seperator1 + month + seperator1 + strDate + ' ' + hour + ':' + minute + ':' + second;
				return currentdate;
			},
			//鼠标进入region
			enter_region(e) {
				$(e.currentTarget)
					.find(".my-menu")
					.show();
			},
			//鼠标离开region
			out_region(e) {
				$(e.currentTarget)
					.find(".my-menu")
					.hide();
				$(e.currentTarget)
					.find("ul")
					.hide();
			},
			show_menu_li(e) {
				$(e.currentTarget)
					.next()
					.show();
				e.preventDefault();
				e.stopPropagation();
			},
			//media排序
			media_edit: function(item, index) {
				var _this = this;
				var type = item.type;
				switch (type) {
					case "image":
						_this.add_regions.region_image_dialog = true;
						break;
					case "video":
						_this.add_regions.region_video_dialog = true;
						break;
					case "live":
						_this.add_regions.region_video_dialog = true;
						break;
					case "text":
						_this.add_regions.region_text_dialog = true;
						break;
					case "webpage":
						_this.add_regions.region_webpage_dialog = true;
						break;
				}
				_this.media_list_edit_item = item;
			},
			//media排序成功
			save_media_sort: function() {
				this.media_lsit_dialog = false;
				this.$message.success(
					this.$t("message.layoutManage.media_order_success")
				);
			},
			//media删除成功
			dele_media_success: function() {
				this.read_layout();
			},
			enterRegion: function(index) {
				this.show_region_action = index;
			},
			outRegion: function($event) {
				// this.show_region_action = -1
			},
			//上一个素材
			pre_media: function($event, item) {
				$event.stopPropagation();
				var _this = this;
				var seq = item.currentMedia;
				if (seq <= 1) {
					_this.$message.warning(_this.$t("message.layoutManage.pre_media"));
					return false;
				}
				_this.get_region_media(seq - 1, item);
			},
			//下一个素材
			next_media: function($event, item) {
				$event.stopPropagation();
				var _this = this;
				var seq = item.currentMedia;
				var max = item.allMedias;
				if (seq >= max) {
					_this.$message.warning(_this.$t("message.layoutManage.next_media"));
					return false;
				}
				_this.get_region_media(seq - 0 + 1, item);
			},
			//更新到显示器
			update_display: function() {
				var _this = this;
				_this
					.LonbonAjax({
						url: http.NotifyDisplays,
						type: "POST",
						data: {
							campaignId: _this.layout.campaignId
						}
					})
					.then(
						function() {
							_this.$message({
								message: _this.$t(
									"message.layoutManage.design.updata_display_success"
								),
								type: "success"
							});
						},
						function() {
							// _this.$message.error(_this.$t('message.layoutManage.design.updata_display_error'));
						}
					);
			},
			//关闭预览
			close_preview: function(type) {
				this.media_preview_path = "";
				this[type] = false;
			},
			//素材预览
			preview_media: function(item) {
				var type = item.type;
				this.media_preview_path = http.url + item.path;
				switch (type) {
					case "image":
						this.image_preview_show = true;
						break;
					case "video":
						this.media_previe_live = false;
						this.video_preview_show = true;
						break;
					case "live":
						this.media_previe_live = true;
						this.media_preview_path = item.path;
						this.live_preview_show = true;
						break;
					case "text":
						break;
					case "webpage":
						break;
				}
			},
			//关闭模板弹框
			cloe_template: function() {
				this.template_dialog = false;
			},
			//保存为模板
			save_as_template: function() {
				var _this = this;
				_this.template_dialog = true;
			},
			//返回布局列表
			go_back: function() {
				this.$confirm(
						this.$t("message.layoutManage.back_sure"),
						this.$t("message.releaseManage.tip"), {
							title: " ",
							type: "warning",
							closeOnClickModal: false
						}
					)
					.then(() => {
						this.$router.push("/release/layout");
					})
					.catch(() => {
						// this.$message({
						//   type: 'info',
						//   message: this.$t('message.releaseManage.deleted_deleted')
						// });
					});
			},
			//布局缩放
			onResize: function(x, y, width, height) {
				this.layout.x = x;
				this.layout.y = y;
				this.layout.w = width;
				this.layout.h = height;
			},
			//region缩放结束
			resizeStop: function(id) {
				var width = "";
				var height = "";
				this.layout.draw_resize = true;
				console.log(this.layout.w * this.layout.scan);
				if (this.layout.w >= this.layout.h) {} else {}
				console.log(this.layout.scan);
				// $("#"+id).parent().width(500);
				// console.log(this.layout.keepscan)
				// this.save_layout();
			},
			//画布缩放结束
			drawresizeStop(x, y, width, height) {
				var _this = this;
				_this.layout.width = width;
				_this.layout.height = height;
				_this.layout.draw_resize = false;
				this.save_layout("draw");
			},
			//画布缩放时
			draw_resizing(x, y, width, height) {},
			//region拖拽时
			onDrag: function(x, y) {
				this.layout.x = x;
				this.layout.y = y;
				this.dragging = true;
			},
			//region 拖拽结束
			onDragestop() {
				if (this.dragging == true) {
					this.dragging = false;
					this.save_layout();
				}
			},
			//搜索media
			search_media: function(type) {
				var _this = this;
				_this.media_type = type;
				_this.get_media();
			},
			//获取media
			get_media: function() {
				var _this = this;
				_this
					.LonbonAjax({
						url: http.media,
						type: "GET",
						data: {
							limit: 0,
							mediaType: _this.media_type,
							mediaName: _this.source_name
						}
					})
					.then(
						function(res) {
							var data = res.data;
							_this.media_list = data;
						},
						function(res) {
							_this.media_list = [{
								type: "nodata"
							}];
						}
					);
			},
			//media开始拖动
			mediadragstart: function($event, item) {
				var _this = this;
				_this.startdrop = true;
				var item = JSON.stringify(item);
				$event.dataTransfer.setData("Text", item);
				// _this.media_drag = item;
			},
			//允许拖动
			allowDrop: function($event) {
				$event.preventDefault();
			},
			//双击编辑
			dbedit: function(id) {
				var item = {
					type: "edit",
					regionId: id
				};
				this.edit_region(item);
			},
			//删除region
			dele_region: function(regionId) {
				var _this = this;
				_this
					.LonbonAjax({
						url: http.layoutRegions + "/" + _this.layout.id,
						type: "DELETE",
						data: {
							regionId: regionId
						}
					})
					.then(
						function() {
							_this.layout.regions.forEach((item, index) => {
								var id = item.regionId;
								if (id == regionId) {
									_this.layout.regions.splice(index, 1);
								}
							});
							_this.$message.success(
								_this.$t("message.layoutManage.dele_region_success")
							);
							_this.read_layout();
						},
						function(res) {
							_this.$message.error(res.message);
						}
					);
			},
			//编辑region
			edit_region: function(item) {
				var _this = this;
				if (item) {
					_this.layout.regionId = item.regionId;
				}
				_this
					.LonbonAjax({
						url: http.layoutMedias + "/" + _this.layout.regionId,
						type: "GET",
						data: {
							layoutId: _this.layout.id,
							width: item.width,
							height: item.height
						}
					})
					.then(
						function(res) {
							_this.media_lsit_dialog = true;
							_this.media_lsit_edit = res.data.medias;
						},
						function(res) {
							_this.media_lsit_dialog = true;
						}
					);
			},
			//取消增加region
			close_region: function(type) {
				var _this = this;
				var type = type;
				switch (type) {
					case "image":
						_this.add_regions.region_image_dialog = false;
						break;
					case "video":
						_this.add_regions.region_video_dialog = false;
						break;
					case "live":
						_this.add_regions.region_video_dialog = false;
						break;
					case "text":
						_this.add_regions.region_text_dialog = false;
						break;
					case "webpage":
						_this.add_regions.region_webpage_dialog = false;
						break;
					default:
						_this.media_lsit_dialog = false;
				}

			},
			//增加一个region
			dropover(ev, item, index) {
				var _this = this;
				if (_this.start_drop_mouse) {
					var offsetX = $(".regionsbox")[0].getBoundingClientRect().left;
					var offsetY = $(".regionsbox")[0].getBoundingClientRect().top;
					var regionx = parseInt(ev.clientX - offsetX) - 120;
					var regiony = parseInt(ev.clientY - offsetY) - 120;
					if (regionx < 0) {
						regionx = 0;
					}
					if (regionx > _this.layout.width - 250) {
						regionx = _this.layout.width - 250;
					}
					if (regiony < 0) {
						regiony = 0;
					}
					if (regiony > _this.layout.height - 250) {
						regiony = _this.layout.height - 290;
					}
					_this.add_region_y = regiony;
					_this.add_region_x = regionx;
					_this.start_drop_mouse = false;
					var type = item.type;
					//增加一个区域
					if (index >= 0) {
						_this.dropregionid = "";
						switch (type) {
							case "image":
								_this.add_regions.region_image_dialog = true;
								break;
							case "video":
								_this.add_regions.region_video_dialog = true;
								break;
							case "live":
								_this.add_regions.region_video_dialog = true;
								break;
							case "text":
								_this.add_regions.region_text_dialog = true;
								break;
							case "webpage":
								_this.add_regions.region_webpage_dialog = true;
								break;
						}
					}
				}
				ev.preventDefault();
				return false;
			},
			//拖拽增加一个region(画布)
			drop: function($event) {
				var _this = this;
				var draw_box = $($event.currentTarget);
				if (!_this.startdrop) {
					return false;
				}
				if ($($event.currentTarget).hasClass("draw-box")) {
					_this.start_drop_mouse = true;
				}
				_this.startdrop = false;
				var item = $event.dataTransfer.getData("Text", item);
				_this.isaddregion = true;
				item = JSON.parse(item);
				_this.media_list_edit_item = item;
				_this.media_drag = item;
				_this.dropover(
					$event,
					item,
					$event.target.getAttribute("class").indexOf("regionsbox")
				);
				return false;
			},
			//拖拽直接给region增加一个media
			drop_media: function($event, region) {
				$event.preventDefault();
				var _this = this;
				var item = $event.dataTransfer.getData("Text", item);
				if (!_this.startdrop) {
					return false;
				}
				item = JSON.parse(item);
				var dropNmae = item.name;
				var type = item.type;
				_this
					.LonbonAjax({
						url: http.layoutMedias + "/" + region.regionId,
						type: "GET",
						data: {
							layoutId: _this.layout.id,
							width: region.width,
							height: region.height
						}
					})
					.then(
						function(res) {
							res.data.medias.forEach((itemregion, index) => {
								var itemName = itemregion.mediaName;
								if (itemName == dropNmae) {
									item.name = dropNmae + _this.getNowFormatDate();
									console.log(_this.getNowFormatDate())
									item.title = dropNmae + "已存在，自动加上当前日期防止冲突";
								}
							});
							_this.layout.regionId = region.regionId;
							_this.startdrop = false;
							_this.media_drag = item;
							_this.isaddregion = true;
							_this.dropregionid = region.regionId;
							_this.media_list_edit_item = item;
							switch (type) {
								case "image":
									_this.add_regions.region_image_dialog = true;
									break;
								case "video":
									_this.add_regions.region_video_dialog = true;
									break;
								case "live":
									_this.add_regions.region_video_dialog = true;
									break;
								case "text":
									_this.add_regions.region_text_dialog = true;
									break;
								case "webpage":
									_this.add_regions.region_webpage_dialog = true;
									break;
							}
						},
						function(res) {
							_this.layout.regionId = region.regionId;
							_this.startdrop = false;
							_this.media_drag = item;
							_this.isaddregion = true;
							var type = item.type;
							_this.dropregionid = region.regionId;
							_this.media_list_edit_item = item;
							switch (type) {
								case "image":
									_this.add_regions.region_image_dialog = true;
									break;
								case "video":
									_this.add_regions.region_video_dialog = true;
									break;
								case "live":
									_this.add_regions.region_video_dialog = true;
									break;
								case "text":
									_this.add_regions.region_text_dialog = true;
									break;
								case "webpage":
									_this.add_regions.region_webpage_dialog = true;
									break;
							}
						}
					);
			},
			//保存media
			save_media: function(option, dropregionid, item) {
				var _this = this;
				//编辑
				if (item.mediaName) {
					_this.edit_media(option, item);
				} else if (dropregionid) {
					//直接区域内加media
					_this.add_media(option);
				} else {
					//先增加区域
					_this.add_region(option);
				}
			},
			//一个布局增加一个区域
			add_region: function(option) {
				var _this = this;
				var data = {
					layoutId: _this.layout.id,
					left: _this.add_region_x,
					top: _this.add_region_y
				};
				console.log("增加一个区域时的数据");
				console.log(data);
				_this
					.LonbonAjax({
						url: http.layoutRegions,
						type: "POST",
						data: data
					})
					.then(
						function(res) {
							_this.layout.regionId = res.data;
							_this.add_media(option);
							_this.$message.success(
								_this.$t("message.layoutManage.add_region_success")
							);
						},
						function() {
							_this.$message.error(
								_this.$t("message.layoutManage.add_region_error")
							);
						}
					);
			},
			//一个区域增加一个media
			add_media: function(option) {
				var _this = this;
				var option = JSON.stringify(option);
				var mediaid = _this.media_drag.mediaId;
				mediaid = "[" + mediaid + "]";
				var data = {
					layoutId: _this.layout.id,
					regionId: _this.layout.regionId,
					mediaId: mediaid,
					type: _this.media_drag.type,
					options: option
				};
				console.log(data);
				_this
					.LonbonAjax({
						url: http.layoutMedias,
						type: "POST",
						data: data
					})
					.then(
						function(res) {
							console.log(res);
							_this.$message.success(
								_this.$t("message.layoutManage.add_media_success")
							);
							_this.close_region(_this.media_drag.type);
							_this.read_layout();
						},
						function(res) {
							_this.$message.error(
								_this.$t("message.layoutManage.add_media_error")
							);
							console.log(res);
						}
					);
			},
			//一个区域编辑一个media
			edit_media: function(option, item) {
				console.log(item)
				var _this = this;
				var option = JSON.stringify(option);
				var lkId = item.lkId;
				var data = {
					layoutId: _this.layout.id,
					mediaId: item.mediaId,
					type: item.type,
					options: option
				};
				if (lkId) {
					data.lkId = lkId;
				}
				console.log(data);
				_this
					.LonbonAjax({
						url: http.layoutMedias + "/" + _this.layout.regionId,
						type: "PUT",
						data: data
					})
					.then(
						function(res) {
							_this.$message.success(
								_this.$t("message.layoutManage.edit_media_success")
							);
							var type = item.type;
							switch (type) {
								case "image":
									_this.add_regions.region_image_dialog = false;
									break;
								case "video":
									_this.add_regions.region_video_dialog = false;
									break;
								case "live":
									_this.add_regions.region_video_dialog = false;
									break;
								case "text":
									_this.add_regions.region_text_dialog = false;
									break;
								case "webpage":
									_this.add_regions.region_webpage_dialog = false;
									break;
							}
							_this.read_layout();
							_this
								.LonbonAjax({
									url: http.layoutMedias + "/" + _this.layout.regionId,
									type: "GET",
									data: {
										layoutId: _this.layout.id,
										width: item.width,
										height: item.height
									}
								})
								.then(
									function(res) {
										_this.media_lsit_dialog = true;
										// _this.media_lsit_edit = res.data.medias;
										res.data.medias.forEach((item, index) => {
											if (lkId == item.lkId) {
												_this.$set(_this.media_lsit_edit, index, item);
											}
										})
									},
									function(res) {
										_this.media_lsit_dialog = true;
									}
								);
						},
						function(res) {
							_this.$message.error(
								_this.$t("message.layoutManage.edit_media_error")
							);
							console.log(res);
						}
					);
			},
			//读取一个布局信息
			read_layout: function() {
				var _this = this;
				_this.layout.draw_init = false;
				_this
					.LonbonAjax({
						url: http.getLayout + "/" + _this.layout.id,
						type: "GET"
					})
					.then(
						function(res) {
							_this.layout.background = $($(res.data.xml)).children().parent().attr('bgcolor') || $($(res.data.xml)[2]).attr(
								'bgcolor');
							$('.regionsbox .ui-resizable-e').css("background", _this.layout.background);
							$('.regionsbox .ui-resizable-s').css("background", _this.layout.background);
							$('.regionsbox .ui-resizable-se').css({
								background: _this.layout.background,
								right: "-5px",
								bottom: "-5px"
							});
							_this.layout.draw_init = true;
							_this.layout.campaignId = res.data.campaignId;
							_this.$set(_this.layout, "width", res.data.layoutWidth);
							_this.layout.height = res.data.layoutHeight;
							console.log(res.data.layoutWidth)
							_this.get_region();
						},
						function(res) {
							console.log(res);
						}
					);
			},
			//获取一个布局下的region
			get_region: function() {
				var _this = this;
				_this
					.LonbonAjax({
						url: http.layoutRegions + "/" + _this.layout.id,
						type: "GET"
					})
					.then(
						function(res) {
							console.log(res)
							_this.layout.regions = res.data;
							_this.layout.keepscan = false;
							$("#keepscanBtn").attr(
								"src",
								require("../../../static/images/noscan.png")
							);
							if (_this.layout.regions) {
								var tmparr = [];
								_this.region_media = {};
								_this.layout.regions.forEach((item, index) => {
									_this.get_region_media(1, item);
									var percentH = (item.regionHeight / _this.layout.height) * 100;
									var percentW = (item.regionWidth / _this.layout.width) * 100;
									var percentL = (item.regionLeft / _this.layout.width) * 100;
									var percentT = (item.regionTop / _this.layout.height) * 100;;
									item.percentH = percentH;
									item.percentW = percentW;
									item.percentL = percentL;
									item.percentT = percentT;
									tmparr.push(item);
									console.log(
										"region的高度" +
										item.regionHeight +
										"region的宽度" +
										item.regionWidth
									);
								});
								_this.layout.regions = tmparr;
								console.log("获取画布的宽度" + _this.layout.width);
								console.log("获取画布的高度" + _this.layout.height);
								console.log(
									"------------------获取的region信息----------------------"
								);
							}
						},
						function(res) {
							_this.region_media = {};
							_this.layout.regions = [];
						}
					);
			},
			//获取一个region下的media
			get_region_media: function(seq, item) {
				var _this = this;
				var data = {
					layoutId: _this.layout.id,
					seq: seq,
					width: item.regionWidth,
					height: item.regionHeight
				};
				_this
					.LonbonAjax({
						url: http.layoutMedias + "/" + item.regionId,
						type: "GET",
						data: data
					})
					.then(
						function(res) {
							var regionid = item.regionId;
							res.data.regionWidth = item.regionWidth;
							res.data.regionHeight = item.regionHeight;
							res.data.regionLeft = item.regionLeft;
							res.data.regionTop = item.regionTop;
							res.data.regionId = item.regionId;
							console.log(res)
							Vue.set(_this.region_media, regionid, res.data);
							_this.regionInit();
							_this.$nextTick(function() {
								$(".container").each(function(index, ele) {
									var classname = $(ele).attr("classname");
									var effect = $(ele).attr("effect");
									var speed = $(ele).attr("speed") || 5;
									switch (effect) {
										case "marqueeLeft":
											effect = "left";
											break;
										case "marqueeRight":
											effect = "right";
											break;
										case "marqueeUp":
											effect = "up";
											break;
										case "marqueeDown":
											effect = "down";
											break;
									}
									if (effect != "none") {
										var limarquee = new Limarquee("." + classname);
										limarquee.render({
											direction: effect, // 滚动方向，可选 left / right / up / down
											loop: -1, // 循环次数，-1 为无限循环
											scrolldelay: 0, // 每次重复之前的延迟
											scrollamount: speed * 100, // 滚动速度，越大越快
											circular: true, // 无缝滚动，如果为 false， 则和 marquee 效果一样
											drag: false, // 鼠标可拖动
											runshort: true, // 内容不足是否滚动
											hoverstop: true, // 鼠标悬停暂停
											xml: false, // 加载 xml 文件
											inverthover: false // 反向，即默认不滚动，鼠 标悬停滚动
										});
										return false;
									}
									
								});
							});
						},
						function(res) {
							_this.region_media = {};
							_this.regionInit();
						}
					);
			},
			//保存布局设计
			save_layout: function(draw) {
				var _this = this;
				var layout_data = {
					layoutWidth: parseInt($(".regionsbox").width()),
					layoutHeight: parseInt($(".regionsbox").height()),
					backGround: _this.layout.background
				};
				console.log(
					"保存的画布的宽" +
					_this.layout.width +
					",保存的高度" +
					_this.layout.height
				);
				// 先保存layout
				_this
					.LonbonAjax({
						url: http.setBackground + "/" + _this.layout.id,
						type: "POST",
						data: layout_data
					})
					.then(function() {
						let regions = [];
						$(".regionsbox .region-media-show-box").each(function(ind, ele) {
							var self = $(ele);
							var regionid = self.attr("id");
							var regionobj = {};
							var region_width = parseInt(self.width());
							var region_height = parseInt(self.height());
							var top = parseInt(self.position().top);
							var left = parseInt(self.position().left);
							regionobj.width = region_width;
							regionobj.height = region_height;
							regionobj.top = top;
							regionobj.left = left;
							regionobj.regionid = regionid;
							regions.push(regionobj);
						});
						//layout没有区域
						if (regions.length == 0) {
							return false;
						}
						regions = JSON.stringify(regions);
						_this
							.LonbonAjax({
								url: http.layoutRegions + "/" + _this.layout.id,
								type: "PUT",
								data: {
									regions: regions
								}
							})
							.then(
								function() {
									_this.$message.success(
										_this.$t("message.layoutManage.layout_edit_success")
									);
									_this.layout.regions = [];
									_this.read_layout();
								},
								function(res) {
									_this.$message.warning(res.message);
								}
							);
					});
			},
			//布局背景色改变
			layout_background_change() {
				var _this = this;
				var layout_width = $(".regionsbox").width();
				var layout_height = $(".regionsbox").height();
				_this
					.LonbonAjax({
						url: http.setBackground + "/" + _this.layout.id,
						type: "POST",
						data: {
							layoutWidth: layout_width,
							layoutHeight: layout_height,
							backGround: _this.layout.background
						}
					})
					.then(
						function() {
							$(".regionsbox").css("background", _this.layout.background);
							// 							$(".regionsbox")
							// 								.find(".ui-resizable-e")
							// 								.css({
							// 									background: _this.layout.background,
							// 									opcity: "0"
							// 								});
							// 							$(".regionsbox")
							// 								.find(".ui-resizable-s")
							// 								.css({
							// 									background: _this.layout.background,
							// 									opcity: "0"
							// 								});
							// 							$(".regionsbox")
							// 								.find(".ui-resizable-se")
							// 								.css({
							// 									background: _this.layout.background,
							// 									right: "-5px",
							// 									bottom: "-5px",
							// 									opcity: "0"
							// 								});
						},
						function(res) {
							_this.$message.warning(res.message);
						}
					);
			},
			//点击region增加选中状态
			clikregion(id) {
				var _this = this;
				var ele = $("#" + id);
				ele
					.siblings()
					.css("border", "1px solid " + _this.layout.background)
					.removeClass("activeregion");
				ele.css("border", "2px dashed #008000").addClass("activeregion");
			},
			keepscan(e) {
				var _this = this;
				var ele = $(e.currentTarget);
				this.layout.keepscan = !this.layout.keepscan;
				if (this.layout.keepscan == true) {
					ele.attr("src", require("../../../static/images/keepscan.png"));
					this.layout.scan = this.layout.x / this.layout.h;
					$(".regionsbox .activeregion").resizable("destroy");
					var width = $(".regionsbox .activeregion").width();
					var height = $(".regionsbox .activeregion").height();
					$(".regionsbox .activeregion").resizable({
						minHeight: 100,
						minWidth: 150,
						handles: "e,s,w,n,se,sw,ne,nw",
						containment: ".regionsbox",
						aspectRatio: width / height,
						resize: function(e, re) {
							_this.layout.w = parseInt(re.size.width);
							_this.layout.h = parseInt(re.size.height);
						},
						stop: function() {
							ele.attr("src", require("../../../static/images/noscan.png"));
							_this.save_layout();
						}
					});
				} else {
					ele.attr("src", require("../../../static/images/noscan.png"));
				}
			},
			regionInit() {
				var _this = this;
				$(".regionsbox .region-media-show-box").resizable({
					minHeight: 200,
					minWidth: 180,
					containment: ".regionsbox",
					handles: "e,s,w,n,se,sw,ne,nw",
					resize: function(e, re) {
						_this.layout.w = parseInt(re.size.width);
						_this.layout.h = parseInt(re.size.height);
					},
					stop: function() {
						_this.save_layout();
					}
				});
				$(".regionsbox .region-media-show-box").draggable({
					containment: ".regionsbox",
					scroll: false,
					drag: function(e, dg) {
						_this.layout.x = parseInt(dg.position.left);
						_this.layout.y = parseInt(dg.position.top);
					},
					stop: function() {
						_this.save_layout();
					}
				});
			},
			//编辑布局
			edit_layout() {
				var _this = this;
				_this
					.LonbonAjax({
						url: http.getLayout + "/" + _this.layout.id,
						type: "GET"
					})
					.then(
						function(res) {
							_this.add_layout_dialog = true;
							_this.edit_obj = res.data;
						},
						function(res) {
							_this.$message.waring(res.message);
						}
					);
			},
			close_dialog() {
				this.add_layout_dialog = false;
			}
		}
	};
</script>

<style scoped lang='less'>
	
	.design-layout-header .el-color-picker {
		position: relative;
		top: 15px;
	}

	.previewBtn {
		color: white;
		text-decoration: none;
	}

	.design {
		height: 100%;
		background: #ffffff;
	}

	.design-header {
		padding-top: 1.875rem;
		padding-left: 45px;
		padding-right: 28px;

		button:not(:first-child) {
			margin-right: 1%;
		}

		button {

			padding: 0 2%;

		}

		.fl {
			float: right;
		}
	}

	.design-main {
		height: 90%;
		padding: 30px 30px 30px 30px;
	}

	.design-box {
		height: 100%;
		border: 1px solid #c9c9c9;
		border-radius: 8px;
	}

	.design-source-list {
		float: left;
		width: 5%;
		height: 100%;
		border-right: 1px solid #c9c9c9;

		li {
			padding: 0.8em 0;
			text-align: center;
		}

		.active {
			background: #cdfafa;
		}
	}

	.design-source-box {
		border-right: 1px solid #c9c9c9;
		padding: 5px;
		float: left;
		width: 10%;
		height: 100%;
		overflow-x: hidden;

		li {
			margin-top: 20px;
			cursor: move;
			width: 100%;
			height: 95px;
			position: relative;
			text-align: center;
		}

		.live-li {
			text-align: left;
			height: 30px;
			line-height: 30px;
			overflow: hidden;
			position: relative;

			img {
				width: 1.875em;
				height: 1.875em;
				float: left;
			}

			span {
				position: absolute;
				left: 2em;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 10px;
				width: 50%;
			}

			.eyebox {
				width: 22px;
				height: 20px;
				position: absolute;
				top: 10px;
				left: 75%;
				cursor: pointer;
			}
		}

		.media-img {
			height: 100%;
			width: auto;
			max-width: 100%;
			/*width: 100%;*/
		}

		.media-info {
			text-align: left;
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 0;
			background: rgba(203, 203, 203, 0.9);
			color: #ffffff;
			height: 30px;
			line-height: 30px;
			padding: 0 5px;

			span {
				display: inline-block;
				width: 80%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.eyebox {
				cursor: pointer;
				color: #ffffff;
				cursor: pointer;
				height: 30px;
				line-height: 30px;
				width: 22px;
				position: absolute;
				right: 0;
				top: 0;

				i {
					display: inline-block;
					width: 20px;
					height: 20px;
					background: red;
				}
			}
		}
	}

	.design-layout {
		width: 84%;
		float: right;
		height: 100%;
		border-left: 1px solid #c9c9c9;

		.design-layout-header {
			label {
				margin-left: 25px;
			}

			img {
				margin-left: 25px;
				position: relative;
				top: 12px;
			}

			input[type="text"] {
				padding-left: 10px;
			}

			input[type="color"] {
				position: relative;
				top: 6px;
			}
		}
	}

	.design-contain {
		overflow: hidden;
		margin-top: 2%;
		position: relative;
		/*padding-left: 2.56rem;*/
		/*padding-top: 2.56rem;*/
		height: 84%;
		width: 100%;

		.scale-x {
			position: absolute;
			background: white;
			top: 0px;
			width: 1920px;
			height: 40px;
			z-index: 12;
		}

		.scale-y {
			z-index: 12;
			background: white;
			position: absolute;
			top: 40px;
			left: 0px;
			height: 1080px;
			width: 40px;
			padding-top: 20px;

			li {
				position: relative;
				width: 10px;
				height: 20px;
				border-bottom: 1px solid gray;
				border-left: 1px solid transparent;
			}

			span {
				text-decoration: none;
				display: block;
				position: absolute;
				height: 20px;
				line-height: 20px;
				left: 0;
			}
		}
	}

	.draw-box {
		position: relative;
		width: 99%;
		height: 95%;
		padding: 40px;
		padding-left: 60px;
		overflow: scroll;
	}

	.regionsbox {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		background: #000000;
	}

	.darw-layout {
		background: white;
	}

	.region-media-box {
		width: 100%;
		height: 100%;
	}

	.display-table {
		display: table;
	}

	//region
	.region-media-show-box {
		/*cursor: pointer;*/
		z-index: 11;
		width: 100%;
		height: 100%;
		position: absolute;
		overflow: hidden;
		background: whitesmoke;

		.ui-resizable-s {
			background: blue;
		}

		.ui-resizable-s2 {
			width: 10px;
			height: 10px;
			bottom: 0;
			right: 0;
		}

		.region-action-box {
			z-index: 10;
			height: 30px;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;

			.my-menu {
				top: 0px;
				right: -10px;
				position: absolute;
				width: 112px !important;
				display: none;
			}
		}

		ul {
			display: none;
			color: #6f6f6f;
			width: 112px;
			top: 2.25em;
			right: 0;
			position: absolute;
			background: white;
			border: 1px solid #c6c6c6;
			border-radius: 8px;

			li {
				height: 30px;
				line-height: 30px;
				text-indent: 2px;
			}

			li:hover {
				background: #c9c9c9;
			}
		}

		.region-media-box-main {
			height: 100%;
			width: 100%;

			img {
				max-width: 100%;
				max-height: 100%;
			}

		}
	}

	.stretch {
		img {
			width: 100%;
			height: 100%;
		}
	}

	.center_middle {
		display: table-cell;
		text-align: center;
		vertical-align: middle;

		img {
			/*width: auto;*/
			/*height: auto;*/
			max-width: 100%;
			max-height: 100%;
		}
	}

	.scanimage {
		display: table-cell;

		img {
			max-width: 100%;
			max-height: 100%;
			/*width: 100px;*/
			/*height: 100px;*/
		}
	}

	.noimage {
		text-align: center;

		img {
			width: auto;
			height: 100%;
		}
	}

	.region-media-box-footer {
		/*z-index: 99;*/
		padding: 0 10px;
		height: 30px;
		display: flex;
		background: rgba(20, 20, 20, 0.8);
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;

		.eyebox {
			position: absolute;
			cursor: pointer;
			display: inline-block;
			width: 100%;
			float: right;
			color: white;
			font-size: 1.5rem;
			text-align: right;
			left: 0;
			padding-right: 15px;

			i {
				/*margin-right: 10px;*/
				display: inline-block;
				width: 20px;
				height: 20px;
				background-repeat: no-repeat;
				background-size: cover;
				position: relative;
				top: 2px;
			}
		}

		.caret-left-normal {
			background-image: url("../../../static/images/previmgnormal.png");
		}

		.caret-left-no {
			background-image: url("../../../static/images/previmageno.png");
		}

		.caret-right-normal {
			background-image: url("../../../static/images/nextimagenormal.png");
		}

		.caret-right-no {
			background-image: url("../../../static/images/nextimageno.png");
		}
	}

	.region-media-box-footer span {
		display: inline-block;
		height: 30px;
		line-height: 30px;
	}

	.region-media-info {
		float: left;
		width: 70%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: white;
		font-size: 1.125rem;
	}

	/* .ui-resizable-handle {
		filter:Alpha(opacity=0)!important;
		opacity: 0 !important;
	} */
	
</style>
<style>
	.text-region-maarquee span{
		word-break: break-all;
	}
	.ui-resizable-handle {
		opacity: 0 !important;
		filter: Alpha(opacity=0) !important;
	}

	.region-media-box-main table {
		border-collapse: collapse;
	}

	.design-layout-header input {
		width: 75px;
		border-radius: 8px;
		border: 1px solid #c9c9c9;
		outline: none;
		height: 31px;
	}

	.design-header .el-input {
		width: 217px;
	}

	.design-header .el-input__inner {
		width: 217px;
	}

	.design-header .el-icon-search {
		line-height: 31px;
	}
</style>
