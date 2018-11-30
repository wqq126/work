<template>
  <div id="app" class="bx" >
    <router-view ></router-view>
  </div>

</template>

<script>
 

</script>
<style>
  .ml30 {
    margin-left: 30px;
  }

  .w180 {
    width: 180px !important;
  }
  html,
	body { 
		width: 100%; 
	  height: 100%; 
	  font-size: 16px;
		min-width: 1300px;
	  min-height: 640px;
	}
  html,
  body,
  #app {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1280px) {
	   body{    		
		    position: absolute;
		    width: 1280px;		    
    	} 	
	}
	@media (max-height: 600px) {
	   body{
    		height: 600px;
		    position: absolute;
		    overflow-y:auto		    
    	}    	 	
	}
	/*笔记本尺寸适配*/
@media (max-height: 800px) {		
		body{
			font-size: 12px;
		}
	}

  div {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .bx {
    /* 盒子模型 */
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .br {
    border-radius: 6px;
    box-shadow: 0px 0px 4px #aaa;
  }

  .mb14 {
    margin-bottom: 14px;
  }

  body,
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  #app {
    font-family: 'FZLTHJW--GB1-0', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
   /* text-align: center;*/
    color: #2c3e50;
    /* padding-top: 6em; */
    position: relative;
  }

  header {
    width: 100%;
    height: 4.875em;
    background: #005daa;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 4.875em;
    display: flex;
    justify-content: space-between;
    color: #fff;
  }

  .header_left {
  	display:inline-block;
    margin-left: 20px;
    font-size: 2.5em;
  }

  .header_right {
    /*height: 6em;*/
    position: relative;
  }

  .header_right img {
  	position:relative;
  	/*top 在IE9*/
  	margin-top: 0.55125em;
  	/*transform: translateY(-50%);*/
    width: 3.7em;
    height: 3.7em;
    border-radius: 50%;
    border: 4px solid #fff;
    float:right;
    -ms-box-sizing: content-box; 
    box-sizing: border-box;
  }

  .main {
    width: 100%;
    height: 100%;
    padding-left: 6em;
    position: relative;
    background: url('../static/images/background.png');
  }

  .main nav {
    width: 6em;
    /*box-shadow: 2px 0px 2px #888888;*/
    height: 100%;
    position: absolute;
    left: 0;
    min-height: 450px;
    top: 0;
    
  }

  /*.main {
    width: 100%;
    height: 100%;
  }*/

  .main nav ul {
    width: 100%;
    height: 97%;
    list-style: none;
    overflow: hidden;
    background: #18abbb;
    box-shadow: 5px 0 15px -2px #73859f, -5px 0 10px -5px black;
  }

  .main nav ul li {
    height: 5.625em;
    width: 100%;
    text-align: center;
  }

  .main nav ul li.active {
    background: #FFFFFF;
  }

  .main nav ul li.active a {
    color: #18abbb;
  }

  .main nav ul li a {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-decoration: none;
    position: relative;
    padding-top: 3.75em;
    box-sizing: border-box;
    color: #FFFFFF;
  }

  .main nav ul li:first-of-type {
    margin-top: 1em;
    margin-bottom: 10px;
  }

  .main nav ul li a img {
    width: 2.375em;
    height: 2.375em;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 1em;
    border:none;
  }

  /* 公共样式 */

  .queryBtn {
    /* padding: 0 40px; */
    padding: 0;
    font-size: 18px;
    border-radius: 34px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: relative;
    width: 118px;
    height: 36px;
    background: #1886ce;
    border-radius: 36px;
    margin-left: 16px;
    line-height: 34px;
    color: #fff;
  }

  .commonBox {
    width: 100%;
    height: 100%;
    background: url('../static/images/background.png');
    padding: 8.5em 1.87em 1.25em;
    position: relative;
  }

  main {
    width: 100%;
    height: 100%;
    background: url('../static/images/background.png');
    position: relative;
  }
  .importentIcon::before {
    content: '';
    width: 14px;
    height: 14px;
    position: absolute;
    left: -24px;
    top: 50%;
    transform: translateY(-50%);
    background: url('../static/images/importent.png');
  }
  .chooseBox.down::after {
    content: '';
    width: 15px;
    height: 10px;
    position: absolute;
    right: 20px;
    background: url('../static/images/down.png');
    top: 50%;
    transform: translateY(-50%);
  }

  .chooseBox{
    position: relative;
  }
  .chooseBox.date::after {
    content: '';
    width: 18px;
    height: 18px;
    position: absolute;
    right: 20px;
    background: url('../static/images/date.png');
    top: 50%;
    transform: translateY(-50%);
  }

 .page-title{
 	  position: absolute;   
    height: 2.125em;
    left: 0;
    top: 0.25em;
    padding: 0 1.3em;
    line-height: 2em;
    font-size: 1.5em;
    color: #18abbb;
    font-weight: 600;
 }
 .home-title{   
    height: 2.125em;
    left: 0;
    top: 0.25em;
    padding: 0 1.3em;
    line-height: 2em;
    font-size: 1.5em;
    color: #18abbb;
    font-weight: 600;
 }
  .commonBoxNavBox {
    position: absolute;
    width: 100%;
    height: 4.125em;
    left: 0;
    top: 3.5em;
    padding: 0 1.87em;
  }

  .commonBoxNav {
    width: 100%;
    height: 3em;
    background: #fff;
    display: flex;
    font-size: 1.375em;
  }

  .commonBoxNav li a {
    /*line-height: 66px;*/
    margin: 0 32px;
    cursor: pointer;
    color: #898989;
    text-decoration: none;
    display: inline-block;
        height: 100%;
    line-height: 3em;
  }

  .commonBoxNav li.active a {
    position: relative;
    color: #18abbb;
    height: 100%;
    line-height: 3em;
  }

  .commonBoxNav li.active a::before {
    content: '';
    width: 100%;
    height: 2px;
    background: #18abbb;
    position: absolute;
    left: 0;
    bottom: -1px;
  }

  .commonBoxScreening {
    width: 100%;
    height: 84px;
    background: #fff;
    display: flex;
    align-items: center;
    font-size: 18px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }


  .chooseBox {
    margin-left: 10px;
    display: flex;
    align-items: center;
    height: 36px;
    line-height: 36px;
    border: 1px solid #e5e5e5;
    border-radius: 18px;
    width: 180px;
  }

  .select {
    width: 100%;
    /* padding: 0 15px; */
    position: relative;
  }

  /* 弹出框 */

  .classManagement_alertBox {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    background: #fff;
    border-radius: 10px;
  }

  .classManagement_alertBox.setTeacher .select span {
    margin-left: 26px;
  }

  .classManagement_alertBox .message-box__header {
    padding: 0;
    margin-bottom: 26px;
  }

  .classManagement_alertBox .message-box__header span {
    padding: 0;
    line-height: 84px;
    font-size: 35px;
    color: #18abbb;
  }

  .message-box__content {
    padding: 0 44px;
  }

  /* 弹出框 */

  .option_ul {
    width: 100%;
    line-height: 36px;
    max-height: 300px;
    overflow: scroll;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 18px;
    position: absolute;
    left: 0;
    top: 36px;
    text-align: left;
    z-index: 1002;

  }

  .option_li {
    padding-left: 20px;
    border-bottom: 1px solid #e5e5e5;
    background: #fff;


  }

  /* .option_li:last-of-type {
  
    border: none;
  }

  .option_li:first-of-type {
    border-radius: 18px 18px 0 0;
  } */

  .option_li:hover {
    background: #18abbb;
  }



  /* 公共样式 */

  .classManagement_form {
    height: 100%;
  }

  .classManagement_form .el-table {
    overflow: scroll;
  }

  ::-webkit-scrollbar {

    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
    opacity: 0.5;
  }

  .common_alertBox ::-webkit-scrollbar {
    display: none;
  }

  .class_status ::-webkit-scrollbar {
    display: none;
  }

  .addSet ::-webkit-scrollbar {
    display: block;
  }

  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
  }

  .classManagement_form .el-table .cell {
    text-align: left !important;
  }

  /* 弹框 */

  /* 弹框 */

  .campusManagement_title_btn {
    margin-right: 30px;
    padding: 0 27px;
    height: 34px;
    background: #2286cf;
    border-radius: 34px;
    line-height: 34px;
    color: #fff;
  }

  .classManagement_form {
    /* position: absolute;
        left: 0;
        top: 160px;
        width: 100%;
        height: 100% */
    padding-bottom: 70px;
    overflow: hidden;
    max-height: 100%;
    /* overflow: scroll; */
    /* position: relative; */
  }

  .pages_form_btnBox {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 70px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 10;
    border-radius: 0 0 6px 6px;
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background: #fef6e8;
  }

  /* 整理之后 */

  /* 展示框公共样式 */

  .common_showBox {
    width: 100%;
    height: 100%;
    padding-top: 98px;
    position: relative;
  }

  .common_searchBox {
    width: 100%;
    height: 84px;
    background: #fff;
    display: flex;
    align-items: center;
    font-size: 18px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
  

  /* 展示框公共样式 */

  /* 搜索框 */

  .searchBox {
    width: 284px;
    height: 36px;
    border: 1px solid #e5e5e5;
    border-radius: 36px;
    margin-left: 24px;
    padding-left: 40px;
    padding-right: 20px;
    position: relative;
  }

  .searchBox i {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 36px;
  }

  .searchBox input {
    border: none;
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: #c9c9c9;
  }

  .searchBox input:focus,
  .chooseBox select:focus {
    outline: none
  }

  .searchBox.longBox {
    width: 461px;
    display: flex;
    position: relative;
  }

  .searchBox img {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 010px;
    top: 50%;
    transform: translateY(-50%);
  }

 

  /* 搜索框 */

  /* 标题 */

  .common_titleBox {
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: 60px;
    position: relative;
  }

  .common_title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
  }

  .common_title_left {
    font-size: 22px;
    line-height: 60px;
    font-weight: 900;
    margin-left: 28px;
  }

  .common_title_right {
    display: flex;
    align-items: center;
  }

  .common_title_btn {
    margin-right: 30px;
    padding: 0 40px;
    height: 36px;
    font-size: 18px;
    background: #2286cf;
    border-radius: 36px;
    line-height: 36px;
    color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: relative;
  }
  .common_title_btn.el-button--primary{
    line-height: 34px;
  }
  .common_alertBox_footer_btn {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 0;
    font-size: 18px;
  }

  .common_title_btn a {
    color: #fff;
    text-decoration: none;
    /* position: absolute; */
    left: 0;
    top: 0;
    display: block;

  }

  .paddingInput {
    padding: 1px 18px;
  }



  .chooseBox input {
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
  }

  .chooseBox.disabled {
    background: rgb(235, 235, 228);
  }

  /* 标题 */

  /* 表单 */

  .common_form {
    height: 100%;
    padding-bottom: 70px;
    overflow: hidden;
    max-height: 100%;

  }

  .common_form .el-table {
    overflow: scroll;
  }

  .common_form .el-table::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .common_form .el-table::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #d8d8d8;
  }

  .common_form .el-table::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: #fff;
  }

  .common_form .el-table .cell {
    text-align: left !important;
    color: #6f6f6f;
  }

  .common_form .el-table .cell span.clickBtn {
    color: #18abbb;
    cursor: pointer;
  }

  .common_form_btnBox {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 70px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    /* z-index: 10; */
    border-radius: 0 0 6px 6px;
  }

  .common_form_btn_num {
    width: 37px;
    height: 37px;
    background: #fff;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    line-height: 37px;
    text-align: center;
    border-radius: 50%;
    margin-right: 26px;
  }

  .common_form_btn_min {
    margin-right: 13px;
  }

  .common_form_btn_max {
    margin-right: 32px;
  }

  .common_form_btn_next {
    margin-right: 10px;
  }



  .common_form_btn_total {
    margin-right: 35px;
  }

  .common_form_btn_last {
    margin-right: 26px;
  }

  .common_alertBox {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    background: #fff;
    border-radius: 10px;
  }

  .common_alertBox.setTeacher .select span {
    margin-left: 26px;
  }

  .common_alertBox .common_alertBox_header {
    padding: 0;
    margin-bottom: 26px;
  }

  .common_alertBox .common_alertBox_header span {
    padding: 0;
    line-height: 84px;
    font-size: 35px;
    color: #18abbb;
  }

  .common_alertBox_content {
    padding: 0 44px;
  }

  .common_alertBox_li {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  .common_alertBox_li.onlyOne {
    justify-content: initial;
  }

  .common_alertBox_footer {
    padding: 35px 275px 0;
    height: 35px;
    display: flex;
    justify-content: space-between;
  }

  .common_alertBox_footer_btn {
    width: 118px;
    height: 35px;
    line-height: 35px;
    border-radius: 18px;
    color: #fff;
    background: #18abbb;
  }

  /* 表单 */

  /* element 日期样式 */

  /*.el-input__icon {
    display: none;
  }*/

  .el-input__suffix {
    display: none;
  }

  /*.el-date-editor {
    width: 100% !important;
    height: 100%;
    display: flex;
  }*/

  .el-date-editor input {
    width: 100%;
    border: none;
    height: 100%;
    text-align: center;
  }

  .el-input--prefix .el-input__inner {   
    text-align: left;
  }

  /* element 日期样式 */

  /* 弹出框 */

  .select {
    text-align: left;
  }

  .common_alertBox_li span {
    position: relative;
  }

  .select span {

    margin-left: 20px;
  }

  /* 弹出框 */

  /* 整理之后 */

  /* 淡出动画 */

  .fade-enter-active,
  .fade-leave-active {
    opacity: 1;
    transition: opacity .1s
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  /* 淡出动画 */

  /* 上传按钮 */

  .updateBtn {
    position: relative;
  }

  .updateBtn input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .updateFilebox {
    width: 894px;
    height: 300px;
  }

  .red {
    color: red;
  }

  .green {
    color: green;
  }

  /* 上传按钮 */

  .common_alertBox_li.radio .el-radio__label {
    font-size: 18px;
  }

  .el-table thead.is-group th {
    background: #e8fbfc;
  }

  .moralityAssessment .el-table .cell {
    text-align: center !important;
  }

  .testScoreDataBox .el-table thead.is-group th {
    text-align: center;

  }

  .hideInput .select span {
    opacity: 0;
  }
  .el-button--primary span{
    transition: all 0.2s;
  }
  .header_info_li .el-dropdown{
    width: 100%;
    font-size: 18px;
    color: #fff;
    position: relative;
  }
  .header_info_li .el-dropdown ul  li.el-dropdown-menu__item {
    width: 140px;
    display: block;
  }
/* .el-button--primary:focus, .el-button--primary:hover{
    background: #2286cf;
  } */
  .header_infoBox_chooseClass  .el-dropdown{
    width: 100%;
    height: 100%;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    color: #fff;
      }
      .header_infoBox_chooseClass  .el-dropdown span{
          width: 100%;
      }


        .hideInput .maskIpnut {
    width: 70%;
    height: 80%;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
    background: #fff;
    z-index: 0;
    text-align: left;
    display: flex;
    align-items: center;
  }
  .hideMessageBox{
    opacity: 0;
  }
  
  .el-select .el-input__inner:focus {
    border-color: none !important;
}
/*.....................................................common*/
/*分页工具条*/
.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #18abbb;
    color: #fff;
    border-radius: 50%;
    box-shadow: rgb(198, 198, 198) 0px 3px 3px;
}
.el-pagination.is-background .btn-next, 
.el-pagination.is-background .btn-prev, 
.el-pagination.is-background .el-pager li {
  background-color: #FFFFFF;
    
}
.el-select-dropdown__item.selected {
    color: #18abbb;
    font-weight: 700;
}

/*.el-select .el-input.is-focus .el-input__inner {
    border-color: #18abbb;
}*/
  /*表格字体*/
 .el-table { 
    font-size: 1em;    
}
.el-table th div, .el-table th>.cell {
	  font-size: 1.25em ;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;    
    letter-spacing: 0px;
    color: #3a3a3a ;
}
.el-table .cell{
	font-size: 1.125em ;
	color: #6f6f6f ;
	white-space: nowrap;
  text-overflow: ellipsis;
}

/*button&input*/
.mybtn-primary {
	border: none !important;
	border-radius: 0.3em !important;
	color: white !important;
	background-color: #18abbb !important;
	padding: 0 1em !important;
	margin: 0 10px !important;
	height: 2em !important;
	min-width:7em !important;
	line-height: 2em !important;
	font-size: 1em !important;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1) !important;
	
}
.mybtn-primary:hover{
	background-color: #23b9c1 !important;
}
.mybtn-primary:active{
	background-color: #04a1a5 !important;
}
.my-input{
	outline: none;
    border: 1px solid #e4e7ed;
    border-radius: 0.4em;
    height: 2.25em;
    text-indent: 12px;
    width: 15.625em;
}
/*checkbox*/
.el-checkbox__inner {
    display: inline-block ;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 1.25em;
    height: 1.25em;
    background-color: #fff;
    z-index: 1;
    -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}

