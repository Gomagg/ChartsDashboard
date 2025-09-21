// Lightweight page harness to make your amCharts demo reusable and toggle-enabled
(function () {
  const ready = (fn) => (document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn));

  function parseConfig(el) {
    const json = el.getAttribute('data-chart-config');
    if (!json) return {};
    try { return JSON.parse(json); } catch (e) { console.warn('Invalid data-chart-config JSON', e); return {}; }
  }

  function toggleEarningsView() {
    const select = document.getElementById('earningsViewSelect');
    const bar = document.getElementById('earnings-bar');
    const line = document.getElementById('earnings-line');
    if (!select || !bar || !line) return;

    const setView = (value) => {
      if (value === 'bar') {
        bar.removeAttribute('hidden');
        line.setAttribute('hidden', '');
      } else {
        line.removeAttribute('hidden');
        bar.setAttribute('hidden', '');
      }
      // Optionally trigger chart resize if amCharts instance attached
      [bar, line].forEach((c) => {
        const root = c._am5Root; // see attachAm5Root
        if (root) root.resize();
      });
    };

    select.addEventListener('change', (e) => setView(e.target.value));
    setView(select.value);
  }

  // Simple factory to init charts based on type. Replace with your real implementations.
  function bootstrapCharts() {
    const containers = Array.from(document.querySelectorAll('.chart-container'));
    containers.forEach((container) => {
      const cfg = parseConfig(container);
      const roleDiv = container.querySelector('[data-role="chart"]');
      if (!roleDiv) return;

      // Create amCharts root per container
      const root = am5.Root.new(roleDiv);
      container._am5Root = root; // attach for later resize/disposal
      root.setThemes([am5themes_Animated.new(root)]);

      // Dispatch by type (minimal demo renderers)
      switch (cfg.type) {
        case 'bar':
        case 'line': {
          const chart = am5xy.XYChart.new(root, { panX: false, panY: false, wheelX: 'none', wheelY: 'none' });
          root.container.children.push(chart);

          const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: 'category',
            renderer: am5xy.AxisRendererX.new(root, {})
          }));
          const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));

          const data = [
            { category: 'Jan', value: 30 },
            { category: 'Feb', value: 50 },
            { category: 'Mar', value: 40 },
            { category: 'Apr', value: 65 },
            { category: 'May', value: 55 },
            { category: 'Jun', value: 70 }
          ];
          xAxis.data.setAll(data);

          const series = chart.series.push((cfg.type === 'bar')
            ? am5xy.ColumnSeries.new(root, { name: 'Series', xAxis, yAxis, valueYField: 'value', categoryXField: 'category' })
            : am5xy.LineSeries.new(root, { name: 'Series', xAxis, yAxis, valueYField: 'value', categoryXField: 'category', strokeWidth: (cfg?.line?.strokeWidth || 2) })
          );
          series.data.setAll(data);
          break;
        }
        case 'donut': {
          const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(50) }));
          const series = chart.series.push(am5percent.PieSeries.new(root, { valueField: 'value', categoryField: 'category' }));
          series.data.setAll([
            { category: 'Subscription', value: 44 },
            { category: 'Pay to view', value: 55 },
            { category: 'Merch', value: 36 },
            { category: 'Wishtender', value: 22 },
            { category: 'Custom request', value: 18 }
          ]);
          break;
        }
        case 'line-shadow': {
          const chart = am5xy.XYChart.new(root, { panX: false, panY: false });
          root.container.children.push(chart);
          const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: 'category', renderer: am5xy.AxisRendererX.new(root, {}) }));
          const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
          const data = [
            { category: 'Jan', value: 10 },
            { category: 'Feb', value: 18 },
            { category: 'Mar', value: 25 },
            { category: 'Apr', value: 35 },
            { category: 'May', value: 50 },
            { category: 'Jun', value: 65 }
          ];
          xAxis.data.setAll(data);
          const series = chart.series.push(am5xy.LineSeries.new(root, { xAxis, yAxis, valueYField: 'value', categoryXField: 'category', strokeWidth: (cfg?.line?.strokeWidth || 4) }));
          series.data.setAll(data);
          break;
        }
        case 'map': {
          const chart = root.container.children.push(am5map.MapChart.new(root, { panX: 'rotateX', panY: 'rotateY', projection: am5map.geoMercator() }));
          const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, { geoJSON: am5geodata_worldLow }));
          polygonSeries.mapPolygons.template.setAll({ tooltipText: '{name}' });
          break;
        }
        case 'column-with-icons': {
          const chart = root.container.children.push(am5xy.XYChart.new(root, {}));
          const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: 'country', renderer: am5xy.AxisRendererX.new(root, {}) }));
          const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
          const data = [
            { country: 'US', value: 100 }, { country: 'UK', value: 90 }, { country: 'Japan', value: 80 },
            { country: 'Germany', value: 70 }, { country: 'France', value: 60 }, { country: 'India', value: 50 },
            { country: 'Spain', value: 45 }, { country: 'Netherlands', value: 40 }, { country: 'Canada', value: 35 }
          ];
          xAxis.data.setAll(data);
          const series = chart.series.push(am5xy.ColumnSeries.new(root, { xAxis, yAxis, valueYField: 'value', categoryXField: 'country' }));
          series.data.setAll(data);
          break;
        }
        default:
          console.warn('Unknown chart type', cfg.type);
      }
    });
  }

  ready(() => {
    // Initial hidden state: bar visible, line hidden
    toggleEarningsView();
    bootstrapCharts();
  });
})();
