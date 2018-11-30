<template>
  <div class="ruler scale-x scale bx">
    <div class="cm" v-for="(item,index) in routerx" :style="cm_style(index)">
      <div class="mm" v-for="(item,index) in routerarea"  v-bind:style="five_mm(index)">
      </div>
      <div class="router-number">{{index*100}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "router-x",
    data(){
      return {
        routerx: new Array(19),
        routerarea: new Array(9)
      }
    },
    computed:{
      router_number(){
        return function(){
          var styleObj = {

          }
          return styleObj;
        }
      },
      cm_style(){
        return function(index){
          var routernnum = index*100;
          var styleObj = {
            left:index*100+'px',

          };
          return styleObj;
        }
      },
      five_mm(){
        return function (index) {
          if(index==4){
            return {
              height:'10px'
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .ruler .cm {
    position: absolute;
    border-left: 1px solid #555;
    height: 14px;
    width: 100px;
  }

  .ruler .mm {
    position: absolute;
    border-left: 1px solid #555;
    height: 14px;
    width: 10%;
  }

  .ruler .router-number{
    position: absolute;
    left: 0;
    top: 15px;
    color: #6f6f6f;
		font-size: 12px;
  }

  .ruler .cm:after {
    position: absolute;
    bottom: -15px;
    font: 11px/1 sans-serif;
  }

  .ruler .mm {
    height: 5px;
  }


  /*.ruler .mm:nth-of-type(5) {*/
    /*height: 10px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(1) {*/
    /*left: 0%;*/
  /*}*/

  /*.ruler .cm:nth-of-type(1):after {*/
    /*content: "0";*/
  /*}*/

  .ruler .cm:nth-of-type(2) {
    left: 100px;
  }

  /*.ruler .cm:nth-of-type(2):after {*/
    /*content: "100";*/
  /*}*/

  /*.ruler .cm:nth-of-type(3) {*/
    /*left: 200px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(3):after {*/
    /*content: "200";*/
  /*}*/

  /*.ruler .cm:nth-of-type(4) {*/
    /*left: 300px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(4):after {*/
    /*content: "300";*/
  /*}*/

  /*.ruler .cm:nth-of-type(5) {*/
    /*left: 400px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(5):after {*/
    /*content: "400";*/
  /*}*/

  /*.ruler .cm:nth-of-type(6) {*/
    /*left: 500px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(6):after {*/
    /*content: "500";*/
  /*}*/

  /*.ruler .cm:nth-of-type(7) {*/
    /*left: 600px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(7):after {*/
    /*content: "600";*/
  /*}*/

  /*.ruler .cm:nth-of-type(8) {*/
    /*left: 700px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(8):after {*/
    /*content: "700";*/
  /*}*/

  /*.ruler .cm:nth-of-type(9) {*/
    /*left: 800px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(9):after {*/
    /*content: "800";*/
  /*}*/

  /*.ruler .cm:nth-of-type(10) {*/
    /*left: 900px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(10):after {*/
    /*content: "900";*/
  /*}*/

  /*.ruler .cm:nth-of-type(11) {*/
    /*left: 1000px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(11):after {*/
    /*content: "1000";*/
  /*}*/

  /*.ruler .cm:nth-of-type(12) {*/
    /*left: 1100px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(12):after {*/
    /*content: "1100";*/
  /*}*/

  /*.ruler .cm:nth-of-type(13) {*/
    /*left: 1200px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(13):after {*/
    /*content: "1200";*/
  /*}*/

  /*.ruler .cm:nth-of-type(14) {*/
    /*left: 1300px;*/
  /*}*/

  /*.ruler .cm:nth-of-type(14):after {*/
    /*content: "1300";*/
  /*}*/

  .ruler .mm:nth-of-type(1) {
    left: 10%;
  }

  .ruler .mm:nth-of-type(2) {
    left: 20%;
  }

  .ruler .mm:nth-of-type(3) {
    left: 30%;
  }

  .ruler .mm:nth-of-type(4) {
    left: 40%;
  }

  .ruler .mm:nth-of-type(5) {
    left: 50%;
  }

  .ruler .mm:nth-of-type(6) {
    left: 60%;
  }

  .ruler .mm:nth-of-type(7) {
    left: 70%;
  }

  .ruler .mm:nth-of-type(8) {
    left: 80%;
  }

  .ruler .mm:nth-of-type(9) {
    left: 90%;
  }

  .ruler .mm:nth-of-type(10) {
    left: 100%;
  }
</style>
