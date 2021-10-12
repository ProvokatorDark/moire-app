<template>
  <ul class="catalog__list">
    <ProductItem v-for="(product) in products" :key="product.id" :product="product"/>
  </ul>
</template>

<script>
import ProductItem from '@/components/ProductItem.vue';

export default {
  name: 'ProductList',
  components: { ProductItem },
  props: {
    products: {
      type: Array,
    },
  },
};
</script>

<style scoped>

</style>
