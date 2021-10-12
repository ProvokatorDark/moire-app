<template>
  <div class="item__pics pics">
    <div class="pics__wrapper">
      <img width="570" height="570" :src="srcImageUrlColors" :alt="product.title">
    </div>
    <ul class="pics__list">
      <template>
        <li v-for="(item,index) in product.colors[imgColorIdUpdate].gallery" class="pics__item">
          <a href="#" class="pics__link" @click.prevent="thumbClick(index)"
             :class="{'pics__link--current':index===imgGalleryIdUpdate}">
            <img width="98" height="98" :src="item.file.url">
          </a>
        </li>
      </template>
    </ul>

  </div>
</template>

<script>
import srcImageUrlColors from "@/helpers/srcImageUrlColors";

export default {
  name: 'BaseGallery',
  data() {
    return {
      imgColorIdUpdate: 0,
      imgGalleryIdUpdate: 0,
    }
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    imgIdUpdate: {
      type: Number,
      required: true
    },
    galleryIdUpdate: {
      type: Number,
      required: true
    },
  },
  methods: {
    thumbClick(index){
      this.imgGalleryIdUpdate = index
    }

  },
  computed: {
    srcImageUrlColors,
  },
  watch: {
    imgIdUpdate: function (imgIdUpdate) {
      this.imgColorIdUpdate = imgIdUpdate
    },
    galleryIdUpdate: function (galleryIdUpdate) {
      this.imgGalleryIdUpdate = galleryIdUpdate
    }
  },
  created() {

  }
};
</script>

<style scoped>

</style>
