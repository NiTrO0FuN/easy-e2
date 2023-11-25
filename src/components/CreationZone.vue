<template>
    <div class="column">
        <TransitionGroup name="workspace">
            <CanvaSwitcher key="canvaswitcher" :canvasList="canvasContent" :canvaIndex="activeCanva" :style="'margin-right:' + (selectedShape ? '0' : '70px')"
            @next="nextCanva" @prev="prevCanva" @add="addCanva"/>
            <div class="row" key="canva">
                <ShapeOrder v-if="selectedShape" @move="moveSelectedShape" @unselect-shape="deselectShape"/>
                <CanvaVue ref="canva" @shape-selected="selectShape" @object-list-updated="refreshCode"/>
                <ShapeCreator :selectedShape="selectedShape" @add-shape="addShape" @remove-shape="removeSelectedShape"/>
            </div>
            <ShapeEditor v-if="selectedShape" key="editor" :shape="selectedShape" @change-selected="refreshCanva"/>
        </TransitionGroup>
    </div>   
</template>

<script>
import CanvaSwitcher from './EGPCreation/CanvaSwitcher.vue';
import CanvaVue from './EGPCreation/CanvaVue.vue';
import ShapeEditor from './EGPCreation/ShapeEditor.vue';
import ShapeOrder from './EGPCreation/ShapeOrder.vue';
import ShapeCreator from './EGPCreation/ShapeCreator.vue';

export default {
    name: "CreationZone",
    data() {
        return {
            selectedShape: null,
            canvasContent: [],
            activeCanva: 0
        }
    },
    methods: {
        prevCanva() {
            if(this.activeCanva<=0) {return}
            this.deselectShape()
            this.canvasContent[this.activeCanva--] == this.$refs.canva.canvas.getObjects()
            this.$refs.canva.canvas._objects = this.canvasContent[this.activeCanva]
            this.refreshCanva()
        },
        nextCanva() {
            if(this.activeCanva>=this.canvasContent.length-1) {return}
            this.deselectShape()
            this.canvasContent[this.activeCanva] = this.$refs.canva.canvas.getObjects()
            this.$refs.canva.canvas._objects = this.canvasContent[++this.activeCanva]
            this.refreshCanva()
        },
        addCanva() {
            if (this.canvasContent.length >= 5) {return}
            this.canvasContent.push([])
            this.nextCanva()  
        },
        addShape(shape) {
            this.$refs.canva.addObject(shape.type)
        },
        selectShape(shape) {
            this.selectedShape=shape
        },
        deselectShape() {
            this.$refs.canva.canvas.discardActiveObject()
            this.refreshCanva()
        },
        removeSelectedShape() {
            if(!this.selectedShape){return}
            this.$refs.canva.canvas.remove(this.selectedShape)
            this.refreshCode(this.$refs.canva.canvas.getObjects())
        },
        moveSelectedShape(command) {
            if(!this.selectedShape){return}
            if(command=="bringtofront") {
                this.selectedShape.bringToFront()
            } else if (command=="bringforward") {
                this.selectedShape.bringForward()
            } else if (command=="sendbackwards") {
                this.selectedShape.sendBackwards()
            } else if (command=="sendtoback") {
                this.selectedShape.sendToBack()
            }
            this.refreshCode(this.$refs.canva.canvas.getObjects())
        },
        refreshCanva(dirty) {
            if(dirty) {this.selectedShape.set("dirty",true)}
            this.$refs.canva.refreshCanva()
            if(dirty){this.selectedShape.set("dirty",false)}
            this.refreshCode()
        },
        refreshCode() {
            this.canvasContent[this.activeCanva] = this.$refs.canva.canvas.getObjects()
            this.$emit("object-list-updated",this.canvasContent)
        }
    },
    mounted () {
        this.canvasContent[this.activeCanva] = this.$refs.canva.canvas.getObjects()
    },
    components: { CanvaSwitcher,CanvaVue, ShapeEditor, ShapeOrder, ShapeCreator }
}
</script>

<style scoped>
.workspace-move {
  transition: all 1s ease;
}
.workspace-enter-from,
  .workspace-leave-to {
    opacity: 0;
    translate: 0 50vh;
  }
  .workspace-enter-to,
  .workspace-leave-from {
    opacity: 1;
    translate: 0 0;
  }
  .workspace-enter-active,
  .workspace-leave-active {
    transition: all 1s ease;
  }
  .workspace-leave-active {
    position: absolute;
  }
</style>