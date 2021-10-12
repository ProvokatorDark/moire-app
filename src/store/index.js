import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cardProducts: [],
    appProductsItems: null,
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
    deliveryPrice: null,
    isCartLoading: false,
    singleProductData: null,
  },
  mutations: {
    updateCartLoading(state, status) {
      state.isCartLoading = status;
    },
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cardProducts = [];
      state.cartProductsData = [];
    },
    updateAppProductsItems(state, quantity) {
      state.appProductsItems = quantity;
    },
    updateAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    updateCartProductAmount(state, { basketItemId, quantity }) {
      const item = state.cardProducts.find((product) => product.id === basketItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    syncCartProducts(state) {
      state.cardProducts = state.cartProductsData;
    },
    deleteCartProduct(state, productId) {
      state.cardProducts = state.cardProducts.filter((item) => item.id !== productId);
    },
    updateDeliveryPrice(state, price) {
      state.deliveryPrice = price;
    },
    updateSingleProductData(state, data) {
      state.singleProductData = data;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      context.commit('updateCartLoading', true);
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartLoading', false);
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, {
      productId, quantity, colorId, sizeId,
    }) {
      context.commit('updateCartLoading', true);
      return (new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => axios
          .post(`${API_BASE_URL}/api/baskets/products`, {
            productId,
            quantity,
            colorId,
            sizeId,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            context.commit('updateCartProductsData', response.data.items);
            context.commit('updateCartLoading', false);
            context.commit('syncCartProducts');
          }));
    },
    updateCartProductAmount(context, { basketItemId, quantity }) {
      if (quantity < 1) {
        return;
      }
      context.commit('updateCartLoading', true);
      context.commit('updateCartProductAmount', { basketItemId, quantity });
      axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('updateCartLoading', false);
        })
        .catch(() => {
          context.commit('syncCartProducts');
          context.commit('updateCartLoading', false);
        });
    },
    deleteCartProduct(context, productId) {
      context.commit('updateCartLoading', true);
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          data: {
            basketItemId: String(productId),
          },
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            context.commit('deleteCartProduct', productId);
            context.commit('updateCartLoading', false);
          } else {
            console.log('Ответ сервера ', response.status);
          }
        })
        .catch((error) => {
          console.log(error);
          context.commit('updateCartLoading', false);
        });
    },
    getProduct(context, productId) {
      return axios
        .get(`${API_BASE_URL}/api/products/${productId}`)
        .then((response) => {
          context.commit('updateSingleProductData', response.data);
          return response.data;
        });
    },

  },
  getters: {
    singleProductData(state) {
      return state.singleProductData;
    },
    orderInfo(state) {
      return state.orderInfo;
    },
    getDeliveryPrice(state) {
      return state.deliveryPrice;
    },
    appTotalItems(state) {
      return state.appProductsItems;
    },
    cartTotalItems(state) {
      return state.cardProducts
        .map((item) => item.quantity).reduce((sum, current) => sum + current, 0);
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts
        .reduce((acc, item) => (item.productPrice * item.productQuantity) + acc, 0);
    },
    cartDetailProducts(state) {
      return state.cardProducts.map((item) => ({
        productBascetId: item.id,
        productColorId: item.color.color.id,
        productColorCode: item.color.color.code,
        productColorTitle: item.color.color.title,
        productTitle: item.product.title,
        productId: item.product.id,
        productQuantity: item.quantity,
        productPrice: item.price,
        productImgUrl: item.color.gallery[0].file.url,
      }));
    },
  },
});
