define(['text!./template.tmpl','backbone'], 
 function(template,Backbone) {
  return { type:"Backbone",
      events: {
          "keyup #consoleIn":"onKeyup",
          "click #btnsend":"onClick"
      },
      onKeyup:function(e) {
        if (e.keycode==13) {
          this.onClick()
        }
      },
      onClick:function() {
        this.sandbox.emit("consoleIn",this.$el.find("#consoleIn").val()+"\r")
      },
      render:function() {
          this.html(_.template(template,{}));
      },
      // C. 啟動 網頁畫面
      initialize: function() {
        this.render()
      //  this.$el.find("#consoleIn").bind('onkeydown',this.onKeydown)
     //   .bind('onclick',this.onClick)
      }
    }
});
