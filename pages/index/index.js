var ctx;
Page({
    data: {
        canvasWidth: 300,
        canvasHeight: 300,
        resultSrc: null,
        x: 0,
        y: 0,
        hidden: true,
        imgInfo: null,
        imgX: 0,
        imgY: 0,
        imgWidth: 0,
        imgHeight: 0,
        imgPath: null,
        rotate1: 0,
        rotate: 0,
        scale: 1,
        distance: 0,
        isMultiTouch: false,
        angle: 0
    },
    onReady: function (e) {
        ctx = wx.createCanvasContext('myCanvas')
        ctx.drawImage("../../images/bg.png",0, 0, 300,300)
        ctx.draw()
    },
    start: function (e) {
        var that = this;
        if(!that.data.imgInfo){
            return false;
        }
        this.setData({
            hidden: true,
            x: e.touches[0].x,
            y: e.touches[0].y

        })
        console.log(this.data)

        if (e.touches.length >= 2) {
            var angle = Math.atan2(e.touches[0].y - e.touches[1].y, e.touches[0].x - e.touches[1].x) / Math.PI * 180;
            this.setData({
                distance: this.distance(e.touches[0], e.touches [1]),
                isMultiTouch: true,
                rotate1: angle
            })
        }
    },
    move: function (e) {
        //console.log('move', e);
        //console.log(distance);
        var that = this;
        if(!that.data.imgInfo){
            return false;
        }
        if (e.touches.length == 1 && !this.data.isMultiTouch) {
            this.setData({
                x: e.touches[0].x,
                y: e.touches[0].y,
                imgX: this.data.imgX + e.touches[0].x - this.data.x,
                imgY: this.data.imgY + e.touches[0].y - this.data.y
            })
        }

        if (this.data.isMultiTouch) {
            var xMove = e.touches[1].x - e.touches[0].x;
            var yMove = e.touches[1].y - e.touches[0].y;
            var distance = Math.sqrt(xMove * xMove + yMove * yMove);
            var angle = Math.atan2(e.touches[0].y - e.touches[1].y, e.touches[0].x - e.touches[1].x) / Math.PI * 180;
            this.setData({
                scale: this.distance(e.touches[0], e.touches [1]) / this.data.distance,
                rotate: angle - this.data.rotate1
            })
            console.log(angle);
        }
        this.ani();

    },
    end: function (e) {
        var that = this;
        if(!that.data.imgInfo){
            return false;
        }
        this.setData({
            hidden: true
        })
        console.log(e)
        if (this.data.isMultiTouch && e.touches.length == 0) {
            var _scale = this.data.scale;
            this.setData({
                isMultiTouch: false,
                imgWidth: that.data.imgWidth * _scale,
                imgHeight: that.data.imgHeight * _scale,
                scale: 1
                //rotate:0
            })
            console.log(this.data)

        }
    },
    distance: function (p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    },
    canvasIdErrorCallback: function (e) {
        console.error(e.detail.errMsg)
    },
    ani: function () {
        var that = this;
        ctx.save()
        ctx.rotate(that.data.rotate * Math.PI / 180)
        ctx.drawImage(that.data.imgPath, that.data.imgX, that.data.imgY, that.data.imgWidth * this.data.scale, that.data.imgHeight * this.data.scale)
        ctx.restore()
        ctx.drawImage("../../images/bg.png",0, 0, 300,300)
        ctx.draw()
    },
    ani2:function(){
        var that = this;
        ctx.save()
        ctx.translate(that.data.canvasWidth/2-that.data.imgWidth/2+ that.data.imgX, that.data.canvasHeight/2-that.data.imgHeight/2+ that.data.imgY)
        ctx.rotate(that.data.rotate * Math.PI / 180)
        ctx.scale(that.data.scale,that.data.scale)
        ctx.drawImage(that.data.imgPath, that.data.imgX, that.data.imgY, that.data.imgWidth, that.data.imgHeight)
        ctx.restore()
        ctx.drawImage("../../images/bg.png",0, 0, 300,300)
        ctx.draw()
    },
    addImg: function () {
        var that = this;
        wx.chooseImage({
            count:1,
            success: function (res) {
                var _res = res;
                wx.getImageInfo({
                    src: _res.tempFilePaths[0],
                    success: function (res) {
                        console.log(res);
                        console.log(res.width)
                        console.log(res.height)
                        that.setData({
                            imgInfo: res,
                            imgWidth: res.width,
                            imgHeight: res.height,
                            imgPath: res.path,
                            resultSrc: null,
                            x: 0,
                            y: 0,
                            imgX: 0,
                            imgY: 0,
                            rotate1: 0,
                            rotate: 0,
                            scale: 1,
                            distance: 0,
                            angle: 0
                        })
                        that.setData({
                            imgX:that.data.canvasWidth/2-that.data.imgWidth/2+that.data.imgX,
                            imgY:that.data.canvasHeight/2-that.data.imgHeight/2+that.data.imgY
                        })
                        console.log(that.data);
                        that.ani();
                    }
                })
            }
        })
    },
    scaleFn: function () {
        var that = this;
        this.setData({
            // scale: 2,
            rotate:10
        })

        this.ani2();
    },
    createImg: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: function (res) {
                console.log(res.tempFilePath)
                that.setData({
                    resultSrc: res.tempFilePath
                })
            }
        })

    },
    slider4change:function(e){
        console.log('slider' + 'index' + '发生 change 事件，携带值为', e.detail.value)
        this.setData({
            scale:e.detail.value
        })
        this.ani();
    },
    previewImg:function () {
        var that = this;
        wx.previewImage({
            current: that.data.resultSrc, // 当前显示图片的http链接
            urls: [that.data.resultSrc] // 需要预览的图片http链接列表
        })
    }
})
