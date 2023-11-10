<template>
    <div style="overflow: hidden;" class="col-grow row justify-around items-center">
      <CreationZone @object-list-updated="(s) => {shapes=s}"/>
      <Transition>
        <CodeShower v-if="showCode" :shapes="shapes" @close="showCode=false"/>
      </Transition>
      <q-btn v-if="!showCode" round size="lg" icon="code" color="accent" style="position: fixed; right: 20px;" @click="showCode=true"/>
    </div>
    
  </template>
  
  <script>
  
  import CodeShower from '@/components/CodeShower.vue';
  import CreationZone from '@/components/EGPCreation/CreationZone.vue';
  
    export default {
      name: "App",
      data() {
        return {
          showCode: true,
        }
      },
      props: {
        shapes: {
          type: Array,
          default: []
        },
      },
      components: { CodeShower, CreationZone }
  }
  </script>
  
  <style>
  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    translate: 50vw 0;
  }
  .v-enter-to,
  .v-leave-from {
    opacity: 1;
    translate: 0 0;
  }
  .v-enter-active,
  .v-leave-active {
    transition: all 1s ease;
  }
  
  </style>