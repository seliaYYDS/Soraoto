// 时间显示
function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateTime, 1000);
updateTime();

// 主题切换功能
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
    saveThemePreference();
});

// 保存主题偏好
function saveThemePreference() {
    const isLightTheme = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
}

// 加载主题偏好
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('light-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// 搜索引擎切换
let selectedEngine = 'https://www.baidu.com/s?wd='; // 默认使用百度
const selectedEngineElement = document.getElementById('selected-engine');
const engineOptionsElement = document.getElementById('engine-options');

selectedEngineElement.addEventListener('click', () => {
    engineOptionsElement.style.display = engineOptionsElement.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.engine-option').forEach(option => {
    option.addEventListener('click', () => {
        if (option.id === 'add-engine') {
            document.getElementById('custom-engine-popup').style.display = 'flex';
        } else if (option.id === 'manage-engines') {
            showManageEngines();
        } else {
            selectedEngine = option.getAttribute('data-engine');
            selectedEngineElement.innerHTML = `
                <img src="${option.querySelector('img').src}" alt="${option.textContent}" class="engine-icon">
                <span>${option.textContent}</span>
            `;
            saveDefaultEngine(selectedEngine);
        }
        engineOptionsElement.style.display = 'none';
    });
});

// 添加引擎功能
const customEnginePopup = document.getElementById('custom-engine-popup');
const engineNameInput = document.getElementById('engine-name-input');
const engineUrlInput = document.getElementById('engine-url-input');
const cancelEngineButton = document.getElementById('cancel-engine-button');
const confirmEngineButton = document.getElementById('confirm-engine-button');

function addCustomEngine() {
    const engineName = engineNameInput.value.trim();
    const engineUrl = engineUrlInput.value.trim();
    if (engineName && engineUrl && engineUrl.includes('{query}')) {
        const newEngineOption = document.createElement('div');
        newEngineOption.className = 'engine-option';
        newEngineOption.setAttribute('data-engine', engineUrl);
        newEngineOption.innerHTML = `
            <img src="https://www.baidu.com/favicon.ico" alt="${engineName}" class="engine-icon">
            <span>${engineName}</span>
        `;
        newEngineOption.addEventListener('click', () => {
            selectedEngine = newEngineOption.getAttribute('data-engine');
            selectedEngineElement.innerHTML = `
                <img src="${newEngineOption.querySelector('img').src}" alt="${engineName}" class="engine-icon">
                <span>${engineName}</span>
            `;
            engineOptionsElement.style.display = 'none';
            saveDefaultEngine(selectedEngine);
        });
        engineOptionsElement.insertBefore(newEngineOption, document.getElementById('add-engine'));
        saveCustomEngines();
    } else {
        alert('请填写有效的引擎名称和URL（URL必须包含{query}）');
    }
    customEnginePopup.style.display = 'none';
    engineNameInput.value = '';
    engineUrlInput.value = '';
}

confirmEngineButton.addEventListener('click', addCustomEngine);
cancelEngineButton.addEventListener('click', () => {
    customEnginePopup.style.display = 'none';
    engineNameInput.value = '';
    engineUrlInput.value = '';
});

engineUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCustomEngine();
    }
});

// 管理引擎功能
const manageEnginesPopup = document.getElementById('manage-engines-popup');
const engineList = document.getElementById('engine-list');
const closeManageButton = document.getElementById('close-manage-button');

function showManageEngines() {
    engineList.innerHTML = '';
    document.querySelectorAll('.engine-option').forEach(option => {
        if (option.id !== 'add-engine' && option.id !== 'manage-engines') {
            const engineItem = document.createElement('div');
            engineItem.className = 'engine-item';
            engineItem.innerHTML = `
                <span>${option.textContent}</span>
                <div>
                    <button class="edit-button" data-engine="${option.getAttribute('data-engine')}">编辑</button>
                    <button class="delete-button" data-engine="${option.getAttribute('data-engine')}">删除</button>
                </div>
            `;
            engineList.appendChild(engineItem);
        }
    });
    manageEnginesPopup.style.display = 'flex';
}

closeManageButton.addEventListener('click', () => {
    manageEnginesPopup.style.display = 'none';
});

engineList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        const engineUrl = e.target.getAttribute('data-engine');
        deleteEngine(engineUrl);
    } else if (e.target.classList.contains('edit-button')) {
        const engineUrl = e.target.getAttribute('data-engine');
        showEditEnginePopup(engineUrl);
    }
});

function deleteEngine(engineUrl) {
    const optionToRemove = document.querySelector(`.engine-option[data-engine="${engineUrl}"]`);
    if (optionToRemove) {
        optionToRemove.remove();
        saveCustomEngines();
        showManageEngines();
    }
}

// 编辑引擎功能
const editEnginePopup = document.getElementById('edit-engine-popup');
const editEngineNameInput = document.getElementById('edit-engine-name-input');
const editEngineUrlInput = document.getElementById('edit-engine-url-input');
const cancelEditButton = document.getElementById('cancel-edit-button');
const confirmEditButton = document.getElementById('confirm-edit-button');

function showEditEnginePopup(engineUrl) {
    const optionToEdit = document.querySelector(`.engine-option[data-engine="${engineUrl}"]`);
    if (optionToEdit) {
        editEngineNameInput.value = optionToEdit.textContent;
        editEngineUrlInput.value = optionToEdit.getAttribute('data-engine');
        editEnginePopup.style.display = 'flex';
    }
}

function saveEditedEngine() {
    const engineName = editEngineNameInput.value.trim();
    const engineUrl = editEngineUrlInput.value.trim();
    if (engineName && engineUrl && engineUrl.includes('{query}')) {
        const optionToEdit = document.querySelector(`.engine-option[data-engine="${editEngineUrlInput.value}"]`);
        if (optionToEdit) {
            optionToEdit.textContent = engineName;
            optionToEdit.setAttribute('data-engine', engineUrl);
            saveCustomEngines();
            showManageEngines();
        }
    } else {
        alert('请填写有效的引擎名称和URL（URL必须包含{query}）');
    }
    editEnginePopup.style.display = 'none';
}

confirmEditButton.addEventListener('click', saveEditedEngine);
cancelEditButton.addEventListener('click', () => {
    editEnginePopup.style.display = 'none';
});

editEngineUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveEditedEngine();
    }
});

// 保存自定义引擎
function saveCustomEngines() {
    const engines = [];
    document.querySelectorAll('.engine-option').forEach(option => {
        if (option.id !== 'add-engine' && option.id !== 'manage-engines') {
            engines.push({
                name: option.textContent,
                url: option.getAttribute('data-engine')
            });
        }
    });
    localStorage.setItem('customEngines', JSON.stringify(engines));
}

// 加载自定义引擎
function loadCustomEngines() {
    const engines = JSON.parse(localStorage.getItem('customEngines')) || [];
    engines.forEach(engine => {
        const existingEngine = document.querySelector(`.engine-option[data-engine="${engine.url}"]`);
        if (!existingEngine) {
            const newEngineOption = document.createElement('div');
            newEngineOption.className = 'engine-option';
            newEngineOption.setAttribute('data-engine', engine.url);
            newEngineOption.innerHTML = `
                <img src="https://www.baidu.com/favicon.ico" alt="${engine.name}" class="engine-icon">
                <span>${engine.name}</span>
            `;
            newEngineOption.addEventListener('click', () => {
                selectedEngine = newEngineOption.getAttribute('data-engine');
                selectedEngineElement.innerHTML = `
                    <img src="${newEngineOption.querySelector('img').src}" alt="${engine.name}" class="engine-icon">
                    <span>${engine.name}</span>
                `;
                engineOptionsElement.style.display = 'none';
                saveDefaultEngine(selectedEngine);
            });
            engineOptionsElement.insertBefore(newEngineOption, document.getElementById('add-engine'));
        }
    });
}

// 保存默认搜索引擎
function saveDefaultEngine(engineUrl) {
    localStorage.setItem('defaultEngine', engineUrl);
}

// 加载默认搜索引擎
function loadDefaultEngine() {
    const defaultEngine = localStorage.getItem('defaultEngine');
    if (defaultEngine) {
        selectedEngine = defaultEngine;
        const option = document.querySelector(`.engine-option[data-engine="${defaultEngine}"]`);
        if (option) {
            selectedEngineElement.innerHTML = `
                <img src="${option.querySelector('img').src}" alt="${option.textContent}" class="engine-icon">
                <span>${option.textContent}</span>
            `;
        }
    }
}

// 搜索建议功能
const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions');

// 获取百度搜索建议
async function fetchSearchSuggestions(query) {
    try {
        const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest='; // 使用 CORS 代理
        const apiUrl = `https://www.baidu.com/sugrec?prod=pc&wd=${encodeURIComponent(query)}`;
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        return data.g ? data.g.map(item => item.q) : []; // 返回搜索建议列表
    } catch (error) {
        console.error('获取搜索建议失败:', error);
        return [];
    }
}

// 监听输入事件
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query) {
        const suggestions = await fetchSearchSuggestions(query);
        showSuggestions(suggestions);
    } else {
        hideSuggestions();
    }
});

// 显示搜索建议
function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
        <div onclick="selectSuggestion('${suggestion}')">${suggestion}</div>
    `).join('');
    suggestionsContainer.style.display = 'block';
}

// 隐藏搜索建议
function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
}

// 选择搜索建议
function selectSuggestion(suggestion) {
    searchInput.value = suggestion;
    hideSuggestions();
    performSearch(); // 直接执行搜索
}

// 执行搜索
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = selectedEngine + encodeURIComponent(query);
    }
}

// 初始化
loadCustomEngines();
loadDefaultEngine();
loadThemePreference();

// 搜索功能
document.getElementById('search-button').addEventListener('click', performSearch);

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 设置界面功能
const settingsToggle = document.getElementById('settings-toggle');
const settingsOverlay = document.getElementById('settings-overlay');
const closeSettings = document.getElementById('close-settings');
const settingsTabs = document.querySelectorAll('.settings-tabs .tab');
const settingsContents = document.querySelectorAll('.settings-content');

// 打开设置界面
settingsToggle.addEventListener('click', () => {
    settingsOverlay.style.display = 'flex';
});

// 关闭设置界面
closeSettings.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
});

// 切换设置选项卡
settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        settingsTabs.forEach(t => t.classList.remove('active'));
        settingsContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.settings-content[data-tab="${targetTab}"]`).classList.add('active');
    });
});

// 背景设置功能
const backgroundTypeRadios = document.querySelectorAll('input[name="background-type"]');
const solidBackground = document.getElementById('solid-background');
const gradientBackground = document.getElementById('gradient-background');
const customBackground = document.getElementById('custom-background');
const solidColorInput = document.getElementById('solid-color');
const gradientColor1Input = document.getElementById('gradient-color-1');
const gradientColor2Input = document.getElementById('gradient-color-2');
const customImageInput = document.getElementById('custom-image');
const blurIntensityInput = document.getElementById('blur-intensity');
const darkenIntensityInput = document.getElementById('darken-intensity');

// 切换背景类型
backgroundTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        solidBackground.style.display = 'none';
        gradientBackground.style.display = 'none';
        customBackground.style.display = 'none';
        if (radio.value === 'solid') {
            solidBackground.style.display = 'block';
        } else if (radio.value === 'gradient') {
            gradientBackground.style.display = 'block';
        } else if (radio.value === 'custom') {
            customBackground.style.display = 'block';
        }
    });
});

// 应用纯色背景
solidColorInput.addEventListener('input', () => {
    body.style.background = solidColorInput.value;
});

// 应用渐变背景
gradientColor1Input.addEventListener('input', () => {
    body.style.background = `linear-gradient(135deg, ${gradientColor1Input.value}, ${gradientColor2Input.value})`;
});

gradientColor2Input.addEventListener('input', () => {
    body.style.background = `linear-gradient(135deg, ${gradientColor1Input.value}, ${gradientColor2Input.value})`;
});

// 应用自定义背景
customImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            body.style.backgroundImage = `url(${event.target.result})`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
        };
        reader.readAsDataURL(file);
    }
});

// 应用背景模糊
blurIntensityInput.addEventListener('input', () => {
    body.style.backdropFilter = `blur(${blurIntensityInput.value}px)`;
});

// 应用背景深化
darkenIntensityInput.addEventListener('input', () => {
    body.style.backgroundColor = `rgba(0, 0, 0, ${darkenIntensityInput.value})`;
});

// 自动主题切换功能
const autoThemeCheckbox = document.getElementById('auto-theme');

autoThemeCheckbox.addEventListener('change', () => {
    if (autoThemeCheckbox.checked) {
        // 根据系统主题自动切换
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            body.classList.remove('light-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        // 恢复用户选择的主题
        loadThemePreference();
    }
});

// 搜索提示开关功能
const searchSuggestionsCheckbox = document.getElementById('search-suggestions');

searchSuggestionsCheckbox.addEventListener('change', () => {
    if (searchSuggestionsCheckbox.checked) {
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
});

// 自定义主题管理功能
const customThemesList = document.getElementById('custom-themes-list');
const addThemeButton = document.getElementById('add-theme');

// 加载自定义主题
function loadCustomThemes() {
    const themes = JSON.parse(localStorage.getItem('customThemes')) || [];
    customThemesList.innerHTML = themes.map(theme => `
        <div class="theme-item">
            <span>${theme.name}</span>
            <div>
                <button class="edit-button" data-theme="${theme.name}">编辑</button>
                <button class="delete-button" data-theme="${theme.name}">删除</button>
            </div>
        </div>
    `).join('');
}

// 添加新主题
addThemeButton.addEventListener('click', () => {
    const themeName = prompt('请输入主题名称：');
    if (themeName) {
        const themes = JSON.parse(localStorage.getItem('customThemes')) || [];
        themes.push({ name: themeName, colors: {}, sizes: {} });
        localStorage.setItem('customThemes', JSON.stringify(themes));
        loadCustomThemes();
    }
});

// 初始化
loadCustomThemes();