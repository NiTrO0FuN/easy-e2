<template>
    <div class="column">
        <div class="row">
            <Canva ref="canva" @shape-selected="selectShape" @object-list-updated="refreshCode"/>
            <div class="column justify-center">
                <div class="column addcolumn">
                    <q-btn v-for="shape in shapes" round color="orange" :icon="shape.icon" @click="addShape(shape)">
                        <q-tooltip class="bg-secondary text-body2">{{this.$t(shape.name)}}</q-tooltip>
                    </q-btn>
                    <q-btn v-if="selectedShape" round class="" color="negative" icon="delete" @click="removeSelectedShape"/>
                </div>
            </div>
        </div>
        <ShapeEditor :shape="selectedShape" @change-selected="refreshCanva"/>
    </div>   
</template>

<script>
import Canva from './Canva.vue';
import ShapeEditor from './ShapeEditor.vue';
export default {
    name: "CreationZone",
    data() {
        return {
            selectedShape: null,
            shapes: [
                {icon:"crop_3_2",name:"shapes.rectangle",type:"rectangle"},
                {icon:"radio_button_unchecked",name:"shapes.circle",type:"circle"},
                {icon:"change_history",name:"shapes.triangle",type:"triangle"},
            ]
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
        refreshCanva() {
            this.$refs.canva.refreshCanva()
            this.refreshCode(this.$refs.canva.canvas.getObjects())
        },
        refreshCode(shapes) {
            this.$emit("object-list-updated",shapes)
        }
    },
    components: { Canva, ShapeEditor }
}
</script>

<style lang="scss">
div.addcolumn {
    margin-left: 10px;
    background-color: $dimmed-background;
    border-radius: 50px;
    padding: 10px;

}

.addcolumn > .q-btn:not(:last-child) {
    margin-bottom: 15px !important;
}

</style>