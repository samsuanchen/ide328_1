define(['text!./template.tmpl','backbone'], 
 function(template,Backbone) {
  return { type:"Backbone",
      render:function() {
        this.html(_.template(template,{}));
      },
      events: {
        "keydown #inp_command":"command_keydown",
        "keypress #inp_command":"command_keypress",
        "click #btn_sendcommand":"commandsend_click",
        "keydown #inp_filename":"filename_keydown",
        "click #btn_transferfile":"filetransfer_click"
      },
      command_keydown:function(e) {
        var k=e.keyCode
        if (k==13) {
          this.commandsend_click()
        } else if (k==27) {
          this.$el.find('#inp_command').val('')
          this.sandbox.emit("command",String.fromCharCode(e.keyCode)+"\r")
        }
      },
      command_keypress:function(e) {
        var k=e.keyCode
        if (k==26||k==17) {
          this.sandbox.emit("command",String.fromCharCode(e.keyCode)+"\r")
        }
      },
      commandsend_click:function() {
        var cmd=this.$el.find("#inp_command").val()
        this.sandbox.emit("command",cmd+"\r")
      },
      filename_keydown:function() {
        if (e.keyCode==13) {
          this.filetransfer_click()
        }
      },
      filetransfer_click:function(e) {
        this.filename=this.$el.find("#inp_filename").val()
        this.commands=this.fs.readFileSync(this.filename).toString().split(/\r\n/)
        this.filetransfer()
      },
      filetransfer:function() {
        if (this.commands&&this.commands.length) {
          var cmd=this.commands.shift()
          this.$el.find("#inp_command").val(cmd)
//        this.sandbox.emit('data',cmd+'\r\n')
          this.commandsend_click()
          var that=this
          setTimeout(function (){that.filetransfer()},1000,that)
        }
      },
/*    inp_command_focus: function() {
        $("#inp_command")[0].focus() // 確定 指令輸入格 優先
      },
*/    initialize: function() {
        this.fs=require('fs')
        this.render()
      }
    }
});
