<template>
  <button
    :class="[
      'btn',
      type ? `btn-${type}` : '',
      size ? `btn-${size}` : '',
      { 'btn-icon': icon && !text, 'btn-block': block, 'btn-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="onClick"
  >
    <i v-if="icon" :class="['fas', `fa-${icon}`]"></i>
    <span v-if="text" class="btn-text">{{ text }}</span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'success', 'error', 'info', 'warning'].includes(value)
    },
    size: {
      type: String,
      default: '',
      validator: value => ['', 'sm', 'lg'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    onClick(event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  gap: 8px;
}

.btn:hover {
  opacity: 0.9;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #0d5eb3;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e5e5e5;
}

.btn-success {
  background-color: #4caf50;
  color: white;
}

.btn-success:hover {
  background-color: #45a049;
}

.btn-error {
  background-color: #f44336;
  color: white;
}

.btn-error:hover {
  background-color: #d32f2f;
}

.btn-info {
  background-color: #2196f3;
  color: white;
}

.btn-info:hover {
  background-color: #0b7dda;
}

.btn-warning {
  background-color: #ff9800;
  color: white;
}

.btn-warning:hover {
  background-color: #e68900;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-lg {
  padding: 10px 20px;
  font-size: 16px;
}

.btn-block {
  display: flex;
  width: 100%;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-disabled:hover {
  opacity: 0.5;
}

.btn-disabled:active {
  transform: none;
}
</style> 