<template>
    <div class="column justify-center">
        <div class="column addcolumn">
            <q-btn v-for="button in buttons" round color="positive" :icon="button.icon" @click="this.$emit('move',button.name)">
                <q-tooltip class="bg-secondary text-body2">{{this.$t("editor."+button.name)}}</q-tooltip>
            </q-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: "ShapeOrder",
    data() {
        return {
            buttons: [
                {icon: "flip_to_front", name:"bringtofront"},
                {icon: "expand_less", name:"bringforward"},
                {icon: "expand_more", name:"sendbackwards"},
                {icon: "flip_to_back", name:"sendtoback"},

            ]
        }
    },
}
</script>

<style lang="scss" scoped>
.addcolumn {
    margin-right: 10px;
    background-color: $dimmed-background;
    border-radius: 50px;
    padding: 10px;

}

.addcolumn > .q-btn:not(:last-child) {
    margin-bottom: 15px !important;
}
</style>