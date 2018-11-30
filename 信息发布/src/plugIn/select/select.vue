<template id="select">
  <div class="select" @click="changeFlag()">
    <span>{{chooseData}}</span>
    <ul class="option_ul" v-if="flag">
      <li class="option_li" v-for="(item,index) in liData" @click="chooseVal(index)">{{item.value}}</li>
    </ul>

  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        liData: [],
        chooseData: '',
        flag: false,

      }
    },
    props: {
      liDataGet: Array,
      chooseType: Number,
      dataType: String,
      item:Object,
      index:Number
    },
    methods: {
      getData() { //获取数据
        const self = this;
        this.liData = self.liDataGet;
        if(this.item){//设置任课老师
          // this.chooseData = this.item.teacher_name
          console.log(this.item)
          console.log(this.index)
        }
      else{
        this.chooseData = this.liData[0].value
      }
        // this.chooseType = self.chooseType;
       
      },
      chooseVal(index) {
        const self = this;
        this.chooseData = self.liData[index].value;
        let data = {};
        if (this.dataType == 'teacherList'||this.dataType=='student_name'||this.dataType == 'class_name'||this.dataType == 'classQuery_name'||this.dataType=='class_status'||this.dataType == 'monitor_id'||this.dataType=='vice_monitor') {
          data = {
            val: this.chooseData,
            index: index + 1,
            dataType: self.dataType,
            id: self.liData[index].id
          }
        }else if(this.dataType=='chooseTeacher'){
          data = {
            course_id: this.item.course_id,
            course_name: this.item.course_name,
            teacher_id:self.liData[index].id,
            teacher_name: this.chooseData,
            dataType: self.dataType,
            index:this.index
          }
        }else {
          data = {
            val: this.chooseData,
            index: index + 1,
            dataType: self.dataType
          }
        }
        self.$emit('change', data);
        //console.log(data)
      },
      changeFlag() {
        this.flag = !this.flag;

      },
      closeThis() {
        this.flag = false;
      }


    },
    mounted() {
      this.getData();

    },

    computed: {}
  }

</script>
