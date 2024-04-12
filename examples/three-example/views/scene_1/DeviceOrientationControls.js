

export function DeviceOrientationControls () {

    this.bindObject3DList = []

    this.originStatus = null

    this.addEvent = function() {
        
        //解耦
        window.addEventListener("deviceorientation", (e)=>{
            let alpha = e.alpha, beta = e.beta, gamma = e.gamma
            this.actions({alpha, beta, gamma})
        })
        
    }
    this.addEvent()

    this.actions = function (deviceStatus) {
        if (!this.originStatus) { //记录初始位置
            this.originStatus = {}
            this.originStatus.alpha = deviceStatus.alpha
            this.originStatus.beta = deviceStatus.beta
            this.originStatus.gamma = deviceStatus.gamma
        }else {
            let deltaAlpha = deviceStatus.alpha - this.originStatus.alpha
            let deltaBeta = deviceStatus.beta - this.originStatus.beta
            let deltaGamma = deviceStatus.gamma - this.originStatus.gamma
            // console.info(deltaAlpha, deltaBeta, deltaGamma)
            this.bindObject3DList.forEach((obj)=> {

                console.info(this.originStatus)
                console.info(this.originStatus.beta)
                console.info(Math.PI)
                console.info(this.originStatus.beta / 180 * Math.PI)

                obj.rotation.x = Math.PI / -2 +  deltaBeta / 180 * Math.PI / 10
                obj.rotation.y = deltaGamma / 180 * Math.PI / 20
                console.info(obj.rotation)
            })
        }
    }
    this.bindObject3D = function(object3d) {
        this.bindObject3DList.push(object3d)
        console.info('绑定设备体感控制物体: ',this.bindObject3DList[0])
    }
    this.unbindObject3D = function(object3d) {
        this.bindObject3DList.forEach((obj, index)=>{
            if (obj == object3d) { this.bindObject3DList.splice(index, 1) } })
        console.info('解绑体感物体: ',object3d  ,this.bindObject3DList)
    }

    // this.getPermission = function() {
    //     if (
    //         typeof DeviceMotionEvent !== "undefined" &&
    //         typeof DeviceMotionEvent.requestPermission === "function"
    //     ) {
    //         DeviceMotionEvent.requestPermission()
    //             .then( (state)=> {
    //                 if ("granted" === state) {
    //                     window.addEventListener("devicemotion", (e)=>{
    //                         let alpha = e.alpha, beta = e.beta, gamma = e.gamma
    //                         this.actions({alpha, beta, gamma})
    //                     }, false);
    //                 } else {
    //                     alert("apply permission state: " + state);
    //                 }
    //             })
    //             .catch(function (err) {
    //                 alert("error: " + err);
    //             });
    //     }
    // }
    // this.getPermission()


}