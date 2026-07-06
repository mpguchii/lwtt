// LAST WAR: RESEARCH PLANNER - JS CONTROLLER

// Mapping categories to friendly icons
const ICONS = {
  development: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
  economy: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  hero: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
  units: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`,
  squad: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
  alliance: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
  special: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`,
  siege: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h2" /></svg>`,
  defense: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>`,
  tank: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13a1 1 0 011 1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a1 1 0 011-1m18 0H3m18 0a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 7H7a2 2 0 00-2 2v4m14-6H9m4 0v-3h-2v3" /></svg>`,
  missile: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>`,
  aircraft: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>`,
  oil: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>`,
  tactical: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1.5V3m0 18v1.5M1.5 12H3m18 0h1.5M19.8 19.8l-1.05-1.05M5.25 5.25l-1.05-1.05m15.6 0l-1.05 1.05M5.25 18.75l-1.05 1.05" /></svg>`,
  t10: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.52 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" /></svg>`
};

const CATEGORIES_MAPPING = {
  "development": { title: "Development", icon: ICONS.development },
  "economy": { title: "Economy", icon: ICONS.economy },
  "hero": { title: "Hero", icon: ICONS.hero },
  "units": { title: "Units", icon: ICONS.units },
  "squad-1": { title: "Squad 1", icon: ICONS.squad },
  "squad-2": { title: "Squad 2", icon: ICONS.squad },
  "squad-3": { title: "Squad 3", icon: ICONS.squad },
  "squad-4": { title: "Squad 4", icon: ICONS.squad },
  "alliance-duel": { title: "Alliance Duel", icon: ICONS.alliance },
  "special-forces": { title: "Special Forces", icon: ICONS.special },
  "siege-to-seize": { title: "Siege to Seize", icon: ICONS.siege },
  "defense-fortifications": { title: "Defense Fortifications", icon: ICONS.defense },
  "tank-mastery": { title: "Tank Mastery", icon: ICONS.tank },
  "missile-mastery": { title: "Missile Mastery", icon: ICONS.missile },
  "aircraft-mastery": { title: "Aircraft Mastery", icon: ICONS.aircraft },
  "the-age-of-oil": { title: "The Age of Oil", icon: ICONS.oil },
  "tactical-weapon": { title: "Tactical Weapon", icon: ICONS.tactical },
  "t10-special-forces": { title: "T10 Special Forces", icon: ICONS.t10 }
};

const CATEGORIES_ORDER = Object.keys(CATEGORIES_MAPPING);

// App state
let activeCategory = "development";
let nickname = "";
let treeLevels = {}; // maps key "category_index" -> integer level

// Compute index mappings
let flatIndexToKey = []; // array of { category, index, max_level }
let keyToFlatIndex = {}; // maps "category_index" -> flatIndex
let totalMaxPoints = 0; // Total sum of max levels of all techs

function initMappings() {
  let flatIndex = 0;
  for (let cat of CATEGORIES_ORDER) {
    const rows = TECH_DATA[cat].rows;
    TECH_DATA[cat].flatTechs = [];
    let idx = 0;
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const tech = row[c];
        TECH_DATA[cat].flatTechs.push(tech);
        const key = `${cat}_${idx}`;
        flatIndexToKey.push({
          category: cat,
          index: idx,
          name: tech.name,
          max_level: tech.max_level
        });
        keyToFlatIndex[key] = flatIndex;
        flatIndex++;
        
        // Initialize state to 0
        if (!(key in treeLevels)) {
          treeLevels[key] = 0;
        }
        totalMaxPoints += tech.max_level;
        idx++;
      }
    }
  }
}

// COMPRESSION & DECOMPRESSION (LZString URI Component - Binary/Max Optimized)
function compressLevels() {
  const chars = [];
  for (let idx = 0; idx < flatIndexToKey.length; idx++) {
    const item = flatIndexToKey[idx];
    const key = `${item.category}_${item.index}`;
    const lvl = treeLevels[key];
    const max = item.max_level;
    
    if (lvl === 0) {
      chars.push("0");
    } else if (lvl === max) {
      chars.push("1");
    } else {
      // Intermediate level: map to (lvl + 1) in base-36 (guaranteed to be 2-u)
      chars.push((lvl + 1).toString(36));
    }
  }
  const str = chars.join('');
  return LZString.compressToEncodedURIComponent(str);
}

