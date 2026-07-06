// LAST WAR: RESEARCH PLANNER - JS CONTROLLER

const CATEGORIES_MAPPING = {
  "development": { title: "Development", icon: "images/tech/overview/development.png" },
  "economy": { title: "Economy", icon: "images/tech/overview/economy-new.png" },
  "hero": { title: "Hero", icon: "images/tech/overview/hero-new.png" },
  "units": { title: "Units", icon: "images/tech/overview/units-new.png" },
  "squad-1": { title: "Squad 1", icon: "images/tech/overview/squad-1-new.png" },
  "squad-2": { title: "Squad 2", icon: "images/tech/overview/squad-2-new.png" },
  "squad-3": { title: "Squad 3", icon: "images/tech/overview/squad-3-new.png" },
  "squad-4": { title: "Squad 4", icon: "images/tech/overview/squad-4-new.png" },
  "alliance-duel": { title: "Alliance Duel", icon: "images/tech/overview/alliance-duel-new.png" },
  "special-forces": { title: "Special Forces", icon: "images/tech/overview/special-forces-new.png" },
  "siege-to-seize": { title: "Siege to Seize", icon: "images/tech/overview/siege-to-seize-new.png" },
  "defense-fortifications": { title: "Defense Fortifications", icon: "images/tech/overview/defense-fortifications.png" },
  "tank-mastery": { title: "Tank Mastery", icon: "images/tech/overview/tank-mastery-new.png" },
  "missile-mastery": { title: "Missile Mastery", icon: "images/tech/overview/missile-mastery-new.png" },
  "aircraft-mastery": { title: "Aircraft Mastery", icon: "images/tech/overview/aircraft-mastery-new.png" },
  "the-age-of-oil": { title: "The Age of Oil", icon: "images/tech/overview/the-age-of-oil-new.png" },
  "tactical-weapon": { title: "Tactical Weapon", icon: "images/tech/overview/tactical-weapon-new.png" },
  "t10-special-forces": { title: "T10 Special Forces", icon: "images/tech/overview/special-forces-new.png" }
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
      <div class="cat-icon-wrapper">
        <img src="${config.icon}" alt="${config.title}" class="cat-icon-img">
      </div>
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
      const catIcon = CATEGORIES_MAPPING[activeCategory].icon;
      
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
            <img src="${tech.image}" alt="${tech.name}" class="tech-icon-img" onerror="this.src='${catIcon}';">
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
