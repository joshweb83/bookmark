document.addEventListener('DOMContentLoaded', () => {
    const addGroupForm = document.getElementById('add-group-form');
    const groupList = document.getElementById('group-list');
    const groupNameInput = document.getElementById('group-name');

    const MASTER_PASSWORD = '0070';
    let allData = {};
    let categories = [];

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

    function renderGroups() {
        groupList.innerHTML = '';
        if (Object.keys(allData).length === 0) {
            groupList.innerHTML = '<p class="text-center text-muted">아직 생성된 그룹이 없습니다. 새 그룹을 추가해보세요!</p>';
            return;
        }

        // Group bookmarks by category
        const groupsByCategory = {};
        const uncategorized = [];

        Object.keys(allData).forEach(groupName => {
            const groupData = allData[groupName];
            if (groupData.category && categories.includes(groupData.category)) {
                if (!groupsByCategory[groupData.category]) {
                    groupsByCategory[groupData.category] = [];
                }
                groupsByCategory[groupData.category].push(groupName);
            } else {
                uncategorized.push(groupName);
            }
        });

        // Render categories
        categories.forEach(categoryName => {
            if (groupsByCategory[categoryName] && groupsByCategory[categoryName].length > 0) {
                renderCategory(categoryName, groupsByCategory[categoryName]);
            }
        });

        // Render uncategorized groups
        if (uncategorized.length > 0) {
            renderCategory('미분류', uncategorized);
        }
    }

    function renderCategory(categoryName, groupNames) {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section mb-4';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header d-flex justify-content-between align-items-center mb-3';

        const headerLeft = document.createElement('div');
        headerLeft.className = 'd-flex align-items-center';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-sm btn-link text-decoration-none me-2 category-toggle';
        toggleBtn.innerHTML = '▼';
        toggleBtn.title = '접기/펼치기';

        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title mb-0';
        categoryTitle.textContent = `${categoryName} (${groupNames.length})`;

        headerLeft.appendChild(toggleBtn);
        headerLeft.appendChild(categoryTitle);
        categoryHeader.appendChild(headerLeft);

        if (categoryName !== '미분류') {
            const categoryActions = document.createElement('div');

            const renameCategoryBtn = document.createElement('button');
            renameCategoryBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            renameCategoryBtn.textContent = '이름 변경';
            renameCategoryBtn.addEventListener('click', () => renameCategory(categoryName));

            const deleteCategoryBtn = document.createElement('button');
            deleteCategoryBtn.className = 'btn btn-sm btn-outline-danger';
            deleteCategoryBtn.textContent = '카테고리 삭제';
            deleteCategoryBtn.addEventListener('click', () => deleteCategory(categoryName));

            categoryActions.appendChild(renameCategoryBtn);
            categoryActions.appendChild(deleteCategoryBtn);
            categoryHeader.appendChild(categoryActions);
        }

        const categoryContent = document.createElement('div');
        categoryContent.className = 'category-content';

        const groupGrid = document.createElement('div');
        groupGrid.className = 'group-grid';

        groupNames.forEach((groupName) => {
            const groupData = allData[groupName];
            const card = createGroupCard(groupName, groupData);
            groupGrid.appendChild(card);
        });

        // Toggle collapse/expand
        toggleBtn.addEventListener('click', () => {
            categoryContent.classList.toggle('collapsed');
            toggleBtn.innerHTML = categoryContent.classList.contains('collapsed') ? '▶' : '▼';
        });

        categoryContent.appendChild(groupGrid);
        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(categoryContent);
        groupList.appendChild(categorySection);
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
            renderGroups();
            groupNameInput.value = '';
        } else if (allData.hasOwnProperty(newGroupName)){
            alert('이미 존재하는 그룹 이름입니다.');
        } else {
            alert('그룹 이름을 입력해주세요.');
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
        renderGroups();
    }

    // 초기화
    addGroupForm.addEventListener('submit', addGroup);
    loadAllData();
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