.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #FFFFFF; 
    border-color: #dcdfe6; 
}
.el-checkbox__inner:hover {
    border-color: #18abbb;
}
.el-checkbox__inner::after {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    border: 2px solid #18abbb;
    border-left: 0;
    border-top: 0;
    height: 10px;
    left: 5px;
    position: absolute;
    top: 1px;
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 5px;
    -webkit-transition: -webkit-transform .15s ease-in .05s;
    transition: -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
    -webkit-transform-origin: center;
    transform-origin: center;
}
.el-table .descending .sort-caret.descending {
    border-top-color: #18ABBB;
}
.el-table .ascending .sort-caret.ascending {
    border-bottom-color: #18ABBB;
}


/*下拉输入*/
.el-input--suffix .el-input__inner {
    height: 2.25em;
}

.el-icon-search {
    line-height: 2.25em;
}
.el-select .el-input__inner:focus {
    border-color: none !important;
}

.el-select .el-input.is-focus .el-input__inner {
    border-color: none !important;
}
.el-select .el-input__inner {
    border-color: none !important;
    background: url(../static/images/down.png) no-repeat right 10px center !important;
}
/**/
.el-dialog {
	border-radius:0.5em;
}
.el-dialog__title {
    line-height: 24px;
    font-size: 2em;
    font-weight: 600;
    color: #18ABBB !important;
}
.el-dialog__body {
	  text-align:left;
	  font-size:1em !important;
    padding: 1.5em !important;
}
/*上传*/
.el-upload {
 	width: 80% !important;
 }

