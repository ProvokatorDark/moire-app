<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product' , params: {id:product.id}}">
      <img :src="srcImageUrlColors" :alt="product.title">
    </router-link>
    <h3 class="catalog__title">
      <router-link :to="{name:'product', params:{id:product.id}}">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price">
        {{ product.price | numberFormat }} ₽
    </span>
<div class="catalog__down__wrap">
  <BaseColorPicker
    :radioname="product.id"
    :colors="product.colors"
    :img-id-update.sync="imgColorIdUpdate"
  />
  <div v-if="loadingButton">
    <BaseSmallPreloader/>
  </div>
  <button v-else
    class="catalog__cart"
    type="button"
    aria-label="Добавить товар в корзину"
    @click.prevent="addToCart"
  >
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
  </button>
</div>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import BaseColorPicker from '@/components/BaseColorPicker.vue';
import srcImgUrlColorsMixins from '@/mixins/srcImgUrlColorsMixins';
import { mapActions } from 'vuex';
import BaseSmallPreloader from '@/components/BaseSmallPreloader.vue';

export default {
  name: 'ProductItem',
  data() {
    return {
      gallery: true,
      loadingButton: false,
    };
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: { BaseColorPicker, BaseSmallPreloader },
  filters: {
    numberFormat,
  },
  methods: {
    ...mapActions(['addProductToCart', 'getProduct']),
    addToCart() {
      this.loadingButton = true;
      this.getProduct(this.product.id)
        .then((data) => {
          this.addProductToCart({
            productId: String(data.id),
            quantity: String(1),
            colorId: String(data.colors[this.imgColorIdUpdate].color.id),
            sizeId: String(data.sizes[0].id),
          });
        })
        .then((data) => {
          console.log(data);
        })
        .then(() => {
          this.loadingButton = false;
        });
    },

  },
  computed: {
    isCartLoading() {
      return this.$store.state.isCartLoading;
    },
  },
  created() {

  },
  mixins: [srcImgUrlColorsMixins],
};
</script>

<style scoped>
.catalog__down__wrap {
  display: flex;
  justify-content: space-between;
}

.catalog__cart {
  background: transparent;
  border: 0;
  cursor: pointer;
}
.catalog__pic{
  width: 100%;
  height: 247px;
}
.catalog__item{
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.catalog__pic img{
  width: 100%;
  object-fit: cover;
  height: 247px;
}
</style>
