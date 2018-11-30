<template>
	<div class="upload">
    </div>
</template>

<script>
	import { http } from '../../api/config.js'
	import CryptoJS from 'crypto-js'
	import WebUploader from 'webuploader'
	export default {
        name: 'vue-upload',
        props: {
            accept: {
                type: Object,
                default: {},
            },
//          headers: {
//          	type: Object,
//              default: {},
//          },
            // 上传地址
            url: {
                type: String,
                default: '',
            },
            // 上传最大数量 默认为20
            fileNumLimit: {
                type: Number,
                default: 200,
            },
            // 大小限制 默认2M
            fileSingleSizeLimit: {
                type: Number,
                default: 2048000,
            },
            // 上传时传给后端的参数，一般为token，key等
            formData: {
                type: Object,
                default: null
            },
            // 生成formData中文件的key，下面只是个例子，具体哪种形式和后端商议
            keyGenerator: {
                type: Function,
                default(file) {
                    const currentTime = new Date().getTime();
                    const key = `${currentTime}.${file.name}`;
                    return key;
                },
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            // 上传按钮ID
            uploadButton: {
                type: String,
                default: '#filePickerXXX',
            },
        },
        data() {
            return {
                uploader: null,
                headers:{},
                successNum:0,
                errorNum:0,
                //删除已经完成的 文件
                delSuccess:0,
                delError:0
            };
        },
        mounted() {
            this.initWebUpload();
        },
        methods: {
            initWebUpload() {
				let token = localStorage.getItem('token');
				if(token) {
					let type = "POST";
					let url = http.media;
					let timestamp = Date.parse(new Date());
					let hashkey = type + "," + url + ",{" + timestamp + "}";
					let sha256 = CryptoJS.HmacSHA256(hashkey, token).toString();
					let word = CryptoJS.enc.Utf8.parse(sha256);
					let auth = CryptoJS.enc.Base64.stringify(word);
					let author = 'Token token=\"' + token + '\",' + 'timestamp=\"' + timestamp + '\",auth=\"' + auth + '\"';
					this.headers = {
						Authorization: author
					};
				}
                this.uploader = WebUploader.create({
                    auto: false, // 选完文件后，是否自动上传
                    swf: 'webuploader/dist/Uploader.swf',  // swf文件路径
                    server: this.url,  // 文件接收服务端
                    pick: this.uploadButton,     // 选择文件的按钮
                    headers:this.headers,
                    accept: this.getAccept(this.accept),  // 允许选择文件格式。
                    threads: 1,
                    fileNumLimit: this.fileNumLimit, // 限制上传个数
                    //fileSingleSizeLimit: this.fileSingleSizeLimit, // 限制单个上传图片的大小
                    formData: this.formData,  // 上传所需参数
                    chunked: false,          //分片上传
                    chunkSize: 2048000,    //分片大小
                    duplicate: false,  // 重复上传
                    compress:false,
                    duplicate :false
                });

                // 当有文件被添加进队列的时候，添加到页面预览
                this.uploader.on('filesQueued', (files) => {
                	let num = this.getFileState();
                    this.$emit('fileChange', files, num);
                });

                this.uploader.on('uploadStart', (file) => {
                    // 在这里可以准备好formData的数据
                    //this.uploader.options.formData.key = this.keyGenerator(file);
                    let num = this.getFileState();
                    this.$emit('uploadstart', file, num);
                });
                this.uploader.on('uploadBeforeSend', (obj, data) => {
                	this.$emit('uploadBeforeSend', obj, data);
                })

                // 文件上传过程中创建进度条实时显示。
                this.uploader.on('uploadProgress', (file, percentage) => {
                	let num = this.getFileState();
                    this.$emit('progress', file, percentage, num);
                });
                this.uploader.on('uploadSuccess', (file, response) => {
                	if (200 == response.errorCode) {
                		this.successNum++;
                	} else {
                		this.errorNum++;
                	}
                	let num = this.getFileState();
                    this.$emit('success', file, response, num);
                });

                this.uploader.on('uploadError', (file, reason) => {
                    let num = this.getFileState();
                    this.$emit('uploadError', file, reason, num);
                });

                this.uploader.on('error', (type) => {
                    let errorMessage = '';
                    if (type === 'F_EXCEED_SIZE') {
                        errorMessage = `文件大小不能超过${this.fileSingleSizeLimit / (1024 * 1000)}M`;
                    } else if (type === 'Q_EXCEED_NUM_LIMIT') {
                        errorMessage = '文件上传已达到最大上限数';
                    } else {
                        errorMessage = `上传名称重复！请检查后重新上传！`;
                        this.errorNum--;
                    }
                    this.errorNum++;
                    let num = this.getFileState();
                    this.$emit('error', errorMessage, num);
                });

                this.uploader.on('uploadComplete', (file, response) => {
                    this.$emit('complete', file, response);
                });
            },
            //获取文件的状态
			getFileState() {
				let uploader = this.uploader;
				return [uploader.getFiles('inited').length +　uploader.getFiles('queued').length, uploader.getStats().progressNum, this.successNum - this.delSuccess, this.errorNum - this.delError];
			},
            upload(file) {
                this.uploader.upload(file);
            },
            stop(file) {
                this.uploader.stop(file);
            },
            // 取消并中断文件上传
            cancelFile(file) {
            	let num = this.getFileState();
                this.uploader.cancelFile(file, num);
            },
            // 在队列中移除文件
            removeFile(file, fileState) {
                this.uploader.removeFile(file, true);
                
                if ("upSuccess" == fileState) {
                	this.delSuccess++;
                } else if ("upFailed" == fileState) {
                	this.delError++;
                }
                let num = this.getFileState();
                if (num[0] + num[1] == 0) {
                	this.$emit('complete', file);
                }
                this.$emit('removeFile', file, num);
            },

            getAccept(accept) {
                switch (accept) {
                    case 'text':
                        return {
                            title: 'Texts',
                            exteensions: 'doc,docx,xls,xlsx,ppt,pptx,pdf,txt',
                            mimeTypes: '.doc,docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt'
                        };
                        break;
                    case 'video':
                        return {
                            title: 'Videos',
                            exteensions: 'mp4',
                            mimeTypes: '.mp4'
                        };
                        break;
                    case 'image':
                        return {
                            title: 'Images',
                            exteensions: 'gif,jpg,jpeg,bmp,png',
                            mimeTypes: '.gif,.jpg,.jpeg,.bmp,.png'
                        };
                        break;
                    default: return accept
                }
            },

        },
    };
</script>

<style>
</style>