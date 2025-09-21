<template>
  <div class="flex flex-col gap-16 p-24 items-center bg-blue-500 min-h-screen">
    <h2 class="text-4xl text-white font-semibold underline">ChartsDashboard</h2>

    <BaseApexChart
      class="w-2/3"
      title="Line Chart"
      type="line"
      :series="lineChartSeries"
      :options="lineChartOptions"
    />

    <BaseApexChart
      class="w-2/3"
      title="Bar Chart"
      type="bar"
      :series="barChartSeries"
      :options="barChartOptions"
    />

    <BaseApexChart
      class="w-2/3"
      title="Pie Chart"
      type="pie"
      :series="pieChartSeries"
      :options="pieChartOptions"
    />

    <BaseApexChart
      class="w-2/3"
      title="Area Chart"
      type="area"
      :series="areaChartSeries"
      :options="areaChartOptions"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseApexChart from '../components/BaseApexChart.vue';

const lineChartSeries = ref([
  { name: 'Sales', data: [30, 40, 35, 50, 49, 60, 70] }
]);

const lineChartOptions = ref({
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }
});

const barChartSeries = ref([
  { name: 'Revenue', data: [40, 60, 75, 50, 60, 80, 90] }
]);

const barChartOptions = ref({
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }
});

const pieChartSeries = ref([44, 55, 36]);

const pieChartOptions = ref({
  labels: ['Product A', 'Product B', 'Product C']
});

const areaChartSeries = ref([
  { name: 'Visitors A', data: [20, 30, 55, 60, 40, 75, 70] },
  { name: 'Visitors B', data: [15, 25, 20, 30, 25, 40, 50] },
  { name: 'Visitors C', data: [35, 45, 60, 40, 55, 65, 15] },
  { name: 'Visitors D', data: [10, 35, 50, 70, 75, 85, 90] }
]);

const areaChartOptions = ref({
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  stroke: { curve: 'smooth' }
});
</script>
