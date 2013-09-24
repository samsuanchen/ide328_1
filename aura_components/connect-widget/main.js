// main.js 在 aura_components\connect-widgit 資料夾
// 

// 4. 將 serial port 回傳 command 標為藍色 送 consoleOut
define(['text!../config.json'], function(config) {
  // 參照 ide328\config.json 設定 port 與 baudrate 值
  return { type:"Backbone",
    tryopen:function() { // 試連 serial port
        var that=this
        that.serialport.open(function(data) {
            that.sandbox.emit("trying")
            if (typeof data !='undefined') {
                that.sandbox.emit("openfail")
                return
            }
            that.active=true
            clearInterval(that.timer)
            setTimeout(function(){that.serialport.write('\r')},5000)
            that.sandbox.emit("connected")
            that.ok=''
            that.serialport.on("data", function (data) {
                // 2. 收 serial port data 至 consoleOut
                data=data.toString()
                if (that.ok==='') that.ok=data
                data=data.replace(/</g,'&lt;')
                var t=$('#consoleOut').html()
                var td=t+data, tc=that.command
                if (data&&tc) {
                    var i=td.lastIndexOf(tc)
                    if (i > -1) {
                        $('#consoleOut').html(t.substr(0,i))
                        t=td.substr(i+tc.length)
                        data='<font color=blue>'+tc+'</font>'+t
                        that.command=''
                    }
                }
                that.sandbox.emit("data",data)
            })
            that.serialport.on("close", function () {
                that.active=false;
                that.sandbox.emit("close")
                that.timer=setInterval( function(){ that.tryopen()} , 1000);
            })
            that.serialport.on("error",function(err) { 
                if (!that.active) return
                that.sandbox.emit("error")
            })
            that.sandbox.on("command",function(data){
                // 寫 command 到 serial port
                that.serialport.write(data)
                // 刪掉列尾的 \r 並將 小於符號 替換為 &lt;
                that.command=data.substr(0,data.length-1).replace(/</g,'&lt;')
            })
        })
    },
    initialize:function() {
    // 啟動程序
        var S=require('serialport') // 注意!!! 這 serialport 元件 not portable
        var that=this
        config=JSON.parse(config) // 預設 config.json
        that.active=false 
        that.serialport = new S.SerialPort(
            config.port,
            {baudrate:config.baudrate},false
        )
        // 嘗試每秒與 serial port 連線
        that.timer=setInterval(function(){that.tryopen()}, 1000)
    }
  }
});