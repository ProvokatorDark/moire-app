<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info" v-if="products">
          {{ $store.getters.appTotalItems }} {{ howManyItemsInfo }}
        </span>
      </div>
    </div>
    <div class="provo__title">
      <span class="form__legend">Количество товаров на странице</span>
      <label class="form__label form__label--select">
        <select
          v-model.number="productsPerPage"
          class="form__select"
          name="items"
          type="text"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="32">32</option>
        </select>
      </label>
    </div>
    <h5 class="provo__title">Фильтр</h5>
    <div class="content__catalog">

      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :material-id.sync="filterMaterialId"
        :season-id.sync="filterSeasonId"
        :color-id.sync="filterColorId"
      />
      <section class="catalog">
        <div v-if="productsLoading" >
          <BaseBigPreloader/>
        </div>
        <div v-else>
          <ProductList
            v-if="products"
            :products="products.items"/>
        </div>
        <div v-if="productsLoadingFailed">Произошла ошибка при загрузке товаров...
          <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>
        <BasePagination
          v-model="page"
          v-if="products.pagination"
          :pagination="products.pagination"/>
      </section>
    </div>
  </main>
</template>

<script>

import ProductList from '@/components/ProductList.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import BasePagination from '@/components/BasePagination.vue';
import axios from 'axios';
import { mapState } from 'vuex';
import howManyItemsInfo from '@/helpers/howManyItemsInfo';
import BaseBigPreloader from '@/components/BaseBigPreloader.vue';
import { API_BASE_URL } from '../../config';

export default {
  name: 'MainPage',
  components: {
    ProductList, ProductFilter, BasePagination, BaseBigPreloader,
  },
  data() {
    return {
      productsData: null,
      page: 1,
      productsPerPage: 12,
      productsLoading: false,
      productsLoadingFailed: false,
      filterPriceFrom: null,
      filterPriceTo: null,
      filterCategoryId: null,
      filterMaterialId: [],
      filterSeasonId: [],
      filterColorId: [],
    };
  },
  computed: {
    howManyItemsInfo,
    ...mapState({
      countProducts: 'appProductsItems',
    }),
    products() {
      return this.productsData ? this.productsData : [];
    },

  },
  methods: {
    categoryPatcher() {
      if (this.$route.query.category) {
        this.filterCategoryId = Number(this.$route.query.category);
      }
    },
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            materialIds: this.filterMaterialId,
            seasonIds: this.filterSeasonId,
            colorIds: this.filterColorId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
          },
        })
          .then((response) => {
            this.productsData = response.data;
          })
          .then(() => this.$store.commit('updateAppProductsItems', this.productsData.pagination.total))
          .catch(() => {
            this.productsLoadingFailed = true;
          })
          .finally(() => {
            this.productsLoading = false;
          });
      }, 100);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterMaterialId() {
      this.loadProducts();
    },
    filterSeasonId() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
    productsPerPage() {
      this.loadProducts();
    },
  },
  created() {
    this.categoryPatcher();
    this.loadProducts();
  },
};
</script>

<style scoped>
body {
  margin: 0;
}
.catalog__list{
  grid-template-columns: repeat(4,200px);
  grid-gap: 55px 20px;
}
.provo__title{
  max-width: 290px;
  padding: 0 25px;
}
</style>
