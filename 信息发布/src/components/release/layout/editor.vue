<template>
  <div class="editor-box">
    <div class="clockbox bx">
        <p class="title">{{$t('message.layoutDesign.dbclick_add_time')}}</p>
        <ul class="canuseformart">
          <li @dblclick="appendTime">Clock|DD/MM/YYYY</li>
        </ul>
      </div>
    <script id="editor" name="desc"  type="text/plain" ></script>
  </div>
</template>

<script>
export default {
  name: "UEditor",
  props: {
    id: {
      type: String
    },
    config: {
      type: Object
    },
    text: {
      type: String
    }
  },
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    //初始化UE
    const _this = this;
		UE.delEditor('editor');
    _this.editor = UE.getEditor("editor", this.config);
    _this.editor.addListener("ready", function() {
      // editor准备好之后才可以使用
      _this.editor.setHeight(200);
      var htmleditor = _this.text;
      var nowTime = _this.strToTime();
      _this.editor.setContent(htmleditor);
      _this.editor.execCommand("fontsize", "20px");
      // _this.editor.execCommand("forecolor", "white");
    });
  },
  //销毁editor
  destoryed() {
    this.editor.destory();
  },
  methods: {
    //获取富文本内容
    getUEContent: function() {
			console.log(this.editor.getContent())
      return this.editor.getContent();
    },
    //插入富文本内容
    appendTime() {
      this.editor.execCommand("insertHtml", "<span class='regicon-clock'>[Clock|DD/MM/YYYY]</span>");
    },
    //获取当前时间
    strToTime() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      var weak = now.getDay();
      var hour = now.getHours();
      var minute = now.getMinutes();
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
			// hour + ":" + minute + "|" +
      return  day + "/" + month + "/" + year;
    }
  }
};
</script>
<style scoped>
.editor-box {
  margin-top: 20px;
}
.clockbox {
  padding-left: 20%;
  margin-bottom: 1em;
}
.clockbox li {
  cursor: pointer;
}
</style>
