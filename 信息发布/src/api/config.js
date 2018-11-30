let urlRoot = '';

// let domain = window.location.protocol + '//' + window.location.host;
// let domain="http://192.168.3.231:8080";
// let domain = window.location.protocol + '//' + window.location.host;
let domain="http://192.168.3.230:8080";
window.localStorage["rootUrl"] = domain;
window.localStorage["basemedia:port"] = domain + '/media/';
window.localStorage["webVersion"] = "2.0.2"; //前端版本
window.localStorage["basemedia:port"] = domain + '/media/'; //媒体资源
let subUrl = '/api/v1';
export const http = {
	login: subUrl + '/login',
	loginInfo: subUrl + '/getLoginInfo',
	logout: subUrl + '/logout',
	deviceGroup: subUrl + '/displayGroup',
	deviceList: subUrl + '/display',
	deviceGroupAll: subUrl + '/displayDg',
	deviceDetail: subUrl + '/display',
	deviceBatchDel: subUrl + '/deleteDisplays',
	deviceType: subUrl + '/deviceModel',
	timeTask: subUrl + '/timeTask',
	taskDel: subUrl + '/timeTask/delete',
	pauseTask:subUrl + '/pauseTask',
	refreshDevice:subUrl + '/UploadClientInfo',

	media: subUrl + '/media',
	mediaAddrList: subUrl + '/mediaLive',
	mediaAdd: subUrl + '/mediaLive',
	url: domain,
	getType: subUrl + '/media',
	getMediaUrl: subUrl + "/getFromUrl/",
	downloadMedia: subUrl + "/mediaDownload/",
	getTemplate: subUrl + '/template',
	getLayout: subUrl + '/layout',
	layoutDefault: subUrl + '/layout/isDefault',
	groupList: subUrl + '/groupList',
	layoutRegions: subUrl + '/layoutRegions',
	NotifyDisplays: subUrl + '/NotifyDisplays',
	layoutMedias: subUrl + '/layoutMedias',
	layoutMediasOrder: subUrl + '/layoutMedias/reorder',
	setBackground: subUrl + '/layout/setBackground',
	scheduleEvent: subUrl + '/scheduleEvent',
	audit: subUrl + '/audit',
	auditup: subUrl + '/audit/up',
	auditdelete: subUrl + '/audit/delete',

}