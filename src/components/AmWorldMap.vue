<template>
  <div class="w-full">
    <div ref="chartEl" :style="{ height: computedHeight }" class="w-full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  height: { type: [Number, String], default: 420 },
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
  palette: {
    type: Array,
    default: () => ['#FF6B6B', '#4ECDC4', '#556270', '#FFD93D', '#6A4C93', '#1A535C'],
  },
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
  tooltipColor: { type: String, default: '#344054' },
  valuePrefix: { type: String, default: 'USD ' },
  valueSuffix: { type: String, default: '' },
});

const computedHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height));
const chartEl = ref(null);
let root = null;

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h >>> 0;
}

function ensureScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}

onMounted(async () => {
  try {
    // Load amCharts 5 libs via CDN
    await ensureScript('https://cdn.amcharts.com/lib/5/index.js');
    await ensureScript('https://cdn.amcharts.com/lib/5/map.js');
    await ensureScript('https://cdn.amcharts.com/lib/5/themes/Animated.js');
    await ensureScript('https://cdn.amcharts.com/lib/5/geodata/worldLow.js');

    const am5 = window.am5;
    const am5map = window.am5map;
    const am5geodata_worldLow = window.am5geodata_worldLow;
    const am5themes_Animated = window.am5themes_Animated;

    if (!am5 || !am5map || !am5geodata_worldLow) {
      // eslint-disable-next-line no-console
      console.warn('amCharts libraries failed to load');
      return;
    }

    root = am5.Root.new(chartEl.value);
    root.setThemes([am5themes_Animated.new(root)]);
    // Hide amCharts watermark/logo
    if (root._logo) {
      root._logo.dispose();
    }

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        panY: 'rotateY',
        projection: am5map.geoMercator(),
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      })
    );

    // Style polygons and tooltip
    const template = polygonSeries.mapPolygons.template;
    template.setAll({
      tooltipText: '{name}',
      strokeOpacity: 0.1,
    });

    template.adapters.add('fill', (fill, target) => {
      const name = target.dataItem?.dataContext?.name || '';
      const colorHex = props.groupColors[name] || props.palette[hashString(name) % props.palette.length];
      return am5.color(colorHex);
    });

    template.adapters.add('tooltipText', (text, target) => {
      const name = target.dataItem?.dataContext?.name || '';
      const sales = props.salesByCountry[name] ?? 0;
      const fmt = new Intl.NumberFormat().format(sales);
      return `[font color='${props.tooltipColor}'][bold]${name}[/][/]\n[font color='${props.tooltipColor}']${props.valuePrefix}${fmt}${props.valueSuffix}[/]`;
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to initialize amCharts map', e);
  }
});

onBeforeUnmount(() => {
  if (root) {
    root.dispose();
    root = null;
  }
});
</script>
