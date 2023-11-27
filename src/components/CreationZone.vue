<template>
    <div class="column">
        <TransitionGroup name="workspace">
            <CanvaSwitcher key="canvaswitcher" :canvasList="screensObjects" :canvaIndex="activeCanva" :style="'margin-right:' + (selectedShape ? '0' : '70px')"
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
import { mapState, mapWritableState } from 'pinia'
import { useScreensStore } from '@/stores/screensObjects'

import CanvaSwitcher from './EGPCreation/CanvaSwitcher.vue';
import ShapeOrder from './EGPCreation/ShapeOrder.vue';
import CanvaVue from './EGPCreation/CanvaVue.vue';
import ShapeCreator from './EGPCreation/ShapeCreator.vue';
import ShapeEditor from './EGPCreation/ShapeEditor.vue';

export default {
    name: "CreationZone",
    data() {
        return {
            selectedShape: null,
        }
    },
    computed: {
        ...mapState(useScreensStore, ['screensObjects']),
        ...mapWritableState(useScreensStore, ['activeCanva'])
    },
    methods: {
        prevCanva() {
            if(this.activeCanva<=0) {return}
            this.deselectShape()
            this.screensObjects[this.activeCanva--] == this.$refs.canva.canvas.getObjects()
            this.$refs.canva.canvas._objects = this.screensObjects[this.activeCanva]
            this.refreshCanva()
        },
        nextCanva() {
            if(this.activeCanva>=this.screensObjects.length-1) {return}
            this.deselectShape()
            this.screensObjects[this.activeCanva] = this.$refs.canva.canvas.getObjects()
            this.$refs.canva.canvas._objects = this.screensObjects[++this.activeCanva]
            this.refreshCanva()
        },
        addCanva() {
            if (this.screensObjects.length >= 10) {return}
            this.screensObjects.push([])
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
            this.refreshCode()
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
            this.refreshCode()
        },
        refreshCanva(dirty) {
            if(dirty) {this.selectedShape.set("dirty",true)}
            this.$refs.canva.refreshCanva()
            if(dirty){this.selectedShape.set("dirty",false)}
            this.refreshCode()
        },
        refreshCode() {
            this.screensObjects[this.activeCanva] = this.$refs.canva.canvas.getObjects()
        }
    },
    mounted () {
        this.refreshCode()
    },
    components: { CanvaSwitcher, ShapeOrder, CanvaVue, ShapeEditor, ShapeCreator}
}
</script>

<style scoped>
.workspace-move {
  transition: all 0.5s ease;
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
    transition: all 0.5s ease;
  }
  .workspace-leave-active {
    position: absolute;
  }
</style>