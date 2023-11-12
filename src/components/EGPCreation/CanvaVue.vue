<template>
    <div>
        <canvas id="egp" width="512" height="512"></canvas>
    </div>
    
</template>

<script>
    import { fabric } from 'fabric';
    import { reactive } from 'vue'

    export default {
        name:"CanvaVue",
        emits: ["shape-selected","object-list-updated"],
        mounted () {
            this.canvas = new fabric.Canvas('egp',
            {backgroundColor: "black",
            hoverCursor: "grab",
            stopContextMenu: true,
            selection: false}
            );
            let self = this;
            this.canvas.on("selection:cleared", function() {
                self.$emit("shape-selected",null)
            })
            this.canvas.on("object:modified", function(o) {
                let t = o.target
                if(t.type=="rect") {
                    t.set({
                        width:  Math.round(t.get('width') * t.get('scaleX')),
                        height: Math.round(t.get('height') * t.get('scaleY')),
                    })
                } else if(t.type=="ellipse") {
                    t.set({
                        rx:  Math.round(t.get('rx') * t.get('scaleX')),
                        ry: Math.round(t.get('ry') * t.get('scaleY')),
                    })
                }
                t.set({
                    angle: Math.round(t.get('angle')),
                    scaleX: 1,
                    scaleY: 1
                })
            })

            this.canvas.on("object:rotating",function(o) {
                let t = o.target
                if(o.e.shiftKey) {
                    t.set("angle",Math.round(t.angle/5)*5)
                }
            })
            this.canvas.on("object:moving",function(o) {
                let t = o.target
                let step = 512/8
                if(o.e.shiftKey) {
                    t.set({
                        top:  Math.round(t.top/step)*step,
                        left: Math.round(t.left/step)*step
                    })
                }
            })
        },
        methods: {
            addObject(objectType) {
                if(this.canvas.getObjects().length>=300){return}
                var object
                if(objectType=="rectangle") {
                    object = new fabric.Rect({
                    top:256,left:256,width:100,height:100, 
                    originX:'center',originY:'center',
                    fill:'rgba(255,255,255,1)',
                    strokeWidth: 3,
                    filled: true})
                } else if(objectType=="circle") {
                    object = new fabric.Ellipse({
                    top:256,left:256,rx:50,ry:50,
                    originX:'center',originY:'center',
                    fill:"rgba(255,255,255,1)",
                    strokeWidth: 3,
                    filled:true})
                } else if(objectType=="triangle") {
                    object = new fabric.Polygon([
                        { x: 70, y: 0},
                        { x: 0, y: 120},
                        { x: 140, y: 120},
                        ],{
                        fill:'rgba(255,255,255,1)',
                        strokeWidth: 3,
                        filled:true,
                        hasControls: false,
                        objectCaching: false,
                    })
                } else if(objectType=="text") {
                    object = new fabric.IText("EGP", {
                        top: 0, left:0,
                        fill: 'rgba(255,255,255,1)',
                        filled: true,
                        hasControls: false,
                        }
                    )
                }
                let self = this
                object.on("selected", function() {
                    object.top = Math.round(object.top);
                    object.left = Math.round(object.left);
                    self.$emit("shape-selected",object)
                })
                object.on("scaling", function() {
                    object.top = Math.round(object.top);
                    object.left = Math.round(object.left);
                })
                object = reactive(object)
                this.$watch(() => object.filled, function() {
                    if(!object.filled) {
                        object.set("stroke",object.fill)
                        object.set("fill","rgba(0,0,0,0)")
                    } else {
                        object.set("fill", object.stroke)
                        object.set("stroke", null)                
                    }
                    this.refreshCanva()
                })
                
                this.canvas.add(object)
                this.updateObjectList()
            },
            refreshCanva() {
                this.canvas.renderAll()
            },
            updateObjectList() {
                this.$emit("object-list-updated",this.canvas.getObjects())
            }
        },
    }
</script>

<style scoped>
canvas {
    box-shadow: 0px 5px 15px black;
}

</style>