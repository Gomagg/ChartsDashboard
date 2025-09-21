<template>
  <div class="min-h-screen bg-gray-100 p-6 md:p-10">
    <h1 class="text-2xl md:text-3xl font-semibold text-slate-800">Charts Dashboard</h1> <!-- ApexCharts -->

    <!-- Toggleable Earnings Chart (Bar <-> Line) -->
    <section class="mt-8">
      <ToggleApexChart
        title="Earnings"
        class="w-full"
        :types="['bar','line']"
        initial-type="bar"
        :series-by-type="earningsSeriesByType"
        :options-by-type="earningsOptionsByType"
      />
    </section>

    <hr class="my-10 border-gray-200" />

    <!-- Donut: Revenue Distribution -->
    <section class="mt-6 w-full">
      <BaseApexChart
        title="Revenue Distribution"
        type="donut"
        :series="donutSeries"
        :options="donutOptions"
        :height="380"
      />
    </section>

    <hr class="my-10 border-gray-200" />

    <!-- Simple Line with Shadow: Subscriber Growth -->
    <section class="mt-6 w-full">
      <BaseApexChart
        title="Subscriber Growth"
        type="line"
        :series="subscribersSeries"
        :options="subscribersOptions"
        :height="380"
      />
    </section>

    <hr class="my-10 border-gray-200" />

    <!-- Heatmap as Global Presence alternative (ApexCharts does not support maps) -->
    <section class="mt-6 w-full">
      <BaseApexChart
        title="Global Presence (Heatmap)"
        type="heatmap"
        :series="presenceHeatmapSeries"
        :options="presenceHeatmapOptions"
        :height="420"
      />
    </section>

    <hr class="my-10 border-gray-200" />

    <!-- Country Visits: Column with colors -->
    <section class="mt-6 w-full">
      <div class="option-cotainer flex justify-end mb-2">
        <div>
          <select id="countryPeriodSelect" v-model="countryVisitsPeriod" class="border rounded px-2 py-1 text-sm">
            <option value="yearly">Year</option>
            <option value="monthly">Month</option>
            <option value="weekly">Week</option>
          </select>
        </div>
      </div>
      <BaseApexChart
        title="Country Visits"
        type="bar"
        :series="countryVisitsSeries"
        :options="countryVisitsOptions"
        :height="420"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseApexChart from '../components/BaseApexChart.vue';
import ToggleApexChart from '../components/ToggleApexChart.vue';

// Earnings (Bar / Line) data and options
const earningsCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const earningsBarSeries = ref([
  { name: 'Subscription', data: [44, 55, 41, 67, 22, 43, 21] },
  { name: 'Pay to view', data: [13, 23, 20, 8, 13, 27, 33] },
  { name: 'Merch', data: [11, 17, 15, 15, 21, 14, 15] },
  { name: 'Wishtender', data: [21, 7, 25, 13, 22, 8, 12] },
  { name: 'Custom request', data: [12, 14, 9, 11, 17, 15, 19] }
]);

const earningsLineSeries = ref([
  { name: 'Subscription', data: [30, 40, 35, 50, 49, 60, 70] },
  { name: 'Pay to view', data: [20, 29, 37, 36, 44, 45, 50] },
  { name: 'Merch', data: [28, 35, 40, 55, 57, 62, 68] },
  { name: 'Wishtender', data: [10, 15, 25, 20, 30, 35, 40] },
  { name: 'Custom request', data: [15, 20, 18, 25, 27, 30, 32] }
]);

const earningsBarOptions = ref({
  chart: { stacked: true },
  plotOptions: { bar: { columnWidth: '25%' } },
  xaxis: { categories: earningsCategories, labels: { style: { colors: '#475467' } } },
  yaxis: { labels: { style: { colors: '#475467' } } },
  tooltip: { y: { formatter: (val) => `$${val}` } },
  colors: ['#4CC9F0', '#4361EE', '#7209B7', '#F72585', '#3A0CA3'],
});

const earningsLineOptions = ref({
  stroke: { width: 4 },
  xaxis: { categories: earningsCategories, labels: { style: { colors: '#475467' } } },
  yaxis: { labels: { style: { colors: '#475467' } } },
  tooltip: { y: { formatter: (val) => `$${val}` } },
  colors: ['#4CC9F0', '#4361EE', '#7209B7', '#F72585', '#3A0CA3'],
});

const earningsSeriesByType = ref({ bar: earningsBarSeries.value, line: earningsLineSeries.value });
const earningsOptionsByType = ref({ bar: earningsBarOptions.value, line: earningsLineOptions.value });

// Donut chart: Revenue Distribution
const donutSeries = ref([44, 55, 36, 22, 18]);
const donutOptions = ref({
  labels: ['Subscription', 'Pay to view', 'Merch', 'Wishtender', 'Custom request'],
  legend: { position: 'bottom' },
  colors: ['#4CC9F0', '#4361EE', '#7209B7', '#F72585', '#3A0CA3'],
  plotOptions: { pie: { donut: { size: '40%' } } },
  dataLabels: { enabled: true },
});

// Line with shadow: Subscriber Growth
const subscribersSeries = ref([
  { name: 'sub', data: [10, 18, 25, 35, 50, 65, 72] }
]);
const subscribersOptions = ref({
  chart: { dropShadow: { enabled: true, top: 4, left: 2, blur: 6, opacity: 0.3 } },
  stroke: { width: 4 },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  colors: ['#FF6B6B'],
});

// Heatmap: Global Presence alternative
const countries = ['Sweden', 'Russia', 'China', 'Philippines', 'USA', 'India'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const presenceHeatmapSeries = ref(
  countries.map((country) => ({
    name: country,
    data: months.map((m) => ({ x: m, y: Math.floor(Math.random() * 100) }))
  }))
);
const presenceHeatmapOptions = ref({
  plotOptions: { heatmap: { shadeIntensity: 0.5, radius: 4 } },
  dataLabels: { enabled: false },
  colors: ['#008FFB'],
});

// Country Visits: Column chart
const countryVisitsPeriod = ref('yearly');
const countriesList = ['US', 'UK', 'Japan', 'Germany', 'France', 'India', 'Spain', 'Netherlands', 'Canada'];
const countryColors = ['#4CC9F0', '#4361EE', '#7209B7', '#F72585', '#3A0CA3', '#F39C12', '#2ECC71', '#E67E22', '#95A5A6'];

const countryVisitsDataByPeriod = {
  yearly: {
    categories: countriesList,
    data: [100, 90, 80, 70, 60, 50, 45, 40, 35]
  },
  monthly: {
    categories: countriesList,
    data: [72, 68, 64, 58, 55, 53, 49, 46, 42]
  },
  weekly: {
    categories: countriesList,
    data: [18, 16, 14, 13, 12, 11, 10, 9, 8]
  }
};

const countryVisitsSeries = computed(() => [
  { name: 'Visits', data: countryVisitsDataByPeriod[countryVisitsPeriod.value].data }
]);
const countryVisitsOptions = computed(() => ({
  xaxis: {
    categories: countryVisitsDataByPeriod[countryVisitsPeriod.value].categories,
    labels: { style: { colors: '#475467', fontSize: '12px' } }
  },
  yaxis: { labels: { style: { colors: '#475467', fontSize: '12px' } } },
  plotOptions: { bar: { columnWidth: '10%', distributed: true } },
  colors: countryColors,
}));
</script>
