/* ============================================================
   ANALYTICS.JS — Dynamic Operational Chart Systems & Metrics Rendering
   ============================================================ */
(function initAnalytics() {
  'use strict';

  // Check if Chart.js is imported
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js library not detected. Skipping charts setup.');
    return;
  }

  // DOM Elements
  const rangeBtns = document.querySelectorAll('.analytics-range-selector .range-btn');
  const statVisits = document.getElementById('statVisits');
  const statRequests = document.getElementById('statRequests');
  const statHours = document.getElementById('statHours');
  const statSuccess = document.getElementById('statSuccess');

  const distLegendContainer = document.getElementById('distributionLegend');

  // Chart References
  let trafficChartInstance = null;
  let workloadChartInstance = null;
  let distributionChartInstance = null;

  // Datasets for different time ranges
  const datasets = {
    '7d': {
      stats: { visits: '24,580', requests: '142,390', hours: '4,820 hrs', success: '99.94%' },
      traffic: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        pageviews: [3100, 3600, 3900, 4200, 3800, 2900, 3080],
        visitors: [1900, 2400, 2700, 2900, 2500, 1700, 1820]
      },
      workload: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [18200, 21400, 20100, 22600, 19800, 17900, 22390]
      },
      distribution: [
        { label: 'Web Dev & CMS', val: 1200, color: '#0066FF', hours: 1920 },
        { label: 'Mobile Engineering', val: 680, color: '#7C3AED', hours: 1360 },
        { label: 'Autonomous AI Agents', val: 940, color: '#10B981', hours: 940 },
        { label: 'Business Automation', val: 410, color: '#F59E0B', hours: 600 }
      ]
    },
    '30d': {
      stats: { visits: '98,420', requests: '592,800', hours: '19,250 hrs', success: '99.91%' },
      traffic: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        pageviews: [21000, 26000, 24500, 26920],
        visitors: [14200, 18500, 17200, 19120]
      },
      workload: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        values: [134000, 152000, 149000, 157800]
      },
      distribution: [
        { label: 'Web Dev & CMS', val: 4800, color: '#0066FF', hours: 7680 },
        { label: 'Mobile Engineering', val: 2700, color: '#7C3AED', hours: 5400 },
        { label: 'Autonomous AI Agents', val: 3900, color: '#10B981', hours: 3900 },
        { label: 'Business Automation', val: 1650, color: '#F59E0B', hours: 2270 }
      ]
    },
    '12m': {
      stats: { visits: '1,120,400', requests: '6,840,500', hours: '235,900 hrs', success: '99.88%' },
      traffic: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pageviews: [78000, 84000, 92000, 89000, 95000, 99000, 102000, 94000, 98000, 105000, 114000, 119400],
        visitors: [52000, 57000, 64000, 61000, 66000, 69000, 71000, 65000, 67000, 72000, 78000, 82400]
      },
      workload: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [480000, 520000, 570000, 540000, 590000, 610000, 630000, 580000, 600000, 640000, 680000, 710500]
      },
      distribution: [
        { label: 'Web Dev & CMS', val: 56000, color: '#0066FF', hours: 89600 },
        { label: 'Mobile Engineering', val: 32000, color: '#7C3AED', hours: 64000 },
        { label: 'Autonomous AI Agents', val: 44000, color: '#10B981', hours: 44000 },
        { label: 'Business Automation', val: 18000, color: '#F59E0B', hours: 38300 }
      ]
    }
  };

  // --- STATS ANIMATION CONTROLLER ---
  function updateTextStats(range) {
    const data = datasets[range].stats;
    
    // Quick fade helper
    const animateEl = (el, text) => {
      if (!el) return;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(el, { opacity: 0.3, y: 5 }, { opacity: 1, y: 0, duration: 0.3, textContent: text });
      } else {
        el.textContent = text;
      }
    };

    animateEl(statVisits, data.visits);
    animateEl(statRequests, data.requests);
    animateEl(statHours, data.hours);
    animateEl(statSuccess, data.success);
  }

  // --- TRAFFIC LINE CHART ---
  function initTrafficChart(range) {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    const data = datasets[range].traffic;

    // Gradient fills
    const pGlow = ctx.createLinearGradient(0, 0, 0, 240);
    pGlow.addColorStop(0, 'rgba(0, 102, 255, 0.15)');
    pGlow.addColorStop(1, 'rgba(0, 102, 255, 0.0)');

    const vGlow = ctx.createLinearGradient(0, 0, 0, 240);
    vGlow.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
    vGlow.addColorStop(1, 'rgba(124, 58, 237, 0.0)');

    const chartConfig = {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Pageviews',
            data: data.pageviews,
            borderColor: '#0066FF',
            backgroundColor: pGlow,
            fill: true,
            tension: 0.45,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#0066FF',
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5
          },
          {
            label: 'Unique Visitors',
            data: data.visitors,
            borderColor: '#7C3AED',
            backgroundColor: vGlow,
            fill: true,
            tension: 0.45,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#7C3AED',
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.6)',
              font: { family: 'Inter', size: 11 }
            }
          },
          tooltip: {
            padding: 10,
            cornerRadius: 12,
            backgroundColor: 'rgba(22, 22, 30, 0.95)',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.85)',
            titleFont: { family: 'Outfit', size: 13, weight: '700' },
            bodyFont: { family: 'Inter', size: 12 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
          }
        }
      }
    };

    if (trafficChartInstance) {
      trafficChartInstance.destroy();
    }
    trafficChartInstance = new Chart(ctx, chartConfig);
  }

  // --- WORKLOAD BAR CHART ---
  function initWorkloadChart(range) {
    const ctx = document.getElementById('workloadChart').getContext('2d');
    const data = datasets[range].workload;

    const chartConfig = {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'AI API Queries',
          data: data.values,
          backgroundColor: '#10B981',
          hoverBackgroundColor: '#059669',
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 10,
            cornerRadius: 12,
            backgroundColor: 'rgba(22, 22, 30, 0.95)',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.85)',
            titleFont: { family: 'Outfit', size: 13, weight: '700' },
            bodyFont: { family: 'Inter', size: 12 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
          }
        }
      }
    };

    if (workloadChartInstance) {
      workloadChartInstance.destroy();
    }
    workloadChartInstance = new Chart(ctx, chartConfig);
  }

  // --- DISTRIBUTION DOUGHNUT CHART ---
  function initDistributionChart(range) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    const data = datasets[range].distribution;

    const chartConfig = {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.label),
        datasets: [{
          data: data.map(item => item.val),
          backgroundColor: data.map(item => item.color),
          borderWidth: 3,
          borderColor: 'rgba(22, 22, 30, 0.95)',
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 10,
            cornerRadius: 12,
            backgroundColor: 'rgba(22, 22, 30, 0.95)',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.85)',
            titleFont: { family: 'Outfit', size: 13, weight: '700' },
            bodyFont: { family: 'Inter', size: 12 }
          }
        }
      }
    };

    if (distributionChartInstance) {
      distributionChartInstance.destroy();
    }
    distributionChartInstance = new Chart(ctx, chartConfig);

    // Build Custom Legend UI list
    buildLegendUI(data);
  }

  function buildLegendUI(list) {
    if (!distLegendContainer) return;

    const total = list.reduce((sum, item) => sum + item.val, 0);

    distLegendContainer.innerHTML = list.map(item => {
      const percentage = ((item.val / total) * 100).toFixed(1);
      return `
        <div class="legend-item">
          <div class="legend-color-label">
            <span class="legend-dot" style="background-color: ${item.color};"></span>
            <span>${item.label}</span>
          </div>
          <div class="legend-val">
            <strong>${item.val.toLocaleString()} transactions</strong> 
            <span class="legend-percentage">(${percentage}%)</span>
            <div style="font-size:0.75rem; color:var(--clr-text-3); margin-top:0.1rem;">⏱️ Saved: ${item.hours.toLocaleString()} hrs</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- CONTROLLER INITIATION ---
  function updateDashboard(range) {
    updateTextStats(range);
    initTrafficChart(range);
    initWorkloadChart(range);
    initDistributionChart(range);
  }

  // Event Listeners for Range selector clicks
  rangeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rangeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetRange = btn.getAttribute('data-range');
      updateDashboard(targetRange);
    });
  });

  // Start with default 7d range
  updateDashboard('7d');

})();
