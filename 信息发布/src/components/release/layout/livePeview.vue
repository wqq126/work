<template>
	<el-dialog @open="init" :show-close='false' :close-on-click-modal='false' :visible.sync="video_preview_show" top="10%"
	 class="video-preview" width="50%">
		<button class="el-dialog__headerbtn" @click="close_preview">
			<i class="el-dialog__close el-icon el-icon-close"></i>
		</button>

		<video-player v-if="showVideo" style="width:96%" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptionsLive"></video-player>
	</el-dialog>
</template>

<script>
	import Vue from "vue";
	import VideoPlayer from "vue-video-player";
	// import 'video.js/dist/lang/zh-CN';
	import "video.js/dist/video-js.css";
	import "vue-video-player/src/custom-theme.css";
	import "videojs-flash";
	// import 'videojs-contrib-hls'
	Vue.use(VideoPlayer);
	export default {
		name: "live-preview",
		data: function() {
			return {
				showVideo:false,
				playerOptionsLive: {
					playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
					autoplay: true, //如果true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: false, // 导致视频一结束就重新开始。
					preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language: localStorage.getItem("current_lan"),
					aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					techOrder: ["html5", "flash"],
					sources: [{
							type: "",
							src: "" //url地址
						},
						{
							withCredentials: false,
							type: "application/x-mpegURL",
							src: ""
						}
					],
					notSupportedMessage: this.$t('message.releaseManage.notSupportedMessage') //允许覆盖Video.js无法播放媒体源时显示的默认信息。
				}
			}

		},
		props: {
			video_preview_show: {
				type: Boolean,
				require: true
			},
			media_preview_path: {
				type: String,
				require: true
			},
			media_previe_live: {
				type: Boolean,
				require: true
			}
		},
		methods: {
			close_preview: function() {
				this.$emit("close_preview", "live_preview_show");
				this.showVideo = false;
// 				this.playerOptionsLive.sources[0].src = "";
				this.playerOptionsLive.sources[0].type = "";
			},
			init() {
				this.showVideo = true;
				this.playerOptionsLive.sources[0].src = this.media_preview_path;
			}
		}
	};
</script>

<style scoped lang="less">
	.video-preview .el-dialog__header {
		padding: 0;
	}
</style>
<style lang="less">
	.video-preview .el-dialog__header {
		padding: 0;
	}

	.video-preview .el-dialog {
		// height: 50%;
		// width: 50%;

		.el-dialog__headerbtn {
			border-radius: 50%;
			background: rgba(89, 89, 89, 0.7);
			width: 30px;
			height: 30px;
			top: -15px;
			right: -15px;

			i {
				color: white;
			}
		}
	}

	.video-preview .el-dialog__body {
		height: 100%;
		width: 100%;
		padding: 0;
		text-align: center;

		img {
			height: 100%;
			width: auto;
			max-width: 100%;
		}
	}
</style>
