/**
 * SalesPulse - Vanilla JS Sales Analytics Dashboard
 * Persistent WebStorage (localStorage) Integration
 * Real-time KPI computations, Chart.js Visualizations, CRUD Operations, and Data Filtering
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'salespulse_records_v1';

  // State Management
  let salesData = [];
  let currentSort = { field: 'date', order: 'desc' };
  let currentPage = 1;
  let rowsPerPage = 25;
  let chartInstances = {};

  // Sample Seed Dataset (Realistic enterprise/B2B & SaaS transactions)
  const SEED_DATA = [
    { id: 'ORD-8401', date: '2026-11-05', customer: 'Nexus Cloud Corp', category: 'Cloud Infrastructure', product: 'Dedicated VPC Cluster', quantity: 2, unitPrice: 2400, cost: 750, amount: 4800, status: 'Completed', region: 'North America', payment: 'Bank Wire' },
    { id: 'ORD-8402', date: '2026-11-04', customer: 'Aura Digital Media', category: 'Enterprise Software', product: 'SalesPulse Enterprise AI', quantity: 10, unitPrice: 350, cost: 60, amount: 3500, status: 'Completed', region: 'Europe', payment: 'Credit Card' },
    { id: 'ORD-8403', date: '2026-11-03', customer: 'Apex FinTech Global', category: 'Security Solutions', product: 'Identity Zero-Trust Guard', quantity: 1, unitPrice: 5200, cost: 1200, amount: 5200, status: 'Completed', region: 'Asia Pacific', payment: 'Bank Wire' },
    { id: 'ORD-8404', date: '2026-11-02', customer: 'Solstice Retail Systems', category: 'Hardware & Devices', product: 'Edge POS Terminal Suite', quantity: 6, unitPrice: 780, cost: 420, amount: 4680, status: 'Pending', region: 'North America', payment: 'Purchase Order' },
    { id: 'ORD-8405', date: '2026-10-31', customer: 'Horizon Health Logistics', category: 'Consulting & Support', product: '24/7 Premium SLA Contract', quantity: 1, unitPrice: 3000, cost: 800, amount: 3000, status: 'Completed', region: 'Europe', payment: 'Credit Card' },
    { id: 'ORD-8406', date: '2026-10-29', customer: 'Vanguard Biopharma', category: 'Enterprise Software', product: 'Compliance Analytics Suite', quantity: 4, unitPrice: 1250, cost: 200, amount: 5000, status: 'Completed', region: 'North America', payment: 'Bank Wire' },
    { id: 'ORD-8407', date: '2026-10-27', customer: 'Krypton Labs GmbH', category: 'Cloud Infrastructure', product: 'High-Throughput Storage', quantity: 8, unitPrice: 420, cost: 110, amount: 3360, status: 'Completed', region: 'Europe', payment: 'Stripe' },
    { id: 'ORD-8408', date: '2026-10-25', customer: 'Pacific Rim Robotics', category: 'Hardware & Devices', product: 'Industrial IoT Gateway', quantity: 15, unitPrice: 320, cost: 180, amount: 4800, status: 'Refunded', region: 'Asia Pacific', payment: 'PayPal' },
    { id: 'ORD-8409', date: '2026-10-22', customer: 'Terra Verde AgroTech', category: 'Consulting & Support', product: 'Architecture Migration Sprint', quantity: 2, unitPrice: 1800, cost: 500, amount: 3600, status: 'Completed', region: 'Latin America', payment: 'Credit Card' },
    { id: 'ORD-8410', date: '2026-10-20', customer: 'Boreal Data Systems', category: 'Security Solutions', product: 'Cloud WAF & DDoS Shield', quantity: 3, unitPrice: 1100, cost: 260, amount: 3300, status: 'Completed', region: 'North America', payment: 'Credit Card' },
    { id: 'ORD-8411', date: '2026-10-18', customer: 'Crestline Mobility', category: 'Cloud Infrastructure', product: 'Kubernetes Engine Managed', quantity: 4, unitPrice: 1450, cost: 480, amount: 5800, status: 'Completed', region: 'North America', payment: 'Stripe' },
    { id: 'ORD-8412', date: '2026-10-15', customer: 'Dune Logistics Emirates', category: 'Enterprise Software', product: 'ERP Connector Pro', quantity: 5, unitPrice: 950, cost: 150, amount: 4750, status: 'Completed', region: 'Middle East', payment: 'Bank Wire' },
    { id: 'ORD-8413', date: '2026-10-12', customer: 'Starlight E-Commerce', category: 'Enterprise Software', product: 'Customer Journey Orchestrator', quantity: 3, unitPrice: 850, cost: 120, amount: 2550, status: 'Pending', region: 'Europe', payment: 'Credit Card' },
    { id: 'ORD-8414', date: '2026-10-09', customer: 'Alpine Nordic Analytics', category: 'Security Solutions', product: 'Identity Zero-Trust Guard', quantity: 2, unitPrice: 5200, cost: 1200, amount: 10400, status: 'Completed', region: 'Europe', payment: 'Bank Wire' },
    { id: 'ORD-8415', date: '2026-10-05', customer: 'Valiant Media Network', category: 'Cloud Infrastructure', product: 'Multi-Region CDN Edge', quantity: 12, unitPrice: 280, cost: 70, amount: 3360, status: 'Completed', region: 'North America', payment: 'Credit Card' },
    { id: 'ORD-8416', date: '2026-09-30', customer: 'Rio Grande Ventures', category: 'Hardware & Devices', product: 'Edge POS Terminal Suite', quantity: 5, unitPrice: 780, cost: 420, amount: 3900, status: 'Completed', region: 'Latin America', payment: 'Stripe' },
    { id: 'ORD-8417', date: '2026-09-28', customer: 'Tokyo Quantum Systems', category: 'Enterprise Software', product: 'SalesPulse Enterprise AI', quantity: 15, unitPrice: 350, cost: 60, amount: 5250, status: 'Completed', region: 'Asia Pacific', payment: 'Bank Wire' },
    { id: 'ORD-8418', date: '2026-09-24', customer: 'Cascade BioInformatics', category: 'Cloud Infrastructure', product: 'Dedicated VPC Cluster', quantity: 3, unitPrice: 2400, cost: 750, amount: 7200, status: 'Completed', region: 'North America', payment: 'Purchase Order' },
    { id: 'ORD-8419', date: '2026-09-20', customer: 'Helios Solar Energy', category: 'Consulting & Support', product: '24/7 Premium SLA Contract', quantity: 1, unitPrice: 3000, cost: 800, amount: 3000, status: 'Refunded', region: 'Europe', payment: 'Credit Card' },
    { id: 'ORD-8420', date: '2026-09-17', customer: 'Dubai Smart Transit', category: 'Security Solutions', product: 'Cloud WAF & DDoS Shield', quantity: 5, unitPrice: 1100, cost: 260, amount: 5500, status: 'Completed', region: 'Middle East', payment: 'Bank Wire' },
    { id: 'ORD-8421', date: '2026-09-12', customer: 'Quantum Financial', category: 'Enterprise Software', product: 'Compliance Analytics Suite', quantity: 8, unitPrice: 1250, cost: 200, amount: 10000, status: 'Completed', region: 'North America', payment: 'Bank Wire' },
    { id: 'ORD-8422', date: '2026-09-08', customer: 'Seoul Mobile Interactive', category: 'Hardware & Devices', product: 'Industrial IoT Gateway', quantity: 20, unitPrice: 320, cost: 180, amount: 6400, status: 'Completed', region: 'Asia Pacific', payment: 'Credit Card' },
    { id: 'ORD-8423', date: '2026-09-03', customer: 'Nordic Clean Power', category: 'Cloud Infrastructure', product: 'Kubernetes Engine Managed', quantity: 2, unitPrice: 1450, cost: 480, amount: 2900, status: 'Completed', region: 'Europe', payment: 'Stripe' },
    { id: 'ORD-8424', date: '2026-08-28', customer: 'Savannah Agribusiness', category: 'Consulting & Support', product: 'Architecture Migration Sprint', quantity: 1, unitPrice: 1800, cost: 500, amount: 1800, status: 'Completed', region: 'Middle East', payment: 'PayPal' },
    { id: 'ORD-8425', date: '2026-08-23', customer: 'Atlas Maritime Supply', category: 'Enterprise Software', product: 'ERP Connector Pro', quantity: 4, unitPrice: 950, cost: 150, amount: 3800, status: 'Pending', region: 'Europe', payment: 'Purchase Order' },
    { id: 'ORD-8426', date: '2026-08-18', customer: 'CyberGuardian Corp', category: 'Security Solutions', product: 'Identity Zero-Trust Guard', quantity: 3, unitPrice: 5200, cost: 1200, amount: 15600, status: 'Completed', region: 'North America', payment: 'Bank Wire' },
    { id: 'ORD-8427', date: '2026-08-14', customer: 'Pacific Health Solutions', category: 'Cloud Infrastructure', product: 'High-Throughput Storage', quantity: 10, unitPrice: 420, cost: 110, amount: 4200, status: 'Completed', region: 'Asia Pacific', payment: 'Credit Card' },
    { id: 'ORD-8428', date: '2026-08-09', customer: 'Andes Telecommunications', category: 'Hardware & Devices', product: 'Edge POS Terminal Suite', quantity: 8, unitPrice: 780, cost: 420, amount: 6240, status: 'Completed', region: 'Latin America', payment: 'Bank Wire' },
    { id: 'ORD-8429', date: '2026-08-04', customer: 'Metropolis Bank & Trust', category: 'Enterprise Software', product: 'SalesPulse Enterprise AI', quantity: 25, unitPrice: 350, cost: 60, amount: 8750, status: 'Completed', region: 'North America', payment: 'Bank Wire' },
    { id: 'ORD-8430', date: '2026-07-29', customer: 'Zenith Space Dynamics', category: 'Security Solutions', product: 'Cloud WAF & DDoS Shield', quantity: 6, unitPrice: 1100, cost: 260, amount: 6600, status: 'Completed', region: 'North America', payment: 'Purchase Order' },
    { id: 'ORD-8431', date: '2026-07-21', customer: 'Kyoto Robotics Inc', category: 'Hardware & Devices', product: 'Industrial IoT Gateway', quantity: 12, unitPrice: 320, cost: 180, amount: 3840, status: 'Completed', region: 'Asia Pacific', payment: 'Stripe' },
    { id: 'ORD-8432', date: '2026-07-15', customer: 'Berlin Autonomous Drive', category: 'Cloud Infrastructure', product: 'Dedicated VPC Cluster', quantity: 4, unitPrice: 2400, cost: 750, amount: 9600, status: 'Completed', region: 'Europe', payment: 'Bank Wire' },
    { id: 'ORD-8433', date: '2026-07-08', customer: 'Santiago Digital Mining', category: 'Consulting & Support', product: '24/7 Premium SLA Contract', quantity: 2, unitPrice: 3000, cost: 800, amount: 6000, status: 'Completed', region: 'Latin America', payment: 'Credit Card' },
    { id: 'ORD-8434', date: '2026-07-02', customer: 'Silverstone Motorsport Tech', category: 'Enterprise Software', product: 'Compliance Analytics Suite', quantity: 3, unitPrice: 1250, cost: 200, amount: 3750, status: 'Completed', region: 'Europe', payment: 'Credit Card' }
  ];

  // Formatting Helpers
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  const formatCurrencyWithCents = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // WebStorage Persistence
  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          salesData = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse data from localStorage, falling back to seed data:', e);
    }
    // Seed initial data
    salesData = JSON.parse(JSON.stringify(SEED_DATA));
    saveData(false);
  }

  function saveData(notify = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(salesData));
      if (notify) {
        showToast('Changes synchronized with browser storage', 'success');
      }
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      showToast('Error saving data to local storage', 'error');
    }
  }

  // Filter Pipeline
  function getFilteredData() {
    const timeframe = document.getElementById('filter-timeframe').value;
    const category = document.getElementById('filter-category').value;
    const region = document.getElementById('filter-region').value;
    const status = document.getElementById('filter-status').value;
    const search = document.getElementById('filter-search').value.trim().toLowerCase();

    const now = new Date('2026-11-06T12:00:00Z');

    return salesData.filter(item => {
      // Timeframe Filter
      if (timeframe !== 'all') {
        const itemDate = new Date(item.date + 'T00:00:00Z');
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);

        if (timeframe === 'last30' && (diffDays < 0 || diffDays > 30)) return false;
        if (timeframe === 'last90' && (diffDays < 0 || diffDays > 90)) return false;
        if (timeframe === 'thisYear' && itemDate.getUTCFullYear() !== 2026) return false;
      }

      // Category Filter
      if (category !== 'all' && item.category !== category) return false;

      // Region Filter
      if (region !== 'all' && item.region !== region) return false;

      // Status Filter
      if (status !== 'all' && item.status !== status) return false;

      // Search Query
      if (search) {
        const searchTarget = `${item.id} ${item.customer} ${item.product} ${item.category} ${item.region}`.toLowerCase();
        if (!searchTarget.includes(search)) return false;
      }

      return true;
    });
  }

  // Metric Computations
  function updateKPIs(filtered) {
    let totalRevenue = 0;
    let completedOrders = 0;
    let totalCost = 0;
    const categoryRevenueMap = {};

    filtered.forEach(item => {
      const isCompleted = item.status === 'Completed';
      const isPending = item.status === 'Pending';
      const isRefunded = item.status === 'Refunded';

      if (isCompleted || isPending) {
        // Total Gross/Net Revenue (refunds excluded)
        totalRevenue += Number(item.amount);
        completedOrders += 1;
        totalCost += Number(item.cost || 0) * Number(item.quantity || 1);

        categoryRevenueMap[item.category] = (categoryRevenueMap[item.category] || 0) + Number(item.amount);
      } else if (isRefunded) {
        // Track refunds
      }
    });

    const profit = Math.max(0, totalRevenue - totalCost);
    const aov = completedOrders > 0 ? totalRevenue / completedOrders : 0;
    const marginRate = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    // Top Category
    let topCatName = 'N/A';
    let topCatRev = 0;
    for (const [cat, rev] of Object.entries(categoryRevenueMap)) {
      if (rev > topCatRev) {
        topCatRev = rev;
        topCatName = cat;
      }
    }

    // Render to DOM
    document.getElementById('kpi-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('kpi-orders').textContent = formatNumber(filtered.length);
    document.getElementById('kpi-orders-count').textContent = `${completedOrders} active / ${filtered.length} total`;
    document.getElementById('kpi-aov').textContent = formatCurrency(aov);
    document.getElementById('kpi-profit').textContent = formatCurrency(profit);
    document.getElementById('kpi-margin-rate').textContent = `${marginRate.toFixed(1)}% margin`;
    document.getElementById('kpi-top-category').textContent = topCatName;
    document.getElementById('kpi-top-category-rev').textContent = topCatRev > 0 ? `${formatCurrency(topCatRev)} generated` : 'No revenue recorded';

    // Summary below table
    document.getElementById('table-filtered-sum').textContent = formatCurrencyWithCents(totalRevenue);
  }

  // Charts Creation and Refresh
  function updateCharts(filtered) {
    if (typeof Chart === 'undefined') {
      document.querySelectorAll('.chart-wrapper').forEach(wrapper => {
        if (!wrapper.querySelector('.chart-offline-notice')) {
          const notice = document.createElement('div');
          notice.className = 'chart-offline-notice';
          notice.style.position = 'absolute';
          notice.style.top = '0';
          notice.style.left = '0';
          notice.style.right = '0';
          notice.style.bottom = '0';
          notice.style.display = 'flex';
          notice.style.flexDirection = 'column';
          notice.style.alignItems = 'center';
          notice.style.justifyContent = 'center';
          notice.style.backgroundColor = 'rgba(19, 27, 46, 0.95)';
          notice.style.borderRadius = '8px';
          notice.style.color = '#94a3b8';
          notice.style.fontSize = '12px';
          notice.style.textAlign = 'center';
          notice.style.padding = '16px';
          notice.innerHTML = '<span style="color: #60a5fa; font-weight: 600; margin-bottom: 4px;">Chart Library Loading...</span><span>Connect to the internet or reload to render interactive charts. Data table & KPIs remain fully active.</span>';
          wrapper.appendChild(notice);
        }
      });
      return;
    } else {
      document.querySelectorAll('.chart-offline-notice').forEach(n => n.remove());
    }

    renderRevenueTrendChart(filtered);
    renderCategoryChart(filtered);
    renderRegionChart(filtered);
    renderPaymentChart(filtered);
    renderTargetChart(filtered);
  }

  // Chart 1: Revenue & Profit Trend
  function renderRevenueTrendChart(filtered) {
    const ctx = document.getElementById('chart-revenue-trend');
    if (!ctx) return;

    // Aggregate by Month (Jul - Nov 2026)
    const monthLabels = ['Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026'];
    const monthKeys = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
    const revenueByMonth = { '2026-07': 0, '2026-08': 0, '2026-09': 0, '2026-10': 0, '2026-11': 0 };
    const profitByMonth = { '2026-07': 0, '2026-08': 0, '2026-09': 0, '2026-10': 0, '2026-11': 0 };

    filtered.forEach(item => {
      if (item.status !== 'Refunded') {
        const ym = item.date.substring(0, 7);
        if (revenueByMonth[ym] !== undefined) {
          const rev = Number(item.amount);
          const c = Number(item.cost || 0) * Number(item.quantity || 1);
          revenueByMonth[ym] += rev;
          profitByMonth[ym] += (rev - c);
        }
      }
    });

    const revenueData = monthKeys.map(k => revenueByMonth[k]);
    const profitData = monthKeys.map(k => profitByMonth[k]);

    if (chartInstances.revenueTrend) {
      chartInstances.revenueTrend.destroy();
    }

    chartInstances.revenueTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Net Revenue',
            data: revenueData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Gross Profit',
            data: profitData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#25334e',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            padding: 10,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${formatCurrency(context.raw)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { family: 'inherit', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'inherit', size: 11 },
              callback: (val) => '$' + (val / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  // Chart 2: Category Breakdown
  function renderCategoryChart(filtered) {
    const ctx = document.getElementById('chart-category');
    if (!ctx) return;

    const catMap = {};
    filtered.forEach(item => {
      if (item.status !== 'Refunded') {
        catMap[item.category] = (catMap[item.category] || 0) + Number(item.amount);
      }
    });

    const labels = Object.keys(catMap);
    const data = Object.values(catMap);
    const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'];

    if (chartInstances.category) {
      chartInstances.category.destroy();
    }

    chartInstances.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [{
          data: data.length ? data : [1],
          backgroundColor: data.length ? palette.slice(0, labels.length) : ['#25334d'],
          borderColor: '#131b2e',
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              boxWidth: 12,
              padding: 12,
              font: { family: 'inherit', size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#25334e',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.raw)}`
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  // Chart 3: Regional Performance
  function renderRegionChart(filtered) {
    const ctx = document.getElementById('chart-region');
    if (!ctx) return;

    const regionMap = {
      'North America': 0,
      'Europe': 0,
      'Asia Pacific': 0,
      'Latin America': 0,
      'Middle East': 0
    };

    filtered.forEach(item => {
      if (item.status !== 'Refunded') {
        if (regionMap[item.region] !== undefined) {
          regionMap[item.region] += Number(item.amount);
        } else {
          regionMap[item.region] = Number(item.amount);
        }
      }
    });

    const labels = Object.keys(regionMap);
    const data = Object.values(regionMap);

    if (chartInstances.region) {
      chartInstances.region.destroy();
    }

    chartInstances.region = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Regional Sales',
          data: data,
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          hoverBackgroundColor: '#60a5fa'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#25334e',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` Sales: ${formatCurrency(ctx.raw)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: 'inherit', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'inherit', size: 10 },
              callback: (val) => '$' + (val / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  // Chart 4: Payment Methods
  function renderPaymentChart(filtered) {
    const ctx = document.getElementById('chart-payment');
    if (!ctx) return;

    const payMap = {};
    filtered.forEach(item => {
      payMap[item.payment] = (payMap[item.payment] || 0) + 1;
    });

    const labels = Object.keys(payMap);
    const data = Object.values(payMap);
    const colors = ['#06b6d4', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

    if (chartInstances.payment) {
      chartInstances.payment.destroy();
    }

    chartInstances.payment = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels.length ? labels : ['None'],
        datasets: [{
          data: data.length ? data : [1],
          backgroundColor: data.length ? colors.slice(0, labels.length) : ['#25334d'],
          borderColor: '#131b2e',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              boxWidth: 10,
              padding: 10,
              font: { family: 'inherit', size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#25334e',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} transactions`
            }
          }
        }
      }
    });
  }

  // Chart 5: Target vs Actual
  function renderTargetChart(filtered) {
    const ctx = document.getElementById('chart-target');
    if (!ctx) return;

    const monthLabels = ['Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026'];
    const targets = [20000, 30000, 35000, 40000, 25000];
    const monthKeys = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
    const actuals = [0, 0, 0, 0, 0];

    filtered.forEach(item => {
      if (item.status === 'Completed') {
        const ym = item.date.substring(0, 7);
        const idx = monthKeys.indexOf(ym);
        if (idx !== -1) {
          actuals[idx] += Number(item.amount);
        }
      }
    });

    if (chartInstances.target) {
      chartInstances.target.destroy();
    }

    chartInstances.target = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Monthly Target',
            data: targets,
            backgroundColor: 'rgba(148, 163, 184, 0.25)',
            borderColor: '#64748b',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Actual Realized',
            data: actuals,
            backgroundColor: '#10b981',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#cbd5e1', boxWidth: 10, font: { family: 'inherit', size: 11 } }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#25334e',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: 'inherit', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'inherit', size: 10 },
              callback: (val) => '$' + (val / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  // Table Rendering & Sorting
  function sortData(data) {
    const sorted = [...data];
    const { field, order } = currentSort;

    sorted.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === 'amount' || field === 'quantity') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  function renderTable(filtered) {
    const tableBody = document.getElementById('sales-table-body');
    const summaryCount = document.getElementById('table-summary-count');
    const pageIndicator = document.getElementById('page-indicator');
    const prevBtn = document.getElementById('btn-prev-page');
    const nextBtn = document.getElementById('btn-next-page');

    const sorted = sortData(filtered);
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedItems = sorted.slice(startIndex, startIndex + rowsPerPage);

    summaryCount.textContent = `Showing ${totalItems === 0 ? 0 : startIndex + 1}–${Math.min(startIndex + rowsPerPage, totalItems)} of ${totalItems} transaction${totalItems === 1 ? '' : 's'}`;
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    if (paginatedItems.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="10" class="empty-state">
            No sales records found matching the active filters.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = paginatedItems.map(item => {
      let statusClass = 'status-completed';
      if (item.status === 'Pending') statusClass = 'status-pending';
      if (item.status === 'Refunded') statusClass = 'status-refunded';

      return `
        <tr data-id="${item.id}">
          <td class="table-order-id">${escapeHtml(item.id)}</td>
          <td>${escapeHtml(item.date)}</td>
          <td class="table-customer-name">${escapeHtml(item.customer)}</td>
          <td>${escapeHtml(item.category)}</td>
          <td>${escapeHtml(item.product)}</td>
          <td>${escapeHtml(item.region)}</td>
          <td class="text-center">${formatNumber(item.quantity)}</td>
          <td class="text-right table-amount">${formatCurrencyWithCents(item.amount)}</td>
          <td class="text-center">
            <span class="status-pill ${statusClass}">${escapeHtml(item.status)}</span>
          </td>
          <td class="text-right">
            <button class="btn-action-icon btn-action-edit" data-id="${item.id}" title="Edit Transaction">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-action-icon btn-action-delete" data-id="${item.id}" title="Delete Record">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row button events
    tableBody.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
    });

    tableBody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteRecord(btn.getAttribute('data-id')));
    });
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Full Refresh Cycle
  function refreshDashboard() {
    const filtered = getFilteredData();
    updateKPIs(filtered);
    updateCharts(filtered);
    renderTable(filtered);
  }

  // Modal Handlers (Add / Edit)
  const modal = document.getElementById('record-modal');
  const saleForm = document.getElementById('sale-form');
  const modalTitle = document.getElementById('modal-title');
  const inputQty = document.getElementById('form-quantity');
  const inputUnitPrice = document.getElementById('form-unit-price');
  const inputCost = document.getElementById('form-cost');
  const calculatedPreview = document.getElementById('form-calculated-amount');

  function updateCalculatedAmount() {
    const qty = parseFloat(inputQty.value) || 0;
    const price = parseFloat(inputUnitPrice.value) || 0;
    calculatedPreview.textContent = formatCurrencyWithCents(qty * price);
  }

  inputQty.addEventListener('input', updateCalculatedAmount);
  inputUnitPrice.addEventListener('input', updateCalculatedAmount);

  function openAddModal() {
    modalTitle.textContent = 'Add New Sale Record';
    saleForm.reset();
    document.getElementById('form-sale-id').value = '';

    // Default to current date (2026-11-06)
    document.getElementById('form-date').value = '2026-11-06';
    document.getElementById('form-quantity').value = 1;
    document.getElementById('form-unit-price').value = '';
    document.getElementById('form-cost').value = '';
    updateCalculatedAmount();

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function openEditModal(id) {
    const record = salesData.find(item => item.id === id);
    if (!record) return;

    modalTitle.textContent = `Edit Sale Record: ${record.id}`;
    document.getElementById('form-sale-id').value = record.id;
    document.getElementById('form-date').value = record.date;
    document.getElementById('form-status').value = record.status;
    document.getElementById('form-customer').value = record.customer;
    document.getElementById('form-region').value = record.region;
    document.getElementById('form-category').value = record.category;
    document.getElementById('form-product').value = record.product;
    document.getElementById('form-quantity').value = record.quantity;
    document.getElementById('form-unit-price').value = record.unitPrice;
    document.getElementById('form-cost').value = record.cost;
    document.getElementById('form-payment').value = record.payment;

    updateCalculatedAmount();

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  function generateNextOrderId() {
    let maxNum = 8400;
    salesData.forEach(item => {
      const parts = item.id.split('-');
      if (parts.length === 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `ORD-${maxNum + 1}`;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const existingId = document.getElementById('form-sale-id').value;
    const date = document.getElementById('form-date').value;
    const status = document.getElementById('form-status').value;
    const customer = document.getElementById('form-customer').value.trim();
    const region = document.getElementById('form-region').value;
    const category = document.getElementById('form-category').value;
    const product = document.getElementById('form-product').value.trim();
    const quantity = parseInt(document.getElementById('form-quantity').value, 10) || 1;
    const unitPrice = parseFloat(document.getElementById('form-unit-price').value) || 0;
    const cost = parseFloat(document.getElementById('form-cost').value) || 0;
    const payment = document.getElementById('form-payment').value;
    const amount = quantity * unitPrice;

    if (existingId) {
      // Edit existing
      const index = salesData.findIndex(item => item.id === existingId);
      if (index !== -1) {
        salesData[index] = {
          ...salesData[index],
          date,
          status,
          customer,
          region,
          category,
          product,
          quantity,
          unitPrice,
          cost,
          amount,
          payment
        };
        saveData();
        showToast(`Record ${existingId} updated successfully`, 'success');
      }
    } else {
      // Add new
      const newId = generateNextOrderId();
      const newRecord = {
        id: newId,
        date,
        status,
        customer,
        region,
        category,
        product,
        quantity,
        unitPrice,
        cost,
        amount,
        payment
      };
      salesData.unshift(newRecord);
      saveData();
      showToast(`New transaction ${newId} created`, 'success');
    }

    closeModal();
    refreshDashboard();
  }

  function handleDeleteRecord(id) {
    if (confirm(`Are you sure you want to delete sales record ${id}?`)) {
      salesData = salesData.filter(item => item.id !== id);
      saveData();
      showToast(`Record ${id} deleted`, 'info');
      refreshDashboard();
    }
  }

  // CSV Export
  function exportFilteredCSV() {
    const filtered = getFilteredData();
    if (filtered.length === 0) {
      showToast('No records to export', 'error');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer', 'Category', 'Product', 'Region', 'Quantity', 'Unit Price', 'Cost', 'Total Amount', 'Status', 'Payment Method'];
    const rows = filtered.map(item => [
      `"${item.id}"`,
      `"${item.date}"`,
      `"${(item.customer || '').replace(/"/g, '""')}"`,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${(item.product || '').replace(/"/g, '""')}"`,
      `"${item.region}"`,
      item.quantity,
      item.unitPrice,
      item.cost,
      item.amount,
      `"${item.status}"`,
      `"${item.payment}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `salespulse_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${filtered.length} records to CSV`, 'success');
  }

  // Reset Data to Default
  function resetDemoData() {
    if (confirm('This will reset your dataset to the default demo transactions. Any custom records will be overwritten. Proceed?')) {
      salesData = JSON.parse(JSON.stringify(SEED_DATA));
      saveData(false);
      currentPage = 1;
      refreshDashboard();
      showToast('Demo data restored successfully', 'info');
    }
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Filter controls
    ['filter-timeframe', 'filter-category', 'filter-region', 'filter-status'].forEach(id => {
      document.getElementById(id).addEventListener('change', () => {
        currentPage = 1;
        refreshDashboard();
      });
    });

    document.getElementById('filter-search').addEventListener('input', () => {
      currentPage = 1;
      refreshDashboard();
    });

    document.getElementById('btn-clear-filters').addEventListener('click', () => {
      document.getElementById('filter-timeframe').value = 'all';
      document.getElementById('filter-category').value = 'all';
      document.getElementById('filter-region').value = 'all';
      document.getElementById('filter-status').value = 'all';
      document.getElementById('filter-search').value = '';
      currentPage = 1;
      refreshDashboard();
      showToast('All filters cleared', 'info');
    });

    // Pagination controls
    document.getElementById('btn-prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        const filtered = getFilteredData();
        renderTable(filtered);
      }
    });

    document.getElementById('btn-next-page').addEventListener('click', () => {
      currentPage++;
      const filtered = getFilteredData();
      renderTable(filtered);
    });

    document.getElementById('select-page-size').addEventListener('change', (e) => {
      rowsPerPage = parseInt(e.target.value, 10) || 25;
      currentPage = 1;
      const filtered = getFilteredData();
      renderTable(filtered);
    });

    // Table sorting
    document.querySelectorAll('#sales-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (currentSort.field === field) {
          currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort.field = field;
          currentSort.order = 'asc';
        }
        const filtered = getFilteredData();
        renderTable(filtered);
      });
    });

    // Modal triggers
    document.getElementById('btn-open-add-modal').addEventListener('click', openAddModal);
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    saleForm.addEventListener('submit', handleFormSubmit);

    // CSV & Reset
    document.getElementById('btn-export-csv').addEventListener('click', exportFilteredCSV);
    document.getElementById('btn-reset-data').addEventListener('click', resetDemoData);
  }

  // Application Entry Point
  function init() {
    loadData();
    setupEventListeners();
    refreshDashboard();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

