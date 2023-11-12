<template>
  <div style="height: 100%" class="column no-wrap">
    <q-toolbar class="bg-secondary shadow-3 text-white">
      <q-icon name="data_object" size="3em"/>
      <q-toolbar-title>Easy E2</q-toolbar-title>
      <q-select filled popup-content-class="qselectpopup" dark style="margin:2px 15px;font-size:large;text-transform: uppercase;"
      bg-color="primary" color="blue" v-model="$i18n.locale" :options="$i18n.availableLocales"/>
      <whats-hot/>
    </q-toolbar>
    <router-view/>
  </div>
</template>

<script>
import WhatsHot from './components/WhatsHot.vue';

  export default {
    name: "App",
    components: { WhatsHot }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
.qselectpopup {
  background-color: $primary !important;
  color: white;
  font-weight: 600;
  font-size:large;
  text-transform: uppercase;
}

</style>