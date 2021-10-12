<template>
  <ul class="colors colors--black">
    <li class="colors__item"
        v-for="(color,index) in colors"
        :key="color.id"
    >
      <label class="colors__label">
        <input class="colors__radio sr-only"
               type="radio"
               :name="radioname"
               :value='color.id'
               :checked="index===0"
               @change.prevent="updateImg(index,color.color.id)"
        >
        <span class="colors__value" :style="{backgroundColor : color.color.code}"></span>
      </label>
    </li>

  </ul>
</template>

<script>
export default {
  name: 'BaseColorPicker',
  data() {
    return {
      currentColor: '',
    };
  },
  props: {
    radioname: {
      type: Number,
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
  },
  methods: {
    updateImg(index, id) {
      this.currentColor = id;
      this.$emit('update:imgIdUpdate', index);
      this.$emit('update:currentColor', id);
    },
  },
  created() {
    this.currentColor = this.colors[0].color.id;
  },
};
</script>

<style scoped>
.colors__value{
  border: 1px solid gray;
}

</style>
