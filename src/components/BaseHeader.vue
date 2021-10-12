<template>
  <header class="header container">
    <div class="header__wrapper">
      <router-link :to="{name:'main'}">
        <span class="header__info">Каталог</span>
      </router-link>

      <router-link :to="{name:'main'}" class="header__logo">
        <img src="img/svg/logo-moire.svg"
             alt="Логотип интернет магазина Moire" width="116" height="34">
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09">
        8 800 600 90 09
      </a>
      <div v-if="isCartLoading">
        <BaseSmallPreloader/>
      </div>
      <div v-else>
        <CartIndicator/>
      </div>

    </div>
  </header>
</template>

<script>
import CartIndicator from '@/components/CartIndicator.vue';
import BaseSmallPreloader from '@/components/BaseSmallPreloader.vue';

export default {
  name: 'BaseHeader',
  components: {
    CartIndicator,
    BaseSmallPreloader,
  },
  computed: {
    isCartLoading() {
      return this.$store.state.isCartLoading;
    },
  },
};
</script>

<style scoped>

</style>
