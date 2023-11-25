<template>
    <div class="row justify-center items-center">
        <q-btn v-if="canvaIndex>0" round flat icon="navigate_before" color="orange" @click="$emit('prev')"/>
        {{ $t("canva_select.screenX")+(canvaIndex+1) }}
        <q-btn v-if="canvaIndex<canvasList.length-1" round flat icon="navigate_next" color="orange" @click="$emit('next')"/>
        <q-btn v-if="canvaIndex==canvasList.length-1" :disabled="canvasList.length>=5" round flat icon="add_circle" color="orange" @click="$emit('add')"/>
    </div>
</template>

<script>
export default {
    name: "CanvaSwitcher",
    props: {
        canvasList: {
            type: Array,
            default: []
        },
        canvaIndex: {
            type: Number,
            default: 0
        },
    },
}
</script>

<style lang="scss" scoped>
div {
    color: white;
    font-size: large;
}
</style>