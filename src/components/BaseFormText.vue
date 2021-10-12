<template>
  <BaseFormField
    :title="title"
    :front="front"
    :error="error">
    <input class="form__input" v-model="dataValue"
           type="text"  :placeholder="placeholder">
  </BaseFormField>
</template>

<script>
import BaseFormField from "@/components/BaseFormField";
export default {
  name: "BaseFormText",
  props: ['title', 'error', 'placeholder', 'front'],
  components:{BaseFormField},
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value)
      }
    }

  }
}
</script>

<style scoped>

</style>
