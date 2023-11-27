<template>
    <div class="container column items-center" style="width: 500px; margin-top: 20px;">
        <p class="title">{{$t("actions.title")}}</p>
        <q-btn class="addAction" push color="positive" :label="$t('actions.add')" @click="showDialog=true">
            <q-tooltip class="bg-secondary text-body2">{{$t("actions.addtip")}}</q-tooltip>
        </q-btn>
        <q-dialog v-model="showDialog">
            <q-card dark class="actionDialog bg-secondary shadow-10">
                <q-card-section class="q-pb-none" style="text-align: center;">
                    <p>{{$t("actions.add")}}</p>
                </q-card-section>
                <q-separator dark/>
                <q-card-actions vertical>
                    <q-select dark rounded filled v-model="action.type" popup-content-class="bg-primary" color="positive"
                    :options="actions" :option-label="opt => $t('actions.type.'+opt)" label="Action"/>
                    <div v-if="action.type" class="q-my-lg text-center">
                        <q-form @submit="saveAction" class="actionOptions">
                            <!-- Remove object -->
                            <div v-if="action.type=='remove'" class="row justify-evenly items-center">
                                {{$t('actions.removeObjctNbr')}}
                                <q-input dark square filled hide-bottom-space v-model="action.objIndex"
                                type="number" :placeholder="screenObjectsCount"
                                :rules="[i => isValidObjectIndex(i)]"/>
                            </div>
                            <!-- Change text -->
                            <div v-if="action.type=='changeText'" class="row justify-evenly items-center">
                                {{$t('actions.changeTextNbr')}}
                                <q-input dark square filled hide-bottom-space v-model="action.objIndex"
                                type="number" :placeholder="screenObjectsCount" :rules="[index => isValidTextIndex(index)]"/>
                            </div>
                            <div v-if="action.type=='changeText'" class="row justify-evenly items-center">
                                {{$t('actions.changeTextTo')}}
                                <q-input dark square filled counter v-model="action.newText" :placeholder="$t('newText')" maxlength="100"/>
                            </div>
                            <!-- Move object -->
                            <div v-if="action.type=='move'" class="row justify-evenly items-center">
                                {{$t('actions.moveObjctNbr')}}
                                <q-input dark square filled hide-bottom-space v-model="action.objIndex"
                                type="number" :placeholder="screenObjectsCount" 
                                :rules="[i => isValidObjectIndex(i)]"/>
                            </div>
                            <div v-if="action.type=='move'" class="row justify-evenly items-center">
                                {{$t('actions.newPos')}}
                                <q-input dark square filled hide-bottom-space v-model="action.left"
                                type="number" label="X" style="max-width: 30%;"/>
                                <q-input dark square filled hide-bottom-space v-model="action.top"
                                type="number" label="Y" style="max-width: 30%;"/>
                            </div>
                            <!-- Change screen -->
                            <div v-if="action.type=='switchScreen'" class="row justify-evenly items-center">
                                {{$t('actions.gotoScreen')}}
                                <q-input dark square filled hide-bottom-space v-model="action.gotoScreen"
                                type="number" :placeholder="screenCount" 
                                :rules="[i => isValidScreenIndex(i)]"/>
                            </div>
                            <q-btn no-caps push color="primary" class="q-mt-xl" size="lg" :label="$t('add')"
                            type="sumbit"/>
                        </q-form>

                    </div>
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div class="actions">
            <div v-if="shape.actions.length==0">{{$t("actions.noActions")}}</div>
            <q-chip v-for="(a,index) in shape.actions" removable :label="$t('actions.type.'+a.type)"
            :color="chipInfo[a.type].color" :icon="chipInfo[a.type].icon" text-color="white" @remove="removeAction(index)"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useScreensStore } from '@/stores/screensObjects'

export default {
    name: "Actions",
    data() {
        return {
            showDialog: false,
            chipInfo: {
                remove: {icon:"close", color:"negative"},
                changeText: {icon:"edit_note", color:"teal"},
                move: {icon:"open_with", color:"secondary"},
                switchScreen: {icon:"exit_to_app", color:"primary"},
            },
            actions: ["remove", "changeText", "move", "switchScreen"],
            action: {}
        }
    },
    computed: {
        ...mapState(useScreensStore, ['screensObjects','activeCanva']),
        screenObjectsCount() {
            return '1 ... '+this.screensObjects[this.activeCanva].length 
        },
        screenCount() {
            return '1 ... '+this.screensObjects.length 
        },
    },
    props: {
        shape: {
            type: Object,
            default: null
        },
    },
    methods: {
        //Action creation
        isValidObjectIndex(i) {
            return i>0 && i<=this.screensObjects[this.activeCanva].length
        },
        isValidTextIndex(i) {
            if(!this.isValidObjectIndex(i)) {return false}
            if(this.screensObjects[this.activeCanva][i-1].type!="i-text") {return false}
            return true
        },
        isValidScreenIndex(i) {
            return i>0 && i<=this.screensObjects.length
        },
        saveAction() {
            this.showDialog = false
            this.shape.actions.push(this.action)
            this.$q.notify({
                message: this.$t("actions.added"),
                color: 'positive'})  
        },
        //Action management
        removeAction(i) {
            this.shape.actions.splice(i,1)
        }
    },
    watch: {
        showDialog() {
            this.action = {};
        },
        'action.type'() { //Reset unwanted properties
            this.action = {type: this.action.type}
        },
        'action.objIndex'(i) { //Reset unwanted properties
            if(!this.isValidObjectIndex(i)) {return}
            let shape = this.screensObjects[this.activeCanva][i-1]
            this.action.left = shape.left
            this.action.top = shape.top
        }
    },
}
</script>

<style lang="scss" scoped>
div.container {
    background-color: $accent;
    box-shadow: 0 0 10px orange;
    margin-bottom: 10px;
}

button.addAction {
    width: 50%;
}
.title {
    text-align: center;
    color: white;
    font-size: large;
    font-weight: bold;
}

div.actions {
    background-color: orange;
    margin-top: 10px;
    padding: 10px;
    border-radius: 10px;
}

.actionDialog {
    width: 50vw;
    border-radius: 20px;
}
.actionOptions > div:not(:last-of-type) {
    margin-bottom: 15px;
}
</style>