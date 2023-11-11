<template>
    <div class="column justify-center">
        <div class="column addcolumn">
            <q-btn v-for="shape in shapes" round color="orange" :icon="shape.icon" @click="this.$emit('add-shape',shape)">
                <q-tooltip class="bg-secondary text-body1">{{this.$t(shape.name)}}</q-tooltip>
            </q-btn>
            <q-btn v-if="selectedShape" round class="" color="negative" icon="delete" @click="this.$emit('remove-shape')"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ShapeCreator",
        data() {
            return {
                shapes: [
                    {icon:"crop_3_2",name:"shapes.rectangle",type:"rectangle"},
                    {icon:"radio_button_unchecked",name:"shapes.circle",type:"circle"},
                    {icon:"change_history",name:"shapes.triangle",type:"triangle"},
                    {icon:"text_fields",name:"shapes.text",type:"text"},
                ]
            }
        },
        props: {
            selectedShape: {
                type: Object,
                default: null
            },
        },
    }
</script>

<style lang="scss" scoped>
.addcolumn {
    margin-left: 10px;
    background-color: $dimmed-background;
    border-radius: 50px;
    padding: 10px;

}

.addcolumn > .q-btn:not(:last-child) {
    margin-bottom: 15px !important;
}
</style>