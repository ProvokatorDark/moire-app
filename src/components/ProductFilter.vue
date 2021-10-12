<template>
  <aside class="filter">

    <form action="#" class="filter__form form" method="get" @submit.prevent="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            v-model.number="currentPriceFrom" class="form__input"
            name="min-price"
            type="text">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            v-model.number="currentPriceTo" class="form__input"
            name="max-price"
            type="text">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select v-model.number="currentCategoryId"
                  class="form__select"
                  name="category"
                  type="text"
          >
            <option value="0">Все категории</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id">
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li v-for="material in materials" :key="material.id" class="check-list__item">
            <label class="check-list__label">
              <input v-model="currentMaterialId"
                     :value="material.id"
                     class="check-list__check sr-only"
                     name="material"
                     type="checkbox">
              <span class="check-list__desc">
                    {{ material.title }}
                    <span>({{ material.productsCount }})</span>
                  </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li v-for="(season) in seasons" :key="season.id" class="check-list__item">
            <label class="check-list__label">
              <input v-model="currentSeasonId" :value="season.id"
                     class="check-list__check sr-only"
                     name="collection"
                     type="checkbox"
              >
              <span class="check-list__desc">
                    {{ season.title }}
                    <span>({{ season.title }})</span>
                  </span>
            </label>
          </li>
        </ul>
      </fieldset>
      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="check-list">
          <li v-for="(color) in colors" :key="color.id" class="provo-list__item">
            <label class="">
              <input v-model="currentColorId" :value="color.id"
                     class=""
                     name="colors"
                     type="checkbox"
              >
              <span :style="{backgroundColor : color.code}" class="provo__check"></span>
            </label>
          </li>
        </ul>
      </fieldset>
      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>

      <button
        v-show="filterData"
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from 'axios';
import VueRouter from 'vue-router';
import { API_BASE_URL } from '../../config';

const { isNavigationFailure } = VueRouter;
export default {
  name: 'ProductFilter',
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: null,
      currentCategoryId: 0,
      currentMaterialId: [],
      currentSeasonId: [],
      currentColorId: [],

      categoriesData: null,
      materialsData: [],
      seasonsData: [],
      colorsData: [],

    };
  },
  props: {
    priceFrom: Number,
    priceTo: Number,
    categoryId: Number,
    materialId: Array,
    seasonId: Array,
    colorId: Array,
  },
  computed: {
    filterData() {
      return (
        !!(this.currentPriceFrom
          || this.currentPriceTo
          || this.currentCategoryId
          || this.currentMaterialId.length
          || this.currentSeasonId.length
          || this.currentColorId.length)
      );
    },
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },

  },
  methods: {
    querySubmitCategory() {
      this.currentCategoryId = this.categoryId;
    },
    loadCategories() {
      axios.get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => {
          this.categoriesData = response.data;
        });
    },
    loadMaterials() {
      axios.get(`${API_BASE_URL}/api/materials`)
        .then((response) => {
          this.materialsData = response.data;
        });
    },
    loadSeasons() {
      axios.get(`${API_BASE_URL}/api/seasons`)
        .then((response) => {
          this.seasonsData = response.data;
        });
    },
    loadColors() {
      axios.get(`${API_BASE_URL}/api/colors`)
        .then((response) => {
          this.colorsData = response.data;
        });
    },
    submit() {
      this.$emit('update:price-from', this.currentPriceFrom);
      this.$emit('update:price-to', this.currentPriceTo);
      this.$emit('update:category-id', this.currentCategoryId);
      this.$emit('update:material-id', this.currentMaterialId);
      this.$emit('update:season-id', this.currentSeasonId);
      this.$emit('update:color-id', this.currentColorId);
    },
    reset() {
      this.$emit('update:price-from', 0);
      this.$emit('update:price-to', null);
      this.$emit('update:category-id', 0);
      this.$emit('update:material-id', []);
      this.$emit('update:season-id', []);
      this.$emit('update:color-id', []);
      this.currentCategoryId = 0;
      this.currentPriceFrom = 0;
      this.currentPriceTo = null;

      this.$router.push({ name: 'main' })
        .catch((failure) => {
          if (isNavigationFailure(failure)) {
            console.log(failure.to.path);
            console.log(failure.from.path);
          }
        });
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    materialId(value) {
      this.currentMaterialId = value;
    },
    seasonId(value) {
      this.currentSeasonId = value;
    },
    colorId(value) {
      this.currentColorId = value;
    },
  },
  created() {
    this.querySubmitCategory();
    this.loadCategories();
    this.loadMaterials();
    this.loadSeasons();
    this.loadColors();
  },
};
</script>

<style scoped>
.provo-list__item {
  display: inline;
  font-size: 18px;
  line-height: 2;
}

.provo__check {
  padding-left: 27px;
  padding-top: 3px;
  padding-bottom: 3px;
  border: 1px solid grey;
  border-radius: 50%;
}
</style>