function decompressLevels(hashData) {
  if (!hashData) return;
  let decompressedStr;
  try {
    decompressedStr = LZString.decompressFromEncodedURIComponent(hashData);
  } catch (e) {
    console.error("Failed to decompress LZString:", e);
    return;
  }
  
  if (!decompressedStr) return;
  
  // Fill the state
  for (let idx = 0; idx < flatIndexToKey.length; idx++) {
    const item = flatIndexToKey[idx];
    const key = `${item.category}_${item.index}`;
    
    if (idx < decompressedStr.length) {
      const char = decompressedStr[idx];
      const max = item.max_level;
      if (char === "0") {
        treeLevels[key] = 0;
      } else if (char === "1") {
        treeLevels[key] = max;
      } else {
        const val = parseInt(char, 36) - 1;
        treeLevels[key] = Math.max(0, Math.min(max, isNaN(val) ? 0 : val));
      }
    } else {
      treeLevels[key] = 0;
    }
  }
}

// STORAGE
function saveToLocalStorage() {
  localStorage.setItem("lw_nick", nickname);
  localStorage.setItem("lw_levels", JSON.stringify(treeLevels));
}

function loadFromLocalStorage() {
  const savedNick = localStorage.getItem("lw_nick");
  const savedLevels = localStorage.getItem("lw_levels");
  
  if (savedNick) {
    nickname = savedNick;
    document.getElementById("nickname").value = nickname;
  }
  if (savedLevels) {
    try {
      const levels = JSON.parse(savedLevels);
      // Map loaded levels, verifying bounds
      for (let key in levels) {
        if (key in treeLevels) {
          const parts = key.split('_');
          const cat = parts[0];
          const idx = parseInt(parts[1]);
          const max_lvl = TECH_DATA[cat].flatTechs[idx].max_level;
          treeLevels[key] = Math.max(0, Math.min(max_lvl, levels[key]));
        }
      }
    } catch (e) {
      console.error("Error loading local storage data", e);
    }
  }
}

// STATE CALCULATIONS & UPDATES
function calculateCategoryStats(cat) {
  const techs = TECH_DATA[cat].flatTechs;
  let maxedCount = 0;
  let currentPoints = 0;
  let totalCatMaxPoints = 0;
  
  for (let i = 0; i < techs.length; i++) {
    const key = `${cat}_${i}`;
    const level = treeLevels[key];
    const max = techs[i].max_level;
    currentPoints += level;
    totalCatMaxPoints += max;
    if (level === max) {
      maxedCount++;
    }
  }
  
  const percentage = totalCatMaxPoints > 0 ? Math.round((currentPoints / totalCatMaxPoints) * 100) : 0;
  return {
    maxedCount,
    totalTechs: techs.length,
    percentage,
    isMaxed: maxedCount === techs.length
  };
}

function calculateGlobalProgress() {
  let currentGlobalPoints = 0;
  let totalMaxedTechs = 0;
  
  for (let key in treeLevels) {
    currentGlobalPoints += treeLevels[key];
    const parts = key.split('_');
    const cat = parts[0];
    const idx = parseInt(parts[1]);
    if (treeLevels[key] === TECH_DATA[cat].flatTechs[idx].max_level) {
      totalMaxedTechs++;
    }
  }
  
  const percentage = totalMaxPoints > 0 ? Math.round((currentGlobalPoints / totalMaxPoints) * 100) : 0;
  
  // Update UI Elements
  document.getElementById("global-percent").textContent = `${percentage}%`;
  document.getElementById("global-progress-fill").style.width = `${percentage}%`;
  document.getElementById("global-fraction").textContent = `${totalMaxedTechs} / ${flatIndexToKey.length}`;
}

// DOM RENDERING
function renderCategories() {
  const nav = document.getElementById("categories-nav");
  nav.innerHTML = "";
  
  for (let cat of CATEGORIES_ORDER) {
    const config = CATEGORIES_MAPPING[cat];
    const stats = calculateCategoryStats(cat);
    
    const btn = document.createElement("button");
    btn.className = `category-btn ${cat === activeCategory ? 'active' : ''} ${stats.isMaxed ? 'maxed' : ''}`;
    btn.setAttribute("data-category", cat);
    
    btn.innerHTML = `
      <div class="cat-icon-wrapper">${config.icon}</div>
      <div class="cat-text-info">
        <span class="cat-name">${config.title}</span>
        <div class="cat-progress-wrapper">
          <span class="cat-progress-num">${stats.maxedCount}/${stats.totalTechs} MAX</span>
          <span>${stats.percentage}%</span>
        </div>
        <div class="cat-bar-container">
          <div class="cat-bar-fill" style="width: ${stats.percentage}%"></div>
        </div>
      </div>
    `;
    
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderCategories();
      renderTechsGrid();
    });
    
    nav.appendChild(btn);
  }
}

