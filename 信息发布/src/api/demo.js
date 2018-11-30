 
 _this.mkajax({
  type: 'post',
  url: http.login,
  data: {
    account: _this.user,
    password: _this.password
  }
}).then((res) => { //成功
_this.$message({//成功返回
  message: res.message,
  type: 'success',
  duration:888
});
}).fail((err) => { //失败

});