<template>
  <div class="scale-y scale bx">
    <div class="cm" v-for="(item,index) in routerx" :style="cm_style(index)">

      <div class="mm" v-for="(item,index) in routerarea" v-bind:style="five_mm(index)">

      </div>
      <div class="router-number">{{index*100}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "router-y",
    data() {
      return {
        routerx: new Array(11),
        routerarea: new Array(9)
      }
    },
    computed: {
      router_number() {
        return function () {
          var styleObj = {}
          return styleObj;
        }
      },
      cm_style() {
        return function (index) {
          var routernnum = index * 100;
          var styleObj = {
            top: index * 100 + 'px',
          };
          return styleObj;
        }
      },
      five_mm() {
        return function (index) {
          if (index == 4) {
            return {
              height: '10px'
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .scale-y .cm {
    position: absolute;
    border-top: 1px solid #555;
    width: 14px;
    height: 100px;
    right: 0;
  }

  .scale-y .mm {
    position: absolute;
    border-bottom: 1px solid #555;
    width: 14px;
    height: 10%;
    right: 0;
  }

  .scale-y .cm:nth-of-type(1):after {
    left: -1rem !important;
  }

  .scale-y .cm:after {
    transform: rotate(270deg);
    -ms-transform: rotate(270deg); /* Internet Explorer */
    -moz-transform: rotate(270deg); /* Firefox */
    -webkit-transform: rotate(270deg); /* Safari 和 Chrome */
    -o-transform: rotate(270deg); /* Opera */
    display: inline-block;
    position: absolute;
    top: 0;
    right: 1rem;
    font: 11px/1 sans-serif;
  }

  .scale-y .router-number{
    position: absolute;
    left: -22px;
    top: 0px;
    color: #6f6f6f;
		font-size: 12px;
  }
  /*.scale-y .cm:nth-of-type(1) {*/
    /*top: 0%;*/
  /*}*/


  /*.scale-y .cm:nth-of-type(2) {*/
    /*top: 100px;*/
  /*}*/

  /*.scale-y .cm:nth-of-type(2):after {*/
    /*content: "100";*/
  /*}*/

  /*.scale-y .cm:nth-of-type(3) {*/
    /*top: 200px;*/
  /*}*/

  /*.scale-y .cm:nth-of-type(3):after {*/
    /*content: "200";*/
  /*}*/

  /*.scale-y .cm:nth-of-type(4) {*/
    /*top: 300px;*/
  /*}*/

  /*.scale-y .cm:nth-of-type(4):after {*/
    /*content: "300";*/
  /*}*/

  /*.scale-y .cm:nth-of-type(5) {*/
    /*top: 400px;*/
  /*}*/

  /*.scale-y .cm:nth-of-type(5):after {*/
    /*content: "500";*/
  /*}*/

  /*.scale-y .cm:nth-of-type(6) {*/
    /*top: 500px;*/
  /*}*/

  /*.scale-y .cm:nth-of-type(6):after {*/
    /*content: "600";*/
  /*}*/

  /*.scale-y .cm:nth-of-type(7) {*/
    /*top: 600px;*/
  /*}*/

  /*.scale-y .cm:nth-of-type(7):after {*/
    /*content: "700";*/
  /*}*/

  .scale-y .mm {
    width: 5px;
  }

  .scale-y .mm:nth-of-type(5) {
    width: 10px;
  }

  .scale-y .mm:nth-of-type(1) {
    top: 0%;
  }

  .scale-y .mm:nth-of-type(2) {
    top: 10%;
  }

  .scale-y .mm:nth-of-type(3) {
    top: 20%;
  }

  .scale-y .mm:nth-of-type(4) {
    top: 30%;
  }

  .scale-y .mm:nth-of-type(5) {
    top: 40%;
  }

  .scale-y .mm:nth-of-type(6) {
    top: 50%;
  }

  .scale-y .mm:nth-of-type(7) {
    top: 60%;
  }

  .scale-y .mm:nth-of-type(8) {
    top: 70%;
  }

  .scale-y .mm:nth-of-type(9) {
    top: 80%;
  }

  .scale-y .mm:nth-of-type(10) {
    top: 90%;
  }
</style>
