<template>
  <div id="app">
    <BaseHeader></BaseHeader>
    <router-view/>
    <BaseFooter></BaseFooter>
  </div>
</template>
<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import {mapActions , mapMutations} from 'vuex';

export default {
  name: 'App',
  components: {
    BaseHeader,
    BaseFooter,
  },
  methods:{
    ...mapActions(['loadCart']),
    ...mapMutations(['updateAccessKey']),
  },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey){
        this.updateAccessKey(userAccessKey)
    }
    this.loadCart();
  }
};
</script>

<style>

</style>
