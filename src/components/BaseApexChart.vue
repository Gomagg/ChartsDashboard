<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  type: { type: String, required: true },
  series: { type: Array, required: true },
  options: { type: Object, default: () => ({}) },
  height: { type: [Number, String], default: 320 },
  width: { type: [Number, String], default: '100%' }
});

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

const defaultOptions = computed(() => ({
  chart: { background: 'transparent', toolbar: { show: true } },
  dataLabels: { enabled: false },
  tooltip: { theme: 'light' },
  legend: { show: true },
  grid: { strokeDashArray: 4, borderColor: '#e5e7eb' },
  stroke: props.type === 'line' || props.type === 'area' ? { curve: 'smooth', width: 2 } : {}
}));

const mergedOptions = computed(() => deepMerge(defaultOptions.value, props.options));
</script>

<template>
  <div class="w-full bg-white rounded-xl p-4 shadow">
    <div v-if="title" class="text-xl font-semibold mb-2">{{ title }}</div>
    <apexchart
      :type="type"
      :series="series"
      :options="mergedOptions"
      :height="height"
      :width="width"
    />
  </div>
</template>