function renderTechsGrid() {
  const grid = document.getElementById("techs-grid");
  grid.innerHTML = "";
  
  const catTitle = CATEGORIES_MAPPING[activeCategory].title;
  const stats = calculateCategoryStats(activeCategory);
  
  document.getElementById("active-category-title").textContent = catTitle;
  document.getElementById("active-category-progress-desc").textContent = 
    `${stats.maxedCount} of ${stats.totalTechs} researches maxed (${stats.percentage}%)`;
    
  const rows = TECH_DATA[activeCategory].rows;
  let techIdx = 0;
  
  rows.forEach((row, rowIdx) => {
    const rowEl = document.createElement("div");
    rowEl.className = "tech-tree-row";
    
    row.forEach(tech => {
      const i = techIdx++;
      const key = `${activeCategory}_${i}`;
      const level = treeLevels[key];
      const isMaxed = level === tech.max_level;
      
      const card = document.createElement("div");
      card.className = `tech-card ${level === 0 ? 'zero-level' : ''} ${isMaxed ? 'maxed' : ''}`;
      card.setAttribute("data-key", key);
      
      // Select dynamic category-styled icon
      const iconSvg = CATEGORIES_MAPPING[activeCategory].icon;
      
      // Build levels indicator (dots or bar depending on max_level count)
      let levelsIndicatorHtml = "";
      if (tech.max_level <= 10) {
        levelsIndicatorHtml = `<div class="tech-level-dots">`;
        for (let l = 1; l <= tech.max_level; l++) {
          levelsIndicatorHtml += `<div class="lvl-dot ${l <= level ? 'active' : ''}"></div>`;
        }
        levelsIndicatorHtml += `</div>`;
      } else {
        const fillPercent = Math.round((level / tech.max_level) * 100);
        levelsIndicatorHtml = `
          <div class="tech-level-bar-container">
            <div class="tech-level-bar-fill" style="width: ${fillPercent}%"></div>
          </div>
        `;
      }
      
      card.innerHTML = `
        <span class="max-badge">MAX</span>
        <div class="tech-card-top">
          <div class="tech-icon-container">
            <img src="${tech.image}" alt="${tech.name}" class="tech-icon-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display:none; width:100%; height:100%;" class="fallback-svg-icon">${iconSvg}</div>
          </div>
          <div class="tech-name-wrapper">
            <span class="tech-card-name">${tech.name}</span>
          </div>
        </div>
        <div class="tech-card-level-display">
          <span class="tech-lvl-label">Level</span>
          <span class="tech-lvl-numbers">${level} / ${tech.max_level}</span>
        </div>
        ${levelsIndicatorHtml}
        <div class="tech-controls">
          <button class="ctrl-btn ctrl-minus" ${level === 0 ? 'disabled' : ''}>-</button>
          <button class="ctrl-btn ctrl-max">MAX</button>
          <button class="ctrl-btn ctrl-plus" ${isMaxed ? 'disabled' : ''}>+</button>
        </div>
      `;
      
      // Wire up events for controls
      const btnMinus = card.querySelector(".ctrl-minus");
      const btnPlus = card.querySelector(".ctrl-plus");
      const btnMax = card.querySelector(".ctrl-max");
      
      btnMinus.addEventListener("click", (e) => {
        e.stopPropagation();
        changeTechLevel(key, -1);
      });
      
      btnPlus.addEventListener("click", (e) => {
        e.stopPropagation();
        changeTechLevel(key, 1);
      });
      
      btnMax.addEventListener("click", (e) => {
        e.stopPropagation();
        setTechLevel(key, tech.max_level);
      });
      
      // Clicking the card itself increments (gamified feeling)
      card.addEventListener("click", () => {
        if (level < tech.max_level) {
          changeTechLevel(key, 1);
        } else {
          setTechLevel(key, 0); // Toggle back to 0 if clicked at max level
        }
      });
      
      rowEl.appendChild(card);
    });
    
    grid.appendChild(rowEl);
    
    // Add connector line between rows
    if (rowIdx < rows.length - 1) {
      const conn = document.createElement("div");
      conn.className = "tech-tree-connector";
      if (stats.isMaxed) {
        conn.classList.add("maxed");
      }
      grid.appendChild(conn);
    }
  });
}

function changeTechLevel(key, delta) {
  const parts = key.split('_');
  const cat = parts[0];
  const idx = parseInt(parts[1]);
  const tech = TECH_DATA[cat].flatTechs[idx];
  
  let newLvl = treeLevels[key] + delta;
  newLvl = Math.max(0, Math.min(tech.max_level, newLvl));
  
  treeLevels[key] = newLvl;
  
  updateGlobalState();
}

