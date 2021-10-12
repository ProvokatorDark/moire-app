<template>
  <div v-if="productLoading">
    <BaseBigPreloader/>
  </div>
  <div v-else-if="!product">Произошла ошибка при загрузке товарa...
    <button @click.prevent="loadProduct">Попробовать еще раз</button>
  </div>
  <main v-else class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name:'main'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main',query:{category:category.id}}" class="breadcrumbs__link">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <BaseGallery :product="product"
                   :gallery-id-update="imgGalleryIdUpdate"
                   :img-id-update="imgColorIdUpdate"/>
      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <div class="form__counter">

                <button type="button"
                        aria-label="Убрать один товар"
                        @click.prevent="amounted(productAmount-1)">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount">

                <button type="button"
                        aria-label="Добавить один товар"
                        @click.prevent="amounted(productAmount+1)">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price">
                {{ product.price|numberFormat }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>

                <BaseColorPicker
                  :radioname="product.id"
                  :colors="product.colors"
                  :img-id-update.sync="imgColorIdUpdate"
                  :current-color.sync="productColorId"
                />

              </fieldset>
              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select"
                          type="text"
                          name="category"
                          v-model="productSizeId">
                    <option
                      v-for="size in product.sizes"
                      :value="size.id"
                      :key="size.id"
                    >{{ size.title }}
                    </option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit"
                    :disabled="productAddSending">
              <span v-show="!productAdded&&!productAddSending">В корзину</span>
              <span v-show="productAdded">Товар добавлен</span>
              <span v-show="productAddSending">Добавляем товар...</span>
            </button>
            <BaseSmallPreloader v-show="productAddSending"/>
          </form>
        </div>
      </div>

      <BaseTabs>
        <BaseTab label="Информация о товаре" :selected="true">
          <div v-if="product.content">{{product.content}}</div>
          <div v-else>
            <h3>Состав:</h3>
            <p>
              60% хлопок<br>
              30% полиэстер<br>
            </p>
            <h3>Уход:</h3>
            <p>
              Машинная стирка при макс. 30ºC короткий отжим<br>
              Гладить при макс. 110ºC<br>
              Не использовать машинную сушку<br>
              Отбеливать запрещено<br>
              Не подвергать химчистке<br>
            </p>
          </div>
        </BaseTab>
        <BaseTab label="Доставка и возврат">
          <h3>Доставка:</h3>
          <p>
            1. Курьерская доставка по Москве и Московской области – 290 ₽<br>
            2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь<br>
          </p>
          <h3>Возврат:</h3>
          <p>
            Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br>
            Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в
            которой Вы осуществили
            покупку.
            БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по
            телефону 8 800 600 90
            09<br>
          </p>
        </BaseTab>
      </BaseTabs>

    </section>
  </main>
</template>

<script>
import axios from 'axios';
import numberFormat from '@/helpers/numberFormat';
import BaseColorPicker from '@/components/BaseColorPicker.vue';
import srcImgUrlColorsMixins from '@/mixins/srcImgUrlColorsMixins';
import BaseTab from '@/components/BaseTab.vue';
import BaseTabs from '@/components/BaseTabs.vue';
import BaseGallery from '@/components/BaseGallery.vue';
import { mapActions } from 'vuex';
import BaseBigPreloader from '@/components/BaseBigPreloader.vue';
import BaseSmallPreloader from '@/components/BaseSmallPreloader.vue';
import { API_BASE_URL } from '../../config';

export default {
  name: 'ProductPage',
  data() {
    return {
      productAmount: 1,
      productData: null,

      productColorId: null,
      productSizeId: null,

      productLoading: false,
      productLoadingFailed: false,

      productAdded: false,
      productAddSending: false,
    };
  },
  computed: {
    product() {
      return this.productData;
    },
    category() {
      return this.productData.category;
    },
    productId() {
      return this.productData.id;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((response) => { this.productData = response.data; })
        .then(() => this.init())
        .catch(() => { this.productLoadingFailed = true; })
        .finally(() => { this.productLoading = false; });
    },
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart(
        {
          productId: String(this.productId),
          quantity: String(this.productAmount),
          colorId: String(this.productColorId),
          sizeId: String(this.productSizeId),
        },
      )
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    amounted(value) {
      if (value >= 1) {
        this.productAmount = value;
      }
    },
    init() {
      this.productSizeId = this.productData.sizes[0].id;
      this.productColorId = this.productData.colors[0].color.id;
    },
  },
  components: {
    BaseColorPicker,
    BaseTab,
    BaseTabs,
    BaseGallery,
    BaseBigPreloader,
    BaseSmallPreloader,
  },
  filters: {
    numberFormat,
  },
  mixins: [srcImgUrlColorsMixins],
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.dot {
  width: 24px;
  height: 24px;
  background: #3ac;
  border-radius: 100%;
  display: inline-block;
  animation: slide 1s infinite;
}

.dot:nth-child(1) {
  animation-delay: 0.1s;
  background: #32aacc;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #64aacc;
}

.dot:nth-child(3) {
  animation-delay: 0.3s;
  background: #96aacc;
}

.dot:nth-child(4) {
  animation-delay: 0.4s;
  background: #c8aacc;
}

.dot:nth-child(5) {
  animation-delay: 0.5s;
  background: #faaacc;
}

@-moz-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}

@-o-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}

</style>
