<template>
    <q-btn flat round dense icon="whatshot">
        <q-menu touch-position class="bg-primary">
            <q-list style="min-width: 100px">
                <template v-for="(feature, index) in features">
                    <q-item  v-close-popup>
                        <q-item-section>
                            <q-item-label class="text-white">{{$t("features."+feature.feature)}}</q-item-label>
                        </q-item-section>
                        <q-item-section v-if="feature.isNew" side top>
                            <q-badge color="accent" :label="$t('features.new')" />
                        </q-item-section>
                      </q-item>
                      <q-separator v-if="index < features.length-1" inset />
                </template>
            </q-list>
        </q-menu>
    </q-btn>
    
</template>

<script>
    export default {
        name: "WhatsHot",
        data() {
            return {
                features: [
                    {feature:"f1",isNew:false},
                    {feature:"f2",isNew:true}
                ]
            }
        },    
    }
</script>

<style lang="scss" scoped>

</style>