/**
 * 表单必填样式，在 el-form-item 标签上加上 required样式
 */
.required label.el-form-item__label:before{
	content: url(../static/images/importent.png) !important;
	margin-right: 0.5em !important;
}

.remember .el-checkbox__inner::after {    
       -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    border: 2px solid #005daa;
    border-left: 0;
    border-top: 0;
    height: 10px;
    left: 5px;
    position: absolute;
    top: 1px;
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 5px;
    -webkit-transition: -webkit-transform .15s ease-in .05s;
    transition: -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
    -webkit-transform-origin: center;
    transform-origin: center;
}
/*表单form-input输入后*/
   .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
		    border-color: #dcdfe6;
		}
		/*输入提示靠右*/
	.change-password .el-form-item__error {	
		    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;	    
		    right: 0 !important;
		}
		
	/**
	 * tree 展开/收缩图标
	 */
	.el-icon-caret-right:before{
		content: "\e62b";
		color: #18abbb;
	}
	.el-tree-node__expand-icon.expanded{
		transform: none;
	}
	.el-tree-node__expand-icon.expanded:before{
		content: "\e621";
	}
	.el-tree-node__expand-icon.is-leaf:before{
		color: transparent;
	}
	.el-tree-node__expand-icon.is-leaf{
		/*border: 0 !important;*/
		border-color:transparent !important;
	}
	.el-tree-node__content>.el-tree-node__expand-icon{
		border: 1px solid #18abbb;
		margin-right: 6px;
		padding: 1px;
		border-radius: 2px;
	}
	.highcharts-container {
  		border-radius: 0.5em !important;
  	}
  	.el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    right: 0 !important;
    text-align: right;
}

.el-table td, .el-table th {
	/*padding:1.20em 0 0 0 ;*/
	padding: 0.6em 0 0.6em 0;
}
/*修正 table 表头 排序对表头高度的影响*/
.el-table .caret-wrapper {
	height:22px !important
}
.el-table .sort-caret.ascending {
	top: -2px !important; 
}
.el-table .sort-caret.descending {
	bottom:0 !important;
}

.el-message--error .el-message__content, .el-message--warning .el-message__content {
	display:inline-block;
}
.el-message-box__status {
	position:relative;
	top:13px;
}
.el-message-box__status+.el-message-box__message {
	padding-left:10px;
}
.hide {
	width:0;
	height:0 !important;
  opacity: 0;
  overflow: hidden;
}

/*.single-del{
	  border: none;
	color: #18abbb;
	font-size: 1em;
	background: none;
	padding-left: 0px;
	padding-top: 0px;
    padding-bottom: 0px;
}*/

.el-button:focus, .el-button--text:focus {
	color:#18ABBB;	
}
.el-button--text:hover {
	color:#66b1ff;
}

</style>

