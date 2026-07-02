(function() {
  // =========================================================================
  // 1. DATA MAPPING SELECTORS (Edit these selectors to match your live site)
  // =========================================================================
  const SELECTORS = {
    totalLeads: '.live-leads-count',
    conversionRate: '.live-conversion-rate',
    openApplications: '.live-open-apps',
    pipelineSegments: '.live-pipeline-progress',
    tasksList: '.live-tasks-due-today li',
    priorityLeadsList: '.live-priority-leads-urgent li'
  };

  // Fallback data if live DOM elements are not found
  const FALLBACK_DATA = {
    totalLeads: '210',
    conversionRate: '18%',
    openApplications: '45',
    pipeline: [40, 20, 20, 10, 10], // New, Contacted, Qualified, Applied, Converted
    tasks: [
      'Call Rahul S. (MBA Inquiry)',
      'Email Priya K. (B.Tech Follow-up)',
      'Schedule Counsellor for Amit V.',
      'Re-check Application form for Sneha R.'
    ],
    priorityLeads: [
      { name: '2 Priority Leads', detail: '+1 803341633 @ email - Inquiry Type' },
      { name: '2 Priority Leads', detail: '+1 812801231 @ email - Inquiry Type' }
    ]
  };

  // Helper function to extract text or return fallback
  function getLiveText(selector, fallback) {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : fallback;
  }

  // =========================================================================
  // 2. DOM PURGE: Clean live desktop elements
  // =========================================================================
  function purgeDesktopElements() {
    const selectorsToHide = [
      'header', '.desktop-header', '#header', '.navigation-bar',
      'footer', '.desktop-footer', '#footer', '.web-footer',
      '.sidebar', '#sidebar', '.aside-navigation',
      '.hero-banner', '.hero-section', '.slider-container', '.carousel',
      '.desktop-only', '.web-ads', '.announcement-bar'
    ];
    
    selectorsToHide.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    });

    // Hide original main content to overlay the native view
    const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.querySelector('#main-content');
    if (mainContent) {
      mainContent.style.setProperty('display', 'none', 'important');
    }
  }

  // =========================================================================
  // 3. APP CONTAINER BUILD: Create master native wrapper
  // =========================================================================
  function buildNativeInterface() {
    // Prevent double injection
    if (document.getElementById('app-native-container')) return;

    const masterContainer = document.createElement('div');
    masterContainer.id = 'app-native-container';
    
    // Inject global styles specific to the container layout
    const style = document.createElement('style');
    style.innerHTML = `
      #app-native-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f4f6f9;
        overflow-y: auto;
        padding-bottom: 90px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .native-header {
        background: #ffffff;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        position: sticky;
        top: 0;
        z-index: 1000000;
      }
      .native-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .native-logo {
        width: 34px;
        height: 34px;
        border-radius: 6px;
      }
      .native-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #0b1a50;
      }
      .native-header-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .native-search-icon {
        color: #757575;
        cursor: pointer;
      }
      .native-profile-photo {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 2px solid #e0e0e0;
      }
      .native-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
      }
      .native-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      /* Component A: Metrics */
      #performance-metrics-card {
        background: linear-gradient(135deg, #0b1a50 0%, #68b82d 100%);
        color: white;
      }
      .metrics-title {
        font-size: 1.05rem;
        font-weight: 600;
        opacity: 0.95;
      }
      .metrics-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        text-align: center;
        gap: 10px;
      }
      .metric-col {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .metric-num {
        font-size: 1.6rem;
        font-weight: 700;
      }
      .metric-txt {
        font-size: 0.68rem;
        opacity: 0.8;
      }
      /* Component B: Pipeline */
      .card-hdr {
        font-size: 1.05rem;
        font-weight: 600;
        color: #0b1a50;
      }
      .progress-bar-segs {
        display: flex;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
      }
      .bar-seg-1 { background: #0b1a50; width: 40%; }
      .bar-seg-2 { background: #76ff03; width: 20%; }
      .bar-seg-3 { background: #29b6f6; width: 20%; }
      .bar-seg-4 { background: #42a5f5; width: 10%; }
      .bar-seg-5 { background: #b0bec5; width: 10%; }
      .pipeline-legend {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        text-align: center;
        gap: 4px;
      }
      .legend-item {
        display: flex;
        flex-direction: column;
      }
      .legend-lbl {
        font-size: 0.62rem;
        font-weight: 600;
      }
      .legend-val {
        font-size: 0.62rem;
        color: #757575;
      }
      /* Component C: Tasks */
      .task-entry {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 0.88rem;
      }
      .task-entry:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      .task-icons-row {
        display: flex;
        gap: 8px;
        color: #757575;
      }
      /* Component D: Actions & Comms */
      .action-lead-box {
        background: #fdf2f2;
        border-left: 4px solid #c62828;
        padding: 12px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .action-lead-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #c62828;
      }
      .action-lead-body {
        font-size: 0.78rem;
        color: #757575;
      }
      /* Floating Action Button */
      .native-fab {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #0b1a50;
        color: white;
        padding: 12px 24px;
        border-radius: 28px;
        font-weight: 600;
        font-size: 0.88rem;
        box-shadow: 0 4px 15px rgba(11,26,80,0.3);
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1000000;
      }
      /* Bottom Navigation */
      .native-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #ffffff;
        border-top: 1px solid #e0e0e0;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        height: 64px;
        z-index: 1000000;
      }
      .nav-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: #757575;
        font-size: 0.62rem;
        font-weight: 500;
        text-decoration: none;
      }
      .nav-button.active {
        color: #0b1a50;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);

    // =========================================================================
    // 4. HEADER BAR
    // =========================================================================
    const header = document.createElement('div');
    header.className = 'native-header';
    header.innerHTML = `
      <div class="native-header-left">
        <!-- Logo SVG -->
        <svg class="native-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5L15 20V50C15 70 30 88 50 95C70 88 85 70 85 50V20L50 5Z" fill="#0b1a50"/>
          <path d="M50 12L22 24V48C22 64 34 79 50 85C66 79 78 64 78 48V24L50 12Z" fill="#76ff03"/>
          <path d="M50 15L25 25.8V48C25 62.5 35.8 76 50 81.5C64.2 76 75 62.5 75 48V25.8L50 15Z" fill="#0b1a50"/>
          <text x="50" y="52" font-family="sans-serif" font-weight="800" font-size="28" fill="#ffffff" text-anchor="middle">AV</text>
        </svg>
        <span class="native-title">Admissions Dashboard</span>
      </div>
      <div class="native-header-right">
        <!-- Search SVG -->
        <svg class="native-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <img class="native-profile-photo" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Profile">
      </div>
    `;
    masterContainer.appendChild(header);

    // =========================================================================
    // 5. STACKED CARDS CONTAINER
    // =========================================================================
    const content = document.createElement('div');
    content.className = 'native-content';

    // Card A: Performance Metrics
    const cardA = document.createElement('div');
    cardA.id = 'performance-metrics-card';
    cardA.className = 'native-card';
    
    const leadsCount = getLiveText(SELECTORS.totalLeads, FALLBACK_DATA.totalLeads);
    const conversionRate = getLiveText(SELECTORS.conversionRate, FALLBACK_DATA.conversionRate);
    const openApps = getLiveText(SELECTORS.openApplications, FALLBACK_DATA.openApplications);

    cardA.innerHTML = `
      <div class="metrics-title">Performance Metrics</div>
      <div class="metrics-row">
        <div class="metric-col">
          <span class="metric-txt">Total New Leads</span>
          <span class="metric-num">${leadsCount}</span>
        </div>
        <div class="metric-col">
          <span class="metric-txt">My Conversion Rate</span>
          <span class="metric-num">${conversionRate}</span>
        </div>
        <div class="metric-col">
          <span class="metric-txt">Open Applications</span>
          <span class="metric-num">${openApps}</span>
        </div>
      </div>
    `;
    content.appendChild(cardA);

    // Card B: My Lead Pipeline
    const cardB = document.createElement('div');
    cardB.id = 'lead-pipeline-card';
    cardB.className = 'native-card';
    cardB.innerHTML = `
      <div class="card-hdr">My Lead Pipeline</div>
      <div class="progress-bar-segs">
        <div class="bar-seg-1"></div>
        <div class="bar-seg-2"></div>
        <div class="bar-seg-3"></div>
        <div class="bar-seg-4"></div>
        <div class="bar-seg-5"></div>
      </div>
      <div class="pipeline-legend">
        <div class="legend-item"><span class="legend-lbl">New</span><span class="legend-val">(40%)</span></div>
        <div class="legend-item"><span class="legend-lbl">Contacted</span><span class="legend-val">(20%)</span></div>
        <div class="legend-item"><span class="legend-lbl">Qualified</span><span class="legend-val">(20%)</span></div>
        <div class="legend-item"><span class="legend-lbl">Applied</span><span class="legend-val">(10%)</span></div>
        <div class="legend-item"><span class="legend-lbl">Converted</span><span class="legend-val">(10%)</span></div>
      </div>
    `;
    content.appendChild(cardB);

    // Card C: Tasks Due Today
    const cardC = document.createElement('div');
    cardC.id = 'tasks-due-card';
    cardC.className = 'native-card';
    
    // Extract live tasks or use fallback
    const liveTasksList = document.querySelectorAll(SELECTORS.tasksList);
    let tasksHTML = '';
    if (liveTasksList.length > 0) {
      liveTasksList.forEach((task, idx) => {
        tasksHTML += createTaskHTML(idx + 1, task.textContent.trim(), idx);
      });
    } else {
      FALLBACK_DATA.tasks.forEach((task, idx) => {
        tasksHTML += createTaskHTML(idx + 1, task, idx);
      });
    }

    cardC.innerHTML = `
      <div class="card-hdr">Tasks Due Today</div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${tasksHTML}
      </div>
    `;
    content.appendChild(cardC);

    // Card D: Leads Needing Immediate Action
    const cardD = document.createElement('div');
    cardD.id = 'immediate-action-card';
    cardD.className = 'native-card';

    // Extract live priority leads or use fallback
    const livePriorityList = document.querySelectorAll(SELECTORS.priorityLeadsList);
    let actionHTML = '';
    if (livePriorityList.length > 0) {
      livePriorityList.forEach(lead => {
        actionHTML += `
          <div class="action-lead-box">
            <span class="action-lead-title">Priority Lead</span>
            <span class="action-lead-body">${lead.textContent.trim()}</span>
          </div>
        `;
      });
    } else {
      FALLBACK_DATA.priorityLeads.forEach(lead => {
        actionHTML += `
          <div class="action-lead-box">
            <span class="action-lead-title">${lead.name}</span>
            <span class="action-lead-body">${lead.detail}</span>
          </div>
        `;
      });
    }

    cardD.innerHTML = `
      <div class="card-hdr">Leads Needing Immediate Action</div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${actionHTML}
      </div>
    `;
    content.appendChild(cardD);

    masterContainer.appendChild(content);

    // =========================================================================
    // 6. FLOATING ACTION BUTTON (FAB)
    // =========================================================================
    const fab = document.createElement('div');
    fab.className = 'native-fab';
    fab.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span>NEW LEAD</span>
    `;
    masterContainer.appendChild(fab);

    // =========================================================================
    // 7. BOTTOM NAVIGATION BAR
    // =========================================================================
    const bottomNav = document.createElement('div');
    bottomNav.className = 'native-bottom-nav';
    bottomNav.innerHTML = `
      <a href="#" class="nav-button active">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Dashboard</span>
      </a>
      <a href="#" class="nav-button">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        <span>Inquiries</span>
      </a>
      <a href="#" class="nav-button">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Tasks</span>
      </a>
      <a href="#" class="nav-button" style="position: relative;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span style="position: absolute; top: 4px; right: 26%; background: #c62828; color: white; font-size: 0.55rem; width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid white;">1</span>
        <span>Communication</span>
      </a>
      <a href="#" class="nav-button">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>More</span>
      </a>
    `;
    masterContainer.appendChild(bottomNav);

    document.body.appendChild(masterContainer);
  }

  // Helper function to build custom task HTML with SVGs
  function createTaskHTML(num, text, idx) {
    const iconSvgs = [
      // Phone + Doc SVG
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
      // Email + Doc SVG
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
      // Calendar + Doc SVG
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
      // Doc Only SVG
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`
    ];

    const currentSvg = iconSvgs[idx % iconSvgs.length];

    return `
      <div class="task-entry">
        <span>${num}. ${text}</span>
        <div class="task-icons-row">${currentSvg}</div>
      </div>
    `;
  }

  // Run DOM purge and interface initialization
  function init() {
    purgeDesktopElements();
    buildNativeInterface();
  }

  // Run on load and immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Hook into any ajax/dynamic load modifications
  window.addEventListener('load', init);
})();
