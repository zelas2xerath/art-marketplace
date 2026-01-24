<template>
  <div class="input-wrapper" :class="wrapperClasses">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      class="input-label"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="input-container" :class="containerClasses">
      <!-- Left Icon -->
      <div v-if="icon && iconPosition === 'left'" class="input-icon input-icon-left">
        <Icon :name="icon" :class="iconClasses" />
      </div>

      <!-- Input Element -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Right Icon -->
      <div v-if="icon && iconPosition === 'right'" class="input-icon input-icon-right">
        <Icon :name="icon" :class="iconClasses" />
      </div>
    </div>

    <!-- Helper Text / Error Message -->
    <div v-if="helperText || errorMessage" class="input-message" :class="messageClasses">
      <Icon 
        v-if="state === 'error'" 
        name="heroicons:exclamation-circle" 
        class="w-4 h-4 text-error shrink-0"
      />
      <Icon 
        v-if="state === 'success'" 
        name="heroicons:check-circle" 
        class="w-4 h-4 text-success shrink-0"
      />
      <span>{{ errorMessage || helperText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  size?: 'sm' | 'md' | 'lg'
  state?: 'default' | 'error' | 'success' | 'disabled'
  placeholder?: string
  label?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
  disabled?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}

interface InputEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  state: 'default',
  iconPosition: 'left',
  disabled: false,
  required: false
})

const emit = defineEmits<InputEmits>()

// Generate unique ID for accessibility
const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 11)}`)

// Computed state - disabled takes precedence
const computedState = computed(() => {
  if (props.disabled) return 'disabled'
  return props.state
})

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

// Computed classes
const wrapperClasses = computed(() => [
  'input-wrapper-base',
  `input-wrapper-${props.size}`
])

const labelClasses = computed(() => [
  'input-label-base',
  `input-label-${props.size}`,
  `input-label-${computedState.value}`
])

const containerClasses = computed(() => [
  'input-container-base',
  `input-container-${props.size}`,
  `input-container-${computedState.value}`,
  {
    'input-container-with-left-icon': props.icon && props.iconPosition === 'left',
    'input-container-with-right-icon': props.icon && props.iconPosition === 'right'
  }
])

const inputClasses = computed(() => [
  'input-base',
  `input-${props.size}`,
  `input-${computedState.value}`,
  {
    'input-with-left-icon': props.icon && props.iconPosition === 'left',
    'input-with-right-icon': props.icon && props.iconPosition === 'right'
  }
])

const iconClasses = computed(() => [
  'input-icon-base',
  `input-icon-${props.size}`,
  `input-icon-${computedState.value}`
])

const messageClasses = computed(() => [
  'input-message-base',
  `input-message-${props.size}`,
  `input-message-${computedState.value}`
])
</script>

<style scoped>
/* Input Wrapper */
.input-wrapper-base {
  @apply w-full;
}

.input-wrapper-sm {
  @apply space-y-1;
}

.input-wrapper-md {
  @apply space-y-2;
}

.input-wrapper-lg {
  @apply space-y-2;
}

/* Label Styles */
.input-label-base {
  @apply block font-medium text-gray-700 transition-colors duration-200;
}

.input-label-sm {
  @apply text-sm;
}

.input-label-md {
  @apply text-sm;
}

.input-label-lg {
  @apply text-base;
}

.input-label-error {
  @apply text-error;
}

.input-label-success {
  @apply text-success;
}

.input-label-disabled {
  @apply text-gray-400;
}

/* Input Container */
.input-container-base {
  @apply relative flex items-center;
}

/* Input Base Styles */
.input-base {
  @apply w-full border rounded-lg bg-white text-gray-900 placeholder-gray-400 
         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0;
}

/* Input Sizes */
.input-sm {
  @apply px-3 py-2 text-sm;
}

.input-md {
  @apply px-4 py-3 text-base;
}

.input-lg {
  @apply px-4 py-4 text-lg;
}

/* Input with Icons */
.input-with-left-icon.input-sm {
  @apply pl-10;
}

.input-with-left-icon.input-md {
  @apply pl-12;
}

.input-with-left-icon.input-lg {
  @apply pl-14;
}

.input-with-right-icon.input-sm {
  @apply pr-10;
}

.input-with-right-icon.input-md {
  @apply pr-12;
}

.input-with-right-icon.input-lg {
  @apply pr-14;
}

/* Input States */
.input-default {
  @apply border-gray-300 focus:border-primary-500 focus:ring-primary-500;
}

.input-default:hover {
  @apply border-gray-400;
}

.input-error {
  @apply border-error focus:border-error focus:ring-error;
}

.input-success {
  @apply border-success focus:border-success focus:ring-success;
}

.input-disabled {
  @apply border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed;
}

.input-disabled:hover {
  @apply border-gray-200;
}

/* Icon Styles */
.input-icon {
  @apply absolute flex items-center justify-center pointer-events-none;
}

.input-icon-left {
  @apply left-0;
}

.input-icon-right {
  @apply right-0;
}

.input-icon-base {
  @apply text-gray-400 transition-colors duration-200;
}

.input-icon-sm {
  @apply w-4 h-4 ml-3;
}

.input-icon-md {
  @apply w-5 h-5 ml-4;
}

.input-icon-lg {
  @apply w-6 h-6 ml-4;
}

.input-icon-error {
  @apply text-error;
}

.input-icon-success {
  @apply text-success;
}

.input-icon-disabled {
  @apply text-gray-300;
}

/* Message Styles */
.input-message-base {
  @apply flex items-start gap-1 transition-colors duration-200;
}

.input-message-sm {
  @apply text-xs;
}

.input-message-md {
  @apply text-sm;
}

.input-message-lg {
  @apply text-sm;
}

.input-message-default {
  @apply text-gray-600;
}

.input-message-error {
  @apply text-error;
}

.input-message-success {
  @apply text-success;
}

.input-message-disabled {
  @apply text-gray-400;
}

/* Container States */
.input-container-default {
  /* Default container styles */
}

.input-container-error {
  /* Error container styles */
}

.input-container-success {
  /* Success container styles */
}

.input-container-disabled {
  /* Disabled container styles */
}

/* Focus-within for container highlighting */
.input-container-base:focus-within .input-icon-base {
  @apply text-primary-500;
}

.input-container-error:focus-within .input-icon-base {
  @apply text-error;
}

.input-container-success:focus-within .input-icon-base {
  @apply text-success;
}

.input-container-disabled:focus-within .input-icon-base {
  @apply text-gray-300;
}
</style>