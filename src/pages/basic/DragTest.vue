<template>
    <div id="eagleMapContainer" title="">
        <div id="eagleMap">
            <!--<l-map>

            </l-map>-->
        </div>
        <div id="tz" @mousedown="dragEagle">
            <div title="拖动调整大小" id="move_tz"></div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "eagleMap",
        components: {},

        data() {  /*定义data property的地方*/
            return {}
        }, /*end of data()*/

        methods: {
            dragEagle: function (e) {
                var targetDiv = document.getElementById('eagleMapContainer'); //e.target.parentNode.parentNode;.children[0]

                //得到点击时该地图容器的宽高：
                var targetDivWidth = targetDiv.offsetWidth;
                var targetDivHeight = targetDiv.offsetHeight;

                var startX = e.clientX;
                var startY = e.clientY;

                var _this = this;

                document.onmousemove = function (e) {
                    console.log('move');
                    e.preventDefault();
                    //得到鼠标拖动的宽高距离：取绝对值
                    var distX = Math.abs(e.clientX - startX);
                    var distY = Math.abs(e.clientY - startY);

                    //往右上方拖动：
                    if (e.clientX > startX && e.clientY < startY) {
                        targetDiv.style.width = targetDivWidth + distX + 'px';
                        targetDiv.style.height = targetDivHeight + distY + 'px';
                    }
                    //往左下方拖动：
                    if (e.clientX < startX && e.clientY > startY) {
                        targetDiv.style.width = (targetDivWidth - distX) + 'px';
                        targetDiv.style.height = (targetDivHeight - distY) + 'px';
                    }

                    //设置最大最小范围：不能无限制缩放，影响体验
                    if (parseInt(targetDiv.style.width) >= 300) {
                        targetDiv.style.width = 300 + 'px';
                    }
                    if (parseInt(targetDiv.style.width) <= 150) {
                        targetDiv.style.width = 150 + 'px';
                    }

                    if (parseInt(targetDiv.style.height) >= 300) {
                        targetDiv.style.height = 300 + 'px';
                    }
                    if (parseInt(targetDiv.style.height) <= 150) {
                        targetDiv.style.height = 150 + 'px';
                    }
                }

                document.onmouseup = function () {
                    document.onmousemove = null;
                }
            }
        },
        mounted: function () {

        }
    };
    /* end of export */

    //拖动鹰眼：
</script>
<style scoped>
    #eagleMapContainer {
        position: absolute;
        left: 13%;
        bottom: 10px;
        z-index: 200;
        overflow: hidden;
        visibility: visible;
        width: 200px;
        height: 200px;
        background: #ffe4e3;
    }

    #eagleMap {
        width: 100%;
        height: 100%;
        top: 0px;
        right: 0px;
        position: absolute;
        z-index: 1000;
    }

    #tz {
        position: absolute;
        right: 1px;
        top: 1px;
        width: 28px;
        height: 28px;
        background: #82848a;
        cursor: e-resize;
        z-index: 200001;
    }

    #tz:hover {
        background-color: #666;
    }

    #move_tz {
        position: absolute;
        right: 0px;
        top: 0px;
        width: 27px;
        height: 20px;
        background: #e76d6e;
        cursor: e-resize;
        z-index: 100;
        background-position: 0px 0px;
    }
</style>