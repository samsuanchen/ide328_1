define(['text!./template.tmpl','backbone'], 
 function(template,Backbone) {
  return { type:"Backbone",
      ondata:function(data) {
        console.log(data.toString())
        this.$el.find("#consoleOut").append(data.toString())
      },
      render:function()  {
          this.html( template);
      },

      initialize: function() {
        this.sandbox.on("data",this.ondata,this);
        this.render()
        this.$el.find("#consoleIn").bind(this.onkeydown)
      }
    }
});
