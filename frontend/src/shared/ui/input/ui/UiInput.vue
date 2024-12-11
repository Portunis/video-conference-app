<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  data: {
    type: Object as PropType<{
      label: string;
      placeholder: string;
      type: string;
    }>,
    default: () => {},
  },
  modelValue: [String, Number],
});
const emit = defineEmits(["update:modelValue"]);
const updateInput = (event: Event): void => {
  const eventTarget = event.target as HTMLInputElement;
  emit("update:modelValue", eventTarget.value);
  console.log('input', eventTarget.value)
};
</script>

<template>
  <div class="ui-input">
    <label class="ui-input__label" v-if="data.label">{{ data.label }}</label>
    <div class="ui-input__container">
      <input
        :placeholder="data.placeholder"
        @input="updateInput"
        :value="modelValue"
        :type="data.type"
        class="ui-input__input"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "style";
</style>
