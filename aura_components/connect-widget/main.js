define(['text!../config.json',], function(config) {
    return { type:"Backbone",
    initialize:function() {
        this.config=JSON.parse(config);
        this.S=require('serialport');//not portable
        this.active=false;
        var that=this;
        //this.timer=setInterval( function() { that.tryToLogin() } , 1000);
        this.serialport = new this.S.SerialPort(this.config.port,{baudrate:this.config.baudrate},false);
        that.timer=setInterval( function(){ that.tryopen()} , 1000);

    },
    tryopen:function() {
        var that=this;
        if (!that.active) that.sandbox.emit("trying");
        this.serialport.open(function(data) {
            if (typeof data !='undefined') {
                that.sandbox.emit("openfail");
                return; //cannot connect
            }
            if (!that.active) { 
                //clearInterval(that.timer);
                that.active=true;
                clearInterval(that.timer);
                that.sandbox.emit("connected");
            } 

            that.serialport.on("data", function (data) { // 從 comp 到 console
                 that.sandbox.emit("data",data);
            });
            that.serialport.on("close", function () {
                that.active=false;
                that.sandbox.emit("close")
                that.timer=setInterval( function(){ that.tryopen()} , 1000);
            })
            that.serialport.on("error",function(err) { 
                if (!that.active) return;
           // this.timer=setInterval( function() { that.tryToLogin() } , 1000);
                 that.sandbox.emit("error");
            })            
        })
        this.sandbox.on("consoleIn",function(data){
            that.serialport.write(data);
        });
    }

  }
});