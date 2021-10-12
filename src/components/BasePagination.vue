<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow"
         :class="{'pagination__link--disabled':page===1}"
         href="#" aria-label="Предыдущая страница" @click.prevent="paginate(page-1)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a href="#" class="pagination__link" :class="{'pagination__link--current':pageNumber===page}"
         @click.prevent="paginate(pageNumber)">
        {{pageNumber}}
      </a>
    </li>
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow"
         :class="{'pagination__link--disabled':page===pages}"
         href="#" aria-label="Следующая страница" @click.prevent="paginate(page+1)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BasePagination',
  model: {
    prop: 'page',
    event: 'paginate',
  },
  props: {
    pagination: Object,
  },
  methods: {
    paginate(page) {
      if (page < 1 || page > this.pages) {
        return false;
      }
      this.$emit('paginate', page);
      return true;
    },
  },
  computed: {
    pages() {
      return this.pagination.pages;
    },
    page() {
      return this.pagination.page;
    },
  },
};
</script>

<style scoped>

</style>
