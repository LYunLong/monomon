;(function (window,document) {
    let baseSize = "100px";
    baseInit();
    window.addEventListener("resize", baseInit, false);
    function baseInit() {
        // 设置rem
        let deviceWidth = document.documentElement.clientWidth || window.innerWidth;
        if(document.documentElement.clientWidth > document.documentElement.clientHeight){
            deviceWidth = document.documentElement.clientHeight || window.clientHeight;
        }
        baseSize = deviceWidth * 100 / 375;
        document.documentElement.style.fontSize = baseSize + "px";
    }
})(window,document);
