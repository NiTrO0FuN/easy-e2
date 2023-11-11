<template>
<div class="row justify-center">
    <div v-if="shape" class="container column" style="width: 500px; margin-left: 6px; margin-top: 20px;">
        <div class="row items-center justify-between text-white">
            {{$t("position")}}
            <q-tooltip class="bg-accent text-body2">{{$t("editor.moveshift")}}</q-tooltip>
            <q-input dark debounce="200" filled v-model.number="left" type="number"  label="X" @update:model-value="this.$emit('change-selected')"/>
            <q-input dark debounce="200" filled v-model.number="top" type="number" label="Y" @update:model-value="this.$emit('change-selected')"/>
        </div>
        <q-separator v-if="hasSize" dark inset spaced />
        <div v-if="hasSize" class="row items-center justify-between text-white">
            {{$t("size")}}
            <q-input dark debounce="200" filled v-model.number="width" type="number" :label="$t('width')" @update:model-value="this.$emit('change-selected')"/>
            <q-input dark debounce="200" filled v-model.number="height" type="number" :label="$t('height')" @update:model-value="this.$emit('change-selected')"/>
        </div> 
        <q-separator v-if="hasRadius" dark inset spaced />
        <div v-if="hasRadius" class="row items-center justify-between text-white">
            {{$t("radii")}}
            <q-input dark debounce="200" filled v-model.number="rx" type="number" label="Rx" @update:model-value="this.$emit('change-selected')"/>
            <q-input dark debounce="200" filled v-model.number="ry" type="number" label="Ry" @update:model-value="this.$emit('change-selected')"/>
        </div>
        <q-separator v-if="isPoly" dark inset spaced />
        <div v-if="isPoly" class="row items-center justify-between text-white">
            {{$t("points")}}
            <q-scroll-area dark class="col-grow q-ml-lg" style="height: 75px">
                <div v-for="point in shape.points" class="row justify-around point-detail">
                    <q-input dark debounce="200" style="width: auto;" filled v-model.number="point.x" type="number" label="X" @update:model-value="this.$emit('change-selected', true)"/>
                    <q-input dark debounce="200" style="width: auto;" filled v-model.number="point.y" type="number" label="Y" @update:model-value="this.$emit('change-selected', true)"/>
                </div>
            </q-scroll-area>
        </div>
        <q-separator dark inset spaced />
        <div class="row items-center justify-between text-white">
            {{$t("color")}}
            <q-toggle v-model="shape.filled" :label="$t('fill')" left-label keep-color :color="shape.fill || shape.stroke"/>
            <q-input dark debounce="200" filled hide-bottom-space readonly v-model="fillColor" :label="$t('color')" :rules="['anyColor']" @update:model-value="this.$emit('change-selected')">
                <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-color dark v-model="fillColor" format-model="rgba" @update:model-value="this.$emit('change-selected')"/>
                    </q-popup-proxy>
                </q-icon>
                </template>
            </q-input>
        </div> 
    </div>
</div>
</template>

<script>
export default {
    name:"ShapeEditor",
    props: {
        shape: {
            type: Object,
            default: null
        },
    },
    computed: {
        hasSize() {
            return this.shape.type == "rect" 
        },
        hasRadius() {
            return this.shape.type == "ellipse" 
        },
        isPoly() {
            return this.shape.type == "polygon"
        },
        fillColor: {
            get () {
                return this.shape.filled ? this.shape.fill : this.shape.stroke
            },
            set (color) {
                if(!this.shape){return}
                this.shape.set(this.shape.filled ? "fill" : "stroke", color)
            }
        },
        top: {
            get () {
                return this.shape.top
            },
            set (value) {
                if(!this.shape){return}
                this.shape.set("top",value)
            }
        },
        left: {
            get () {
                return this.shape.left
            },
            set (value) {
                if(!this.shape){return}
                this.shape.set("left",value)
            }
        },
        width: {
            get () {
                return this.shape.width
            },
            set (value) {
                if(!this.shape){return}
                this.shape.set("width",value)
            }
        },
        height: {
            get () {
                return this.shape.height
            },
            set (value) {
                if(!this.shape){return}
                this.shape.set("height",value)
            }
        },
        rx: {
            get () {
                return this.shape.rx
            },
            set (value) {
                if(!this.shape){return}
                this.shape.set("rx",value)
            }
        },
        ry: {
            get () {
                return this.shape.ry
            },
            set (value) {
                if(!this.shape){return}
                this.shape.set("ry",value)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    background-color: rgba(45, 45, 45,0.8);
    border-radius: 10px;
    padding: 10px;
}

.point-detail:not(:last-child) {
    margin-bottom: 10px;
}
</style>