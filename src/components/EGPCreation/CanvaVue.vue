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
                t.top = Math.round(t.top);
                t.left = Math.round(t.left);
                let step = 512/8
                if(o.e.shiftKey) {
                    t.set({
                        top:  Math.round(t.top/step)*step,
                        left: Math.round(t.left/step)*step
                    })
                }
            })
            this.canvas.on("object:scaling", function(o) {
                let t = o.target
                t.top = Math.round(t.top);
                t.left = Math.round(t.left);
            })
        },
        methods: {
            createObject(options) {
                let object;
                if (options.type == "rect") {
                    object = new fabric.Rect(options)
                } else if (options.type == "ellipse") {
                    object = new fabric.Ellipse(options)
                } else if (options.type == "polygon") {
                    object = new fabric.Polygon(options.points, options)
                } else if (options.type == "i-text") {
                    object = new fabric.IText(options.text, options)
                }
                object.toObject = (function(toObject) {
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            ...(this.actions? {actions: this.actions}: {}),
                            filled: this.filled,
                            hasControls: this.hasControls,
                        });
                    };
                })(object.toObject)
                let self = this
                object.on("selected", function() {
                    object.top = Math.round(object.top);
                    object.left = Math.round(object.left);
                    self.$emit("shape-selected",object)
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
                return object
            },
            addObject(objectType) {
                if(this.canvas.getObjects().length>=300){return}
                var object
                if(objectType=="rectangle") {
                    object = this.createObject({
                        type: "rect",
                        top: 256, left: 256, width: 100, height: 100, 
                        originX:'center',originY:'center',
                        fill:'rgba(255,255,255,1)',
                        strokeWidth: 3,
                        filled: true,
                        actions: []
                    })
                } else if(objectType=="circle") {
                    object = this.createObject({
                        type: "ellipse",
                        top: 256, left: 256, rx: 50, ry: 50,
                        originX:'center',originY:'center',
                        fill:"rgba(255,255,255,1)",
                        strokeWidth: 3,
                        filled:true,
                        actions: []
                    })
                } else if(objectType=="triangle") {
                    object = this.createObject({
                        type: "polygon",
                        points: [{ x: 70, y: 0},
                        { x: 0, y: 120},
                        { x: 140, y: 120}],
                        fill:'rgba(255,255,255,1)',
                        strokeWidth: 3,
                        filled:true,
                        hasControls: false,
                        objectCaching: false,
                        actions: []
                    })
                } else if(objectType=="text") {
                    object = this.createObject({
                        type: "i-text",
                        text: "EGP",
                        top: 0, left:0,
                        fill: 'rgba(255,255,255,1)',
                        filled: true,
                        fontSize: 20,
                        fontFamily: "Tahoma",
                        fontWeigth: "bold",
                        hasControls: false,
                        }
                    )
                }  
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