function setTechLevel(key, value) {
  treeLevels[key] = value;
  updateGlobalState();
}

function updateGlobalState() {
  calculateGlobalProgress();
  renderCategories();
  renderTechsGrid();
  saveToLocalStorage();
}

// PROFILE ACTIONS
function setCategoryLevels(cat, type) {
  // type is 'max' or 'reset'
  const techs = TECH_DATA[cat].flatTechs;
  for (let i = 0; i < techs.length; i++) {
    const key = `${cat}_${i}`;
    treeLevels[key] = type === 'max' ? techs[i].max_level : 0;
  }
  updateGlobalState();
}

function setAllLevels(type) {
  // type is 'max' or 'reset'
  for (let cat of CATEGORIES_ORDER) {
    const techs = TECH_DATA[cat].flatTechs;
    for (let i = 0; i < techs.length; i++) {
      const key = `${cat}_${i}`;
      treeLevels[key] = type === 'max' ? techs[i].max_level : 0;
    }
  }
  updateGlobalState();
}

// TOAST MESSAGES
function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// SHARING MODAL
function openShareModal() {
  const compressed = compressLevels();
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}#data=${compressed}&nick=${encodeURIComponent(nickname)}`;
  
  const modalInput = document.getElementById("share-url-input");
  modalInput.value = shareUrl;
  
  const modal = document.getElementById("share-modal");
  modal.classList.add("open");
  
  // Auto focus input
  modalInput.select();
}

function closeShareModal() {
  document.getElementById("share-modal").classList.remove("open");
}

function copyShareUrl() {
  const modalInput = document.getElementById("share-url-input");
  modalInput.select();
  modalInput.setSelectionRange(0, 99999); // For mobile devices
  
  try {
    navigator.clipboard.writeText(modalInput.value);
    showToast("Sharing link copied to clipboard!");
    closeShareModal();
  } catch (err) {
    // Fallback if clipboard API fails
    document.execCommand("copy");
    showToast("Sharing link copied to clipboard!");
    closeShareModal();
  }
}

// INITIALIZATION
function parseUrlHash() {
  const hash = window.location.hash;
  if (!hash) return false;
  
  try {
    // Strip leading '#'
    const hashStr = hash.substring(1);
    const params = new URLSearchParams(hashStr);
    
    const nick = params.get("nick");
    const data = params.get("data");
    
    if (nick) {
      nickname = decodeURIComponent(nick);
      document.getElementById("nickname").value = nickname;
    }
    if (data) {
      decompressLevels(data);
      return true;
    }
  } catch (e) {
    console.error("Error parsing URL hash:", e);
  }
  return false;
}

// ON LOAD
window.addEventListener("DOMContentLoaded", () => {
  initMappings();
  
  // Try loading from URL hash first, if not present fall back to localStorage
  const loadedFromUrl = parseUrlHash();
  if (!loadedFromUrl) {
    loadFromLocalStorage();
  }
  
  // Bind Header Controls
  document.getElementById("nickname").addEventListener("input", (e) => {
    nickname = e.target.value.trim();
    saveToLocalStorage();
  });
  
  document.getElementById("btn-share").addEventListener("click", openShareModal);
  
  document.getElementById("btn-max").addEventListener("click", () => {
    if (confirm("Do you want to maximize ALL research trees?")) {
      setAllLevels("max");
      showToast("All research trees have been maximized!");
    }
  });
  
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset ALL research trees?")) {
      setAllLevels("reset");
      showToast("All researches have been reset successfully!");
    }
  });
  
  // Bind Category Controls
  document.getElementById("btn-max-cat").addEventListener("click", () => {
    setCategoryLevels(activeCategory, "max");
    const catTitle = CATEGORIES_MAPPING[activeCategory].title;
    showToast(`Tree '${catTitle}' maximized!`);
  });
  
  document.getElementById("btn-reset-cat").addEventListener("click", () => {
    if (confirm(`Reset all researches in the '${CATEGORIES_MAPPING[activeCategory].title}' tree?`)) {
      setCategoryLevels(activeCategory, "reset");
      showToast("Research tree reset!");
    }
  });
  
  // Bind Modal Controls
  document.getElementById("modal-close-btn").addEventListener("click", closeShareModal);
  document.getElementById("btn-copy-url").addEventListener("click", copyShareUrl);
  
  // Close modal when clicking outside modal box
  document.getElementById("share-modal").addEventListener("click", (e) => {
    if (e.target.id === "share-modal") {
      closeShareModal();
    }
  });
  
  // Render Initial View
  calculateGlobalProgress();
  renderCategories();
  renderTechsGrid();
});
