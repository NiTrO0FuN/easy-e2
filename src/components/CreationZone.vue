<template>
    <div class="column">
        <div class="row">
            <ShapeOrder v-if="selectedShape" @move="moveSelectedShape"/>
            <CanvaVue ref="canva" @shape-selected="selectShape" @object-list-updated="refreshCode"/>
            <ShapeCreator :selectedShape="selectedShape" @add-shape="addShape" @remove-shape="removeSelectedShape"/>
        </div>
        <ShapeEditor :shape="selectedShape" @change-selected="refreshCanva"/>
    </div>   
</template>

<script>
import CanvaVue from './EGPCreation/CanvaVue.vue';
import ShapeEditor from './EGPCreation/ShapeEditor.vue';
import ShapeOrder from './EGPCreation/ShapeOrder.vue';
import ShapeCreator from './EGPCreation/ShapeCreator.vue';

export default {
    name: "CreationZone",
    data() {
        return {
            selectedShape: null,
        }
    },
    methods: {
        addShape(shape) {
            this.$refs.canva.addObject(shape.type)
        },
        selectShape(shape) {
            let self = this
            self.selectedShape=shape
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
            this.refreshCode(this.$refs.canva.canvas.getObjects())
        },
        refreshCode(shapes) {
            this.$emit("object-list-updated",shapes)
        }
    },
    components: { CanvaVue, ShapeEditor, ShapeOrder, ShapeCreator }
}
</script>