<template>
  <div :style="{ height: computedHeight }" class="w-full">
    <AgCharts v-if="options" :options="options" class="w-full h-full" />
    <div v-else-if="loadingError" class="h-full flex items-center justify-center text-red-600 text-sm">
      Failed to load map data. Please try refreshing.
    </div>
    <div v-else class="h-full flex items-center justify-center text-slate-500 text-sm">Loading map…</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { AgCharts } from 'ag-charts-vue3';
import 'ag-charts-enterprise'; // enable enterprise features (map-shape)

const props = defineProps({
  height: { type: [Number, String], default: 420 },
  // Allow overriding the topology source (useful for offline/public assets)
  topoUrl: { type: String, default: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json' },
  // Fixed highlight colors per country
  groupColors: {
    type: Object,
    default: () => ({
      Sweden: '#FF6B6B',
      Russia: '#4ECDC4',
      China: '#556270',
      Philippines: '#FFD93D',
      'United States of America': '#6A4C93',
      India: '#1A535C',
    }),
  },
  // Palette fallback for countries not in groupColors
  palette: {
    type: Array,
    default: () => ['#FF6B6B', '#4ECDC4', '#556270', '#FFD93D', '#6A4C93', '#1A535C'],
  },
  // Sales data used in tooltip (USD)
  salesByCountry: {
    type: Object,
    default: () => ({
      Sweden: 125000,
      Russia: 98000,
      China: 210000,
      Philippines: 45000,
      'United States of America': 275000,
      India: 155000,
    }),
  },
});

// Mapping IDs (ISO 3166 numeric) to names for world-atlas TopoJSON
const idToName = {
  '752': 'Sweden',
  '643': 'Russia',
  '156': 'China',
  '608': 'Philippines',
  '840': 'United States of America',
  '356': 'India',
};
function resolveCountryName(datum) {
  const props = datum?.properties || {};
  const byProp = props.name || props.NAME || '';
  if (byProp) return byProp;
  const id = String(datum?.id ?? props.iso_n3 ?? '');
  return idToName[id] || id;
}

// Optional: set enterprise license key here if you have one
// import { AgCharts } from 'ag-charts-enterprise';
// AgCharts.setLicenseKey('YOUR_KEY');

const computedHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height));

const topology = ref(null);
const loadingError = ref(null);

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

onMounted(async () => {
  try {
    const res = await fetch(props.topoUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    topology.value = await res.json();
    // eslint-disable-next-line no-console
    console.log('[AgWorldMap] TopoJSON loaded:', props.topoUrl);
  } catch (e) {
    loadingError.value = e?.message || 'Network error';
    // eslint-disable-next-line no-console
    console.warn('[AgWorldMap] Failed to load topology', props.topoUrl, e);
  }
});

const options = computed(() => {
  if (!topology.value) return null;

  const objectName = (() => {
    const objs = topology.value?.objects || {};
    if ('countries' in objs) return 'countries';
    const keys = Object.keys(objs);
    return keys.length ? keys[0] : undefined;
  })();
  if (!objectName) {
    // eslint-disable-next-line no-console
    console.warn('[AgWorldMap] No topology object found in loaded TopoJSON');
  }

  return {
    autoSize: true,
    background: { fill: 'transparent' },
    animation: { enabled: false },
    series: [
      {
        type: 'map-shape',
        topology: topology.value,
        topologyObject: objectName,
        projection: 'equalEarth',
        stroke: 'rgba(0,0,0,0.08)',
        strokeWidth: 0.5,
        highlightStyle: { item: { fillOpacity: 0.9 } },
        itemStyler: ({ datum }) => {
          const name = resolveCountryName(datum);
          const fill = props.groupColors[name] || props.palette[Math.abs(hashString(String(name))) % props.palette.length];
          return { fill };
        },
        animation: { enabled: false },
        tooltip: {
          enabled: true,
          renderer: ({ datum }) => {
            const id = String(datum?.id ?? datum?.properties?.iso_n3 ?? '');
            const name = resolveCountryName(datum);
            const color = props.groupColors[name] || '#344054';
            const sales = (props.salesByCountry[id] ?? props.salesByCountry[name] ?? 0);
            const formatted = new Intl.NumberFormat().format(sales);
            return {
              content: `<div style="color:${color}"><strong>${name}</strong><br/>USD ${formatted}</div>`,
            };
          },
        },
      },
    ],
    legend: { enabled: false },
  };
});
</script>
