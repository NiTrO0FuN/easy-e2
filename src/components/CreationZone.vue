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
import { mapState, mapWritableState, mapActions } from 'pinia'
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
        ...mapState(useScreensStore, ['screensObjects', 'objectsCount']),
        ...mapWritableState(useScreensStore, ['activeCanva'])
    },
    methods: {
        ...mapActions(useScreensStore, {resetScreenStore: '$reset' }),
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
        },
        saveToLocal() {
            //Don't save if no changes
            if (JSON.stringify(this.screensObjects) == localStorage.getItem("egpSave")) {return}
            //Don't save if nothing to save
            if (this.objectsCount == 0) {return}
            localStorage.setItem("egpSave", JSON.stringify(this.screensObjects))
            this.$q.notify({
                color: "positive",
                icon: "save",
                position: "top-left",
                timeout: 1000
            })
        },
        loadFromLocal() {
            if (!localStorage.getItem("egpSave")) {return}
            let parsedScreens;
            try {
                parsedScreens = JSON.parse(localStorage.getItem("egpSave"))
            } catch (error) {
                this.$q.notify({
                    type: "negative",
                    message: this.$t("save.error_load")
                })
                localStorage.removeItem("egpSave")
                return
            }
            if (this.selectedShape) {this.deselectShape()}
            this.resetScreenStore()
            parsedScreens.forEach(screen => {
                let objects = []
                screen.forEach(obj => {
                    let parsedObject = this.$refs.canva.createObject(obj)
                    this.$refs.canva.canvas.add(parsedObject)
                    objects.push(parsedObject)
                });
                this.screensObjects.push(objects)
            });
            this.$refs.canva.canvas._objects = this.screensObjects[this.activeCanva]
            this.$refs.canva.refreshCanva()
            this.$q.notify({
                type: "positive",
                message: this.$t("save.success_load")
            })
        },
    },
    mounted () {
        this.refreshCode()
        //Load previous save
        if(localStorage.getItem("egpSave")) {
            this.$q.notify({
                color: "info",
                message: this.$t("save.found"),
                icon: "save",
                progress: true,
                progressClass: "saveProgress",
                timeout: 10*1000, //10 sec to choose
                actions: [{icon: "done", handler: this.loadFromLocal},
                {icon: "close", color: "negative"}]
            })
        }
        //Auto save every minute if needed
        setInterval(this.saveToLocal, 1*60*1000)
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