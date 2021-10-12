<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name:'main'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name:'cart'}" class="breadcrumbs__link">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="validateForm">
        <div class="cart__field">
          <div v-if="sendingBasket">
            <BaseBigPreloader/>
          </div>
          <div v-else class="cart__data">
            <BaseFormText
              v-model="formData.name"
              title="ФИО"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
              :front="front.name"
            />

            <BaseFormText
              v-model="formData.address"
              title="Адрес доставки"
              :error="formError.address"
              placeholder="Введите ваш адрес"
              :front="front.address"
            />

            <BaseFormText
              v-model="formData.phone"
              title="Телефон"
              :error="formError.phone"
              placeholder="Введите ваш телефон"
              :front="front.phone"
            />

            <BaseFormText
              v-model="formData.email"
              title="Email"
              :error="formError.email"
              placeholder="Введите ваш Email"
              :front="front.email"
            />
            <BaseFormTextArea
              v-model="formData.comment"
              title="Комментарий к заказу"
              :error="formError.comment"
              placeholder="Ваши пожелания"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <div v-if="sendingBasket">
              <BaseBigPreloader/>
            </div>
            <ul v-else class="cart__options options">
              <li class="options__item" v-for="item in this.deliveries" :key="item.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="item.id"
                    v-model="formData.deliveryTypeId"
                  >
                  <span class="options__value">
                    {{ item.title }} <b>{{ item.price|numberFormat }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <div v-if="sendingBasket">
              <BaseBigPreloader/>
            </div>
            <ul v-else class="cart__options options">
              <li class="options__item" v-for="item in this.payments" :key="item.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="item.id"
                    v-model="formData.paymentTypeId"
                  >
                  <span class="options__value">
                    {{ item.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <BaseOrderInfoPanel :products="cardOrderInfo" :support="supportOrderInfo">
            <button class="cart__button button button--primery" type="submit">
              Оформить заказ
            </button>
          </BaseOrderInfoPanel>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>

import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextArea from '@/components/BaseFormTextArea.vue';
import axios from 'axios';
import numberFormat from '@/helpers/numberFormat';
import BaseOrderInfoPanel from '@/components/BaseOrderInfoPanel.vue';
import { mapGetters } from 'vuex';
import howManyItemsInfo from '@/helpers/howManyItemsInfo';
import BaseBigPreloader from '@/components/BaseBigPreloader.vue';
import { API_BASE_URL } from '../../config';

export default {
  name: 'OrderPage',
  data() {
    return {
      formData: {
        deliveryTypeId: null,
        paymentTypeId: null,
      },
      formError: {},
      formErrorMessage: '',
      deliveries: [],
      payments: [],
      errors: [],
      front: {
        name: '',
        address: '',
        phone: '',
        email: '',
      },
      sendingBasket: false,
    };
  },
  components: {
    BaseFormText,
    BaseFormTextArea,
    BaseOrderInfoPanel,
    BaseBigPreloader,
  },
  computed: {
    ...mapGetters({
      cartProducts: 'cartDetailProducts',
      cartTotalPrice: 'cartTotalPrice',
    }),
    howManyItemsInfo,
    deliveryItem: {
      get() {
        return this.formData.deliveryTypeId
          ? this.deliveries.find((item) => item.id === this.formData.deliveryTypeId).price
          : null;
      },
    },
    cardOrderInfo() {
      return this.cartProducts.map((item) => ({
        title: item.productTitle,
        price: item.productPrice,
        id: item.productId,
        quantity: item.productQuantity,
        howMany: 'ijij',
      }));
    },
    supportOrderInfo() {
      return {
        deliveryPrice: this.$store.getters.getDeliveryPrice,
        numberItems: this.$store.getters.cartTotalItems,
        orderFullPrice: this.cartTotalPrice + this.$store.getters.getDeliveryPrice,
        deliveryTitle: 'Доставка',
        howMany: this.howManyItemsInfo,
      };
    },
  },
  filters: { numberFormat },
  methods: {
    validEmail(email) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(email);
    },
    validPhone(phone) {
      const pattern = /^\+\d{11}$/;
      return pattern.test(phone);
    },
    validateForm() {
      this.errors = [];
      this.front.name = '';
      this.front.address = '';
      this.front.phone = '';
      this.front.email = '';
      if (!this.formData.name) {
        this.errors.push('Имя');
        this.front.name = 'Введите свое имя пожалуйста';
      }
      if (!this.formData.address) {
        this.errors.push('Адрес');
        this.front.address = 'Введите адрес доставки плиз';
      }
      if (!this.formData.phone) {
        this.errors.push('Телефон');
        this.front.phone = 'Вы забыли указать свой номер телефона';
      } else if (!this.validPhone(this.formData.phone)) {
        this.errors.push('Телефон');
        this.front.phone = 'Укажите корректный номер телефона';
      }
      if (!this.formData.email) {
        this.errors.push('Емейл');
        this.front.email = 'Заполните поле Email пожалуйста';
      } else if (!this.validEmail(this.formData.email)) {
        this.errors.push('Емейл');
        this.front.email = 'Укажите корректный адрес электронной почты';
      }
      if (!this.errors.length) {
        this.order();
      }
    },
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.sendingBasket = true;
      axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          this.$store.commit('resetCart');
          this.sendingBasket = false;
          this.$store.commit('updateOrderInfo', response.data);
          this.$router.push({
            name: 'orderInfo',
            params: {
              id: response.data.id,
            },
          });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
          this.sendingBasket = false;
        });
    },
    getDeliveries() {
      return axios
        .get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => {
          this.deliveries = response.data;
        })
        .then(() => {
          this.formData.deliveryTypeId = this.deliveries[0].id;
        })
        .then(() => {
          this.getPayments(this.formData.deliveryTypeId);
        });
    },
    getPayments(values) {
      return axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: values,
          },
        })
        .then((response) => {
          this.payments = response.data;
        })
        .then(() => {
          this.formData.paymentTypeId = this.payments[0].id;
        });
    },
    updatePayments(values) {
      return axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: values,
          },
        })
        .then((response) => {
          this.payments = response.data;
        });
    },
  },
  watch: {
    'formData.deliveryTypeId': function (val, oldVal) {
      if (oldVal === null) { return; }
      axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: this.formData.deliveryTypeId,
          },
        })
        .then((response) => {
          this.payments = response.data;
        })
        .then(() => {
          this.formData.paymentTypeId = this.payments[0].id;
        });
    },
    deliveryItem() {
      this.$store.commit('updateDeliveryPrice', Number(this.deliveryItem));
    },
  },
  created() {
    this.getDeliveries();
  },
};
</script>

<style scoped>

</style>
