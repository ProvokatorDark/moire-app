<template>
  <BaseFormField
    :title="title"
    :error="error">
    <textarea
      class="form__input form__input--area"
      v-model="dataValue"
      :placeholder="placeholder">
    </textarea>
  </BaseFormField>
</template>

<script>
import BaseFormField from "@/components/BaseFormField";
export default {
  name: "BaseFormTextArea",
  props: ['title', 'error', 'placeholder'],
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
