<template>
	<div class="page-loadmore">
		<div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
			<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
				<ul class="page-loadmore-list">
					<li v-for="(item,index) in list" class="page-loadmore-listitem">
						<h4>
							{{item.title}}
						</h4>
					</li>
				</ul>
			</mt-loadmore>
		</div>
	</div>
</template>

<script>
	import Loadmore from 'vue-loadmore';
	export default {
		name: 'newslist',
		components: {
			Loadmore
		},
		props: {
			list_url: {
				type: Object,
				require: true
			}
		},
		data() {
			return {
				allLoaded: false,
				start_num: 0,
				end_num: 20,
				tops: [],
				list: [],
				bottomStatus: '',
				wrapperHeight: 0,
			};
		},
		mounted() {
			this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 70;
			console.log(this.wrapperHeight)
			// this.get_list();

		},
		methods: {
			get_list() {
				var _this = this;
				var ajax_list_url = _this.list_url.url+ _this.start_num + '-' + _this.end_num + '.html';
				_this.$api.get(ajax_list_url).then(function(res) {
					if(!res.data[_this.list_url.id]){
							return false;
					}
					res.data[_this.list_url.id].shift();
					_this.list = _this.list.concat(res.data[_this.list_url.id]);
					_this.start_num = _this.start_num+_this.end_num;
					_this.end_num =  _this.start_num+_this.end_num;
					_this.$refs.loadmore.onBottomLoaded();
				}).catch(function(res){
					console.log(res)
					_this.$refs.loadmore.onBottomLoaded();
				})
			},
			//刷新
			loadTop() {
				this.start_num = 0;
				this.end_num =  20;
				this.list = [];
				this.$refs.loadmore.onTopLoaded();
				this.get_list();
				
// 				setTimeout(() => {
// 					let firstValue = this.list[0];
// 					for (let i = 1; i <= 10; i++) {
// 						this.list.unshift(firstValue - i);
// 					}
// 					this.$refs.loadmore.onTopLoaded();
// 				}, 1500);
			},
			//加载
			loadBottom() {
				console.log('ddddddddddd')
				this.get_list();
				// 				setTimeout(() => {
				// 					let lastValue = this.list[this.list.length - 1];
				// 					if (lastValue < 40) {
				// 						for (let i = 1; i <= 10; i++) {
				// 							this.list.push(lastValue + i);
				// 						}
				// 					} else {
				// 						this.allLoaded = true;
				// 					}
				// 					this.$refs.loadmore.onBottomLoaded();
				// 				}, 1500);
			},
		}
	}
</script>

<style scoped="scoped">
	.page-loadmore-wrapper {
		overflow: scroll;
		padding: 15px 0 0 0;
	}

	.page-loadmore-list {
		padding: 15px 0 0 0;
		list-style-type: none;
	}

	.page-loadmore-listitem {
		height: 80px;
		border-top: 1px solid darkgrey;
	}

	.page-loadmore-listitem h4 {
		text-align: left;
		text-indent: 10px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.newslist {
		box-sizing: border-box;
		height: calc(100% - 110px);
		overflow: scroll;
	}

	/* .box-card {
		margin-top: 20px;
	}

	.box-card .clearfix {
		text-align: left;
	}

	.box-card .clearfix span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		padding-right: 50px;
		width: 100%;

	}

	.box-card .item {
		position: relative;
		height: 80px;
	}

	.box-card img {
		width: 20%;
		height: 70px;
		position: absolute;
		left: 10px;
		top: 10px;
	}

	.box-card .digest {
		width: 70%;
		height: 50px;
		position: absolute;
		right: 10px;
		top: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 1.5rem;
	}

	.box-card .tips {
		text-align: right;
		width: 70%;
		height: 50px;
		position: absolute;
		right: 10px;
		bottom: -10px;
	} */
</style>
