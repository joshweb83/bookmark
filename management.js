document.addEventListener('DOMContentLoaded', () => {
    const addGroupForm = document.getElementById('add-group-form');
    const groupList = document.getElementById('group-list');
    const groupNameInput = document.getElementById('group-name');

    const MASTER_PASSWORD = '0070';
    let allData = {};

    const sampleData = {
        '나의 첫 북마크': {
            description: '자주 방문하는 사이트 모음',
            password: null,
            bookmarks: [
                { title: 'Google', url: 'https://www.google.com' },
                { title: 'Naver', url: 'https://www.naver.com' },
            ]
        },
        '재미있는 사이트': {
            description: '시간 날 때 둘러보는 곳',
            password: '1234',
            bookmarks: [
                { title: 'YouTube', url: 'https://www.youtube.com' },
            ]
        }
    };

    function migrateData(data) {
        let needsUpdate = false;
        for (const key in data) {
            if (Array.isArray(data[key])) { // Very old format
                data[key] = {
                    description: '',
                    password: null,
                    bookmarks: data[key]
                };
                needsUpdate = true;
            } else if (data[key].password === undefined) { // Old format without password
                data[key].password = null;
                needsUpdate = true;
            }
        }
        return needsUpdate;
    }

    function loadAllData() {
        const storedData = localStorage.getItem('bookmarkGroups');
        if (storedData) {
            allData = JSON.parse(storedData);
            if (migrateData(allData)) {
                saveAllData();
            }
        } else {
            allData = sampleData;
            saveAllData();
        }
    }

    function saveAllData() {
        localStorage.setItem('bookmarkGroups', JSON.stringify(allData));
    }

    function renderGroups() {
        groupList.innerHTML = '';
        if (Object.keys(allData).length === 0) {
            groupList.innerHTML = '<p class="text-center text-muted">아직 생성된 그룹이 없습니다. 새 그룹을 추가해보세요!</p>';
            return;
        }

        Object.keys(allData).forEach((groupName, index) => {
            const groupData = allData[groupName];
            const card = document.createElement('div');
            card.className = 'group-card';
            card.dataset.groupName = groupName;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column';

            // QR Code Toggle Button
            const qrToggleBtn = document.createElement('button');
            qrToggleBtn.className = 'qr-toggle-btn';
            qrToggleBtn.innerHTML = '&#9635;'; // QR code like icon
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
            qrContainer.id = `qrcode-container-${index}`;
            qrContainer.className = 'qr-container';

            qrToggleBtn.addEventListener('click', () => {
                // Check if QR code needs to be generated for the first time
                if (qrContainer.innerHTML === '') {
                    const groupURL = new URL(`viewer.html?group=${encodeURIComponent(groupName)}`, window.location.href).href;
                    new QRCode(qrContainer, {
                        text: groupURL,
                        width: 128,
                        height: 128,
                    });
                }
                // Toggle visibility
                qrContainer.classList.toggle('visible');
            });

            const groupURL = new URL(`viewer.html?group=${encodeURIComponent(groupName)}`, window.location.href).href;
            const viewLink = document.createElement('a');
            viewLink.href = groupURL;
            viewLink.className = 'btn btn-primary w-100 mb-2';
            viewLink.textContent = '보러가기';

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'd-flex';

            const renameBtn = document.createElement('button');
            renameBtn.className = 'btn btn-outline-secondary btn-sm w-100 me-1';
            renameBtn.textContent = '이름';
            renameBtn.addEventListener('click', () => renameGroup(groupName));

            const editDescBtn = document.createElement('button');
            editDescBtn.className = 'btn btn-outline-secondary btn-sm w-100 mx-1';
            editDescBtn.textContent = '설명';
            editDescBtn.addEventListener('click', () => editDescription(groupName));
            
            const passwordBtn = document.createElement('button');
            passwordBtn.textContent = '잠금';
            if (groupData.password) {
                passwordBtn.className = 'btn btn-outline-danger btn-sm w-100 mx-1';
            } else {
                passwordBtn.className = 'btn btn-outline-secondary btn-sm w-100 mx-1';
            }
            passwordBtn.addEventListener('click', () => editGroupPassword(groupName));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline-danger btn-sm w-100 ms-1';
            deleteBtn.textContent = '삭제';
            deleteBtn.addEventListener('click', () => deleteGroup(groupName));

            buttonGroup.appendChild(renameBtn);
            buttonGroup.appendChild(editDescBtn);
            buttonGroup.appendChild(passwordBtn);
            buttonGroup.appendChild(deleteBtn);
            
            cardBody.appendChild(qrToggleBtn);
            cardBody.appendChild(title);
            cardBody.appendChild(description);
            cardBody.appendChild(bookmarkCount);
            cardBody.appendChild(qrContainer); // Add hidden container
            cardBody.appendChild(viewLink);
            cardBody.appendChild(buttonGroup);
            card.appendChild(cardBody);
            groupList.appendChild(card);
        });
    }

    function addGroup(e) {
        e.preventDefault();
        const newGroupName = groupNameInput.value.trim();
        if (newGroupName && !allData.hasOwnProperty(newGroupName)) {
            let newPassword = null;
            if (confirm('이 그룹에 비밀번호를 설정하시겠습니까?')) {
                newPassword = prompt('새 비밀번호를 입력하세요:');
            }
            allData[newGroupName] = { description: '', password: newPassword || null, bookmarks: [] };
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