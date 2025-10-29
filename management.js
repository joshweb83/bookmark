document.addEventListener('DOMContentLoaded', () => {
    const addGroupForm = document.getElementById('add-group-form');
    const groupList = document.getElementById('group-list');
    const groupNameInput = document.getElementById('group-name');

    const MASTER_PASSWORD = '0070';
    let allData = {};
    let categories = [];
    let selectedCategory = 'all'; // 'all' or category name

    const sampleData = {
        'AI 챗봇 모음': {
            description: 'ChatGPT, Claude 등 AI 챗봇',
            password: null,
            category: '챗봇',
            bookmarks: [
                { title: 'ChatGPT', url: 'https://chat.openai.com' },
                { title: 'Claude', url: 'https://claude.ai' },
            ]
        },
        '개발 도구': {
            description: '코딩 관련 사이트',
            password: null,
            category: '코딩',
            bookmarks: [
                { title: 'GitHub', url: 'https://github.com' },
                { title: 'Stack Overflow', url: 'https://stackoverflow.com' },
            ]
        }
    };

    const sampleCategories = ['사진', '영상', '챗봇', '음악', '음성', '코딩', '자동화'];

    function migrateData(data) {
        let needsUpdate = false;
        for (const key in data) {
            if (Array.isArray(data[key])) { // Very old format
                data[key] = {
                    description: '',
                    password: null,
                    category: null,
                    bookmarks: data[key]
                };
                needsUpdate = true;
            } else if (data[key].password === undefined) { // Old format without password
                data[key].password = null;
                needsUpdate = true;
            }
            if (data[key].category === undefined) { // Old format without category
                data[key].category = null;
                needsUpdate = true;
            }
        }
        return needsUpdate;
    }

    function loadAllData() {
        const storedData = localStorage.getItem('bookmarkGroups');
        const storedCategories = localStorage.getItem('bookmarkCategories');

        if (storedData) {
            allData = JSON.parse(storedData);
            if (migrateData(allData)) {
                saveAllData();
            }
        } else {
            allData = sampleData;
            saveAllData();
        }

        if (storedCategories) {
            categories = JSON.parse(storedCategories);
        } else {
            categories = sampleCategories;
            saveCategories();
        }
    }

    function saveAllData() {
        localStorage.setItem('bookmarkGroups', JSON.stringify(allData));
    }

    function saveCategories() {
        localStorage.setItem('bookmarkCategories', JSON.stringify(categories));
    }

    function renderCategoryTabs() {
        const categoryTabsContainer = document.getElementById('category-tabs');
        categoryTabsContainer.innerHTML = '';

        // All tab
        const allTab = document.createElement('button');
        allTab.className = `category-tab ${selectedCategory === 'all' ? 'active' : ''}`;
        allTab.textContent = '전체';
        allTab.addEventListener('click', () => {
            selectedCategory = 'all';
            renderCategoryTabs();
            renderGroups();
        });
        categoryTabsContainer.appendChild(allTab);

        // Category tabs
        categories.forEach(categoryName => {
            const tab = document.createElement('button');
            tab.className = `category-tab ${selectedCategory === categoryName ? 'active' : ''}`;
            tab.textContent = categoryName;
            tab.addEventListener('click', () => {
                selectedCategory = categoryName;
                renderCategoryTabs();
                renderGroups();
            });

            // Right-click for category actions
            tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (confirm(`'${categoryName}' 카테고리를 관리하시겠습니까?\n\n확인: 이름 변경\n취소: 삭제`)) {
                    renameCategory(categoryName);
                } else {
                    deleteCategory(categoryName);
                }
            });

            categoryTabsContainer.appendChild(tab);
        });

        // Uncategorized tab
        const uncategorizedCount = Object.values(allData).filter(g => !g.category).length;
        if (uncategorizedCount > 0) {
            const uncategorizedTab = document.createElement('button');
            uncategorizedTab.className = `category-tab ${selectedCategory === 'uncategorized' ? 'active' : ''}`;
            uncategorizedTab.textContent = '미분류';
            uncategorizedTab.addEventListener('click', () => {
                selectedCategory = 'uncategorized';
                renderCategoryTabs();
                renderGroups();
            });
            categoryTabsContainer.appendChild(uncategorizedTab);
        }
    }

    function renderGroups() {
        groupList.innerHTML = '';

        if (Object.keys(allData).length === 0) {
            groupList.innerHTML = '<p class="text-center text-muted">아직 생성된 그룹이 없습니다. 새 그룹을 추가해보세요!</p>';
            return;
        }

        // Filter groups by selected category
        const filteredGroups = Object.keys(allData).filter(groupName => {
            const groupData = allData[groupName];
            if (selectedCategory === 'all') {
                return true;
            } else if (selectedCategory === 'uncategorized') {
                return !groupData.category || !categories.includes(groupData.category);
            } else {
                return groupData.category === selectedCategory;
            }
        });

        if (filteredGroups.length === 0) {
            groupList.innerHTML = '<p class="text-center text-muted">이 카테고리에 그룹이 없습니다.</p>';
            return;
        }

        // Render filtered groups
        filteredGroups.forEach(groupName => {
            const groupData = allData[groupName];
            const card = createGroupCard(groupName, groupData);
            groupList.appendChild(card);
        });
    }

    function createGroupCard(groupName, groupData) {
        const card = document.createElement('div');
        card.className = 'group-card';
        card.dataset.groupName = groupName;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column';

        // QR Code Toggle Button
        const qrToggleBtn = document.createElement('button');
        qrToggleBtn.className = 'qr-toggle-btn';
        qrToggleBtn.innerHTML = '&#9635;';
        qrToggleBtn.title = 'QR코드 보기/숨기기';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = groupName;

        const description = document.createElement('p');
        description.className = 'card-text text-muted small';
        description.textContent = groupData.description || '설명이 없습니다.';

        const bookmarkCount = document.createElement('p');
        bookmarkCount.className = 'card-text text-muted small flex-grow-1';
        bookmarkCount.textContent = `북마크 ${groupData.bookmarks.length}개`;

        // Hidden QR Code Container
        const qrContainer = document.createElement('div');
        qrContainer.className = 'qr-container';

        qrToggleBtn.addEventListener('click', () => {
            if (qrContainer.innerHTML === '') {
                const groupURL = new URL(`viewer.html?group=${encodeURIComponent(groupName)}`, window.location.href).href;
                new QRCode(qrContainer, {
                    text: groupURL,
                    width: 128,
                    height: 128,
                });
            }
            qrContainer.classList.toggle('visible');
        });

        const groupURL = new URL(`viewer.html?group=${encodeURIComponent(groupName)}`, window.location.href).href;
        const viewLink = document.createElement('a');
        viewLink.href = groupURL;
        viewLink.className = 'btn btn-primary w-100 mb-2';
        viewLink.textContent = '보러가기';

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'd-flex flex-wrap gap-1';

        const renameBtn = document.createElement('button');
        renameBtn.className = 'btn btn-outline-secondary btn-sm flex-fill';
        renameBtn.textContent = '이름';
        renameBtn.addEventListener('click', () => renameGroup(groupName));

        const editDescBtn = document.createElement('button');
        editDescBtn.className = 'btn btn-outline-secondary btn-sm flex-fill';
        editDescBtn.textContent = '설명';
        editDescBtn.addEventListener('click', () => editDescription(groupName));

        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'btn btn-outline-info btn-sm flex-fill';
        categoryBtn.textContent = '분류';
        categoryBtn.addEventListener('click', () => changeGroupCategory(groupName));

        const passwordBtn = document.createElement('button');
        passwordBtn.textContent = '잠금';
        if (groupData.password) {
            passwordBtn.className = 'btn btn-outline-danger btn-sm flex-fill';
        } else {
            passwordBtn.className = 'btn btn-outline-secondary btn-sm flex-fill';
        }
        passwordBtn.addEventListener('click', () => editGroupPassword(groupName));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-outline-danger btn-sm flex-fill';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteGroup(groupName));

        buttonGroup.appendChild(renameBtn);
        buttonGroup.appendChild(editDescBtn);
        buttonGroup.appendChild(categoryBtn);
        buttonGroup.appendChild(passwordBtn);
        buttonGroup.appendChild(deleteBtn);

        cardBody.appendChild(qrToggleBtn);
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(bookmarkCount);
        cardBody.appendChild(qrContainer);
        cardBody.appendChild(viewLink);
        cardBody.appendChild(buttonGroup);
        card.appendChild(cardBody);

        return card;
    }

    function addGroup(e) {
        e.preventDefault();
        const newGroupName = groupNameInput.value.trim();
        if (newGroupName && !allData.hasOwnProperty(newGroupName)) {
            // Select category
            let categoryOptions = '미분류\n' + categories.join('\n');
            const selectedCategory = prompt(`카테고리를 선택하세요 (선택 안함 = 미분류):\n\n${categoryOptions}`);
            let category = null;
            if (selectedCategory && selectedCategory.trim() !== '' && selectedCategory !== '미분류') {
                if (categories.includes(selectedCategory.trim())) {
                    category = selectedCategory.trim();
                } else {
                    if (confirm(`'${selectedCategory}' 카테고리가 없습니다. 새로 만드시겠습니까?`)) {
                        categories.push(selectedCategory.trim());
                        saveCategories();
                        category = selectedCategory.trim();
                    }
                }
            }

            let newPassword = null;
            if (confirm('이 그룹에 비밀번호를 설정하시겠습니까?')) {
                newPassword = prompt('새 비밀번호를 입력하세요:');
            }
            allData[newGroupName] = {
                description: '',
                password: newPassword || null,
                category: category,
                bookmarks: []
            };
            saveAllData();
            renderCategoryTabs();
            renderGroups();
            groupNameInput.value = '';
        } else if (allData.hasOwnProperty(newGroupName)){
            alert('이미 존재하는 그룹 이름입니다.');
        } else {
            alert('그룹 이름을 입력해주세요.');
        }
    }

    function addCategory() {
        const newCategoryName = prompt('새 카테고리 이름을 입력하세요:');
        if (newCategoryName && newCategoryName.trim() !== '') {
            const trimmedName = newCategoryName.trim();
            if (categories.includes(trimmedName)) {
                alert('이미 존재하는 카테고리 이름입니다.');
                return;
            }
            categories.push(trimmedName);
            saveCategories();
            renderCategoryTabs();
        }
    }

    function deleteGroup(groupName) {
        const groupData = allData[groupName];
        if (groupData.password) {
            const inputPassword = prompt('이 그룹은 비밀번호로 보호되어 있습니다. 삭제하려면 비밀번호를 입력하세요.');
            if (inputPassword !== groupData.password && inputPassword !== MASTER_PASSWORD) {
                if (inputPassword !== null) alert('비밀번호가 틀렸습니다.');
                return;
            }
        }

        if (confirm(`'${groupName}' 그룹을 정말 삭제하시겠습니까? 그룹 안의 모든 북마크가 사라집니다.`)) {
            delete allData[groupName];
            saveAllData();
            renderCategoryTabs();
            renderGroups();
        }
    }

    function renameGroup(oldName) {
        const newName = prompt(`'${oldName}' 그룹의 새 이름을 입력하세요.`, oldName);
        if (newName && newName.trim() !== '' && newName !== oldName) {
            if(allData.hasOwnProperty(newName)) {
                alert('이미 존재하는 그룹 이름입니다.');
                return;
            }
            allData[newName] = allData[oldName];
            delete allData[oldName];
            saveAllData();
            renderGroups();
        }
    }

    function editDescription(groupName) {
        const currentDescription = allData[groupName].description;
        const newDescription = prompt(`'${groupName}' 그룹의 새 설명을 입력하세요.`, currentDescription);
        if (newDescription !== null) {
            allData[groupName].description = newDescription;
            saveAllData();
            renderGroups();
        }
    }

    function editGroupPassword(groupName) {
        const groupData = allData[groupName];

        // If a password exists, verify it first.
        if (groupData.password) {
            const inputPassword = prompt('잠금을 해제하시려면 비밀번호를 입력하세요:');
            if (inputPassword !== groupData.password && inputPassword !== MASTER_PASSWORD) {
                if (inputPassword !== null) alert('비밀번호가 틀렸습니다. 잠금을 해제할 수 없습니다.');
                return; // Abort if password is wrong or prompt is cancelled
            }
        }

        // Proceed to set a new password
        const newPassword = prompt(`'${groupName}' 그룹의 새 비밀번호를 입력하세요 (없애려면 비워두세요).`);
        if (newPassword !== null) { // User did not cancel the new password prompt
            allData[groupName].password = newPassword || null;
            saveAllData();
            renderGroups();
        }
    }

    function changeGroupCategory(groupName) {
        let categoryOptions = '미분류\n' + categories.join('\n');
        const currentCategory = allData[groupName].category || '미분류';
        const selectedCategory = prompt(`'${groupName}' 그룹의 카테고리를 선택하세요 (현재: ${currentCategory}):\n\n${categoryOptions}`);

        if (selectedCategory !== null) {
            let category = null;
            if (selectedCategory.trim() !== '' && selectedCategory !== '미분류') {
                if (categories.includes(selectedCategory.trim())) {
                    category = selectedCategory.trim();
                } else {
                    if (confirm(`'${selectedCategory}' 카테고리가 없습니다. 새로 만드시겠습니까?`)) {
                        categories.push(selectedCategory.trim());
                        saveCategories();
                        category = selectedCategory.trim();
                    }
                }
            }
            allData[groupName].category = category;
            saveAllData();
            renderCategoryTabs();
            renderGroups();
        }
    }

    function renameCategory(oldName) {
        const newName = prompt(`'${oldName}' 카테고리의 새 이름을 입력하세요.`, oldName);
        if (newName && newName.trim() !== '' && newName !== oldName) {
            if (categories.includes(newName.trim())) {
                alert('이미 존재하는 카테고리 이름입니다.');
                return;
            }
            // Update category in categories array
            const index = categories.indexOf(oldName);
            if (index !== -1) {
                categories[index] = newName.trim();
                saveCategories();
            }
            // Update all groups with this category
            Object.keys(allData).forEach(groupName => {
                if (allData[groupName].category === oldName) {
                    allData[groupName].category = newName.trim();
                }
            });
            saveAllData();
            renderCategoryTabs();
            renderGroups();
        }
    }

    function deleteCategory(categoryName) {
        if (!confirm(`'${categoryName}' 카테고리를 삭제하시겠습니까? 이 카테고리의 그룹들은 '미분류'로 이동됩니다.`)) {
            return;
        }
        // Remove from categories array
        const index = categories.indexOf(categoryName);
        if (index !== -1) {
            categories.splice(index, 1);
            saveCategories();
        }
        // Update all groups with this category to null
        Object.keys(allData).forEach(groupName => {
            if (allData[groupName].category === categoryName) {
                allData[groupName].category = null;
            }
        });
        saveAllData();
        selectedCategory = 'all'; // Reset to all after deleting category
        renderCategoryTabs();
        renderGroups();
    }

    // 초기화
    addGroupForm.addEventListener('submit', addGroup);
    document.getElementById('add-category-btn').addEventListener('click', addCategory);
    loadAllData();
    renderCategoryTabs();
    renderGroups();

    // 검색 기능
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        Object.keys(allData).forEach(groupName => {
            const groupData = allData[groupName];
            const card = groupList.querySelector(`[data-group-name="${groupName}"]`);
            if (!card) return;

            const titleMatch = groupName.toLowerCase().includes(searchTerm);
            const descriptionMatch = (groupData.description || '').toLowerCase().includes(searchTerm);
            const bookmarkMatch = groupData.bookmarks.some(bookmark => 
                bookmark.title.toLowerCase().includes(searchTerm)
            );

            if (titleMatch || descriptionMatch || bookmarkMatch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});