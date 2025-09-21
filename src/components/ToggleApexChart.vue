<template>
  <div>
    <div class="flex items-center gap-2 mb-3">
      <label class="text-sm text-slate-600">View:</label>
      <select v-model="currentType" class="border rounded px-2 py-1 text-sm">
        <option v-for="t in types" :key="t" :value="t">{{ t[0].toUpperCase() + t.slice(1) }}</option>
      </select>
    </div>
    <BaseApexChart
      :title="title + ' (' + (currentType[0].toUpperCase() + currentType.slice(1)) + ')'"
      :type="currentType"
      :series="currentSeries"
      :options="currentOptions"
      :height="height"
      :width="width"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseApexChart from './BaseApexChart.vue';

const props = defineProps({
  title: { type: String, default: '' },
  types: { type: Array, required: true },
  initialType: { type: String, default: 'bar' },
  seriesByType: { type: Object, required: true },
  optionsByType: { type: Object, required: true },
  height: { type: [Number, String], default: 380 },
  width: { type: [Number, String], default: '100%' },
});

const currentType = ref(props.initialType);
const currentSeries = computed(() => props.seriesByType[currentType.value] || []);
const currentOptions = computed(() => props.optionsByType[currentType.value] || {});
</script>
