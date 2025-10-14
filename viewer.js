document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bookmarkList = document.getElementById('bookmark-list');
    const mainContent = document.getElementById('main-content');
    const addBookmarkForm = document.getElementById('add-bookmark-form');
    const addBookmarkModalEl = document.getElementById('addBookmarkModal');
    const addBookmarkModal = new bootstrap.Modal(addBookmarkModalEl);
    const modalTitle = document.getElementById('addBookmarkModalLabel');
    const groupTitleElement = document.getElementById('bookmark-group-title');
    const groupDescriptionElement = document.getElementById('bookmark-group-description');
    const unlockBtn = document.getElementById('unlock-group-btn');
    const addBtn = document.getElementById('add-bookmark-btn');

    // App State
    const MASTER_PASSWORD = '0070';
    const params = new URLSearchParams(window.location.search);
    const groupName = params.get('group');
    let allData = {};
    let currentGroup = { description: '', password: null, bookmarks: [] };
    let draggedItemIndex = null;
    let editingBookmarkIndex = null;
    let isGroupUnlocked = false;

    // Initialization
    if (!groupName) {
        alert('잘못된 접근입니다. 메인 페이지로 돌아갑니다.');
        window.location.href = 'index.html';
        return;
    }
    groupTitleElement.textContent = groupName;
    document.title = `${groupName} - 북마크 뷰어`;
    loadAllData();
    updateUIMode();
    if (currentGroup.bookmarks.length > 0) {
        showIframeForIndex(0);
    }

    // --- Data & State Functions ---
    function loadAllData() {
        const storedData = localStorage.getItem('bookmarkGroups');
        if (storedData) {
            allData = JSON.parse(storedData);
            currentGroup = allData[groupName] || { description: '설명을 찾을 수 없습니다.', bookmarks: [] };
        } else {
            allData = {};
            currentGroup = { description: '데이터를 찾을 수 없습니다.', bookmarks: [] };
        }
        groupDescriptionElement.textContent = currentGroup.description;

        // If group has no password, it's unlocked by default
        if (!currentGroup.password) {
            isGroupUnlocked = true;
        }
    }

    function saveAllData() {
        allData[groupName] = currentGroup;
        localStorage.setItem('bookmarkGroups', JSON.stringify(allData));
    }

    function updateUIMode() {
        if (isGroupUnlocked) {
            unlockBtn.style.display = 'none';
            addBtn.style.display = 'block';
        } else {
            unlockBtn.style.display = 'block';
            addBtn.style.display = 'none';
        }
        renderBookmarks(); // Re-render bookmarks to show/hide action buttons
    }

    // --- UI Rendering ---
    function renderBookmarks() {
        bookmarkList.innerHTML = '';
        currentGroup.bookmarks.forEach((bookmark, index) => {
            const li = document.createElement('li');
            li.setAttribute('draggable', 'true');
            li.dataset.index = index;

            li.addEventListener('dragstart', handleDragStart);
            li.addEventListener('dragend', handleDragEnd);
            li.addEventListener('dragover', handleDragOver);
            li.addEventListener('dragleave', handleDragLeave);
            li.addEventListener('drop', handleDrop);

            const titleSpan = document.createElement('span');
            titleSpan.className = 'bookmark-title';
            titleSpan.textContent = bookmark.title;
            titleSpan.addEventListener('click', () => showIframeForIndex(index));
            li.appendChild(titleSpan);

            if (isGroupUnlocked) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'bookmark-actions';

                const newTabBtn = document.createElement('button');
                newTabBtn.innerHTML = '&#x2197;';
                newTabBtn.title = '새 탭에서 열기';
                newTabBtn.addEventListener('click', (e) => { e.stopPropagation(); window.open(bookmark.url, '_blank'); });

                const editBtn = document.createElement('button');
                editBtn.innerHTML = '&#9998;';
                editBtn.title = '수정';
                editBtn.addEventListener('click', (e) => { e.stopPropagation(); editBookmark(index); });

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '&times;';
                deleteBtn.title = '삭제';
                deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteBookmark(index); });

                actionsDiv.appendChild(newTabBtn);
                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);
                li.appendChild(actionsDiv);
            }
            bookmarkList.appendChild(li);
        });
    }

    function showIframeForIndex(index) {
        const bookmark = currentGroup.bookmarks[index];
        if (!bookmark) return;

        if (bookmark.openInNewTab) {
            window.open(bookmark.url, '_blank');
            return;
        }

        const iframes = mainContent.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.style.display = 'none');

        let targetIframe = mainContent.querySelector(`iframe[data-index="${index}"]`);
        if (targetIframe) {
            targetIframe.style.display = 'block';
        } else {
            targetIframe = document.createElement('iframe');
            targetIframe.dataset.index = index;
            targetIframe.src = bookmark.url;
            targetIframe.className = 'w-100 h-100';
            targetIframe.setAttribute('frameborder', '0');
            mainContent.appendChild(targetIframe);
        }
        setActiveBookmark(index);
    }

    function setActiveBookmark(index) {
        const items = bookmarkList.querySelectorAll('li');
        items.forEach(item => item.classList.remove('active'));
        if (items[index]) {
            items[index].classList.add('active');
        }
    }

    // --- Event Handlers ---
    unlockBtn.addEventListener('click', () => {
        const inputPassword = prompt('그룹 비밀번호를 입력하세요:');
        if (inputPassword === currentGroup.password || inputPassword === MASTER_PASSWORD) {
            isGroupUnlocked = true;
            updateUIMode();
        } else if (inputPassword !== null) {
            alert('비밀번호가 틀렸습니다.');
        }
    });

    addBookmarkModalEl.addEventListener('hidden.bs.modal', () => {
        modalTitle.textContent = '새 북마크 추가';
        editingBookmarkIndex = null;
        addBookmarkForm.reset();
    });

    addBookmarkModalEl.addEventListener('shown.bs.modal', () => {
        if (editingBookmarkIndex === null) {
            document.getElementById('bookmark-title').focus();
        }
    });

    addBookmarkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookmarkData = {
            title: document.getElementById('bookmark-title').value,
            url: document.getElementById('bookmark-url').value,
            openInNewTab: document.getElementById('bookmark-new-tab').checked
        };

        if (editingBookmarkIndex !== null) {
            const oldBookmark = currentGroup.bookmarks[editingBookmarkIndex];
            if(oldBookmark.url !== bookmarkData.url) {
                const iframeToUpdate = mainContent.querySelector(`iframe[data-index="${editingBookmarkIndex}"]`);
                if(iframeToUpdate) iframeToUpdate.remove();
            }
            currentGroup.bookmarks[editingBookmarkIndex] = bookmarkData;
        } else {
            currentGroup.bookmarks.push(bookmarkData);
        }

        saveAllData();
        renderBookmarks();
        addBookmarkModal.hide();
    });

    // --- Action Functions ---
    function deleteBookmark(index) {
        if (confirm(`'${currentGroup.bookmarks[index].title}' 북마크를 삭제하시겠습니까?`)) {
            const iframeToRemove = mainContent.querySelector(`iframe[data-index="${index}"]`);
            if(iframeToRemove) iframeToRemove.remove();
            currentGroup.bookmarks.splice(index, 1);
            saveAllData();
            renderBookmarks();
        }
    }

    function editBookmark(index) {
        editingBookmarkIndex = index;
        const bookmark = currentGroup.bookmarks[index];
        modalTitle.textContent = '북마크 수정';
        document.getElementById('bookmark-title').value = bookmark.title;
        document.getElementById('bookmark-url').value = bookmark.url;
        document.getElementById('bookmark-new-tab').checked = bookmark.openInNewTab || false;
        addBookmarkModal.show();
    }

    // --- Drag and Drop Handlers (implementation is unchanged) ---
    function handleDragStart(e) { draggedItemIndex = parseInt(this.dataset.index); this.classList.add('dragging'); }
    function handleDragEnd(e) { this.classList.remove('dragging'); document.querySelectorAll('#bookmark-list li').forEach(item => item.classList.remove('drag-over-top', 'drag-over-bottom')); }
    function handleDragOver(e) { e.preventDefault(); const rect = this.getBoundingClientRect(); const halfway = rect.top + rect.height / 2; this.classList.remove('drag-over-top', 'drag-over-bottom'); if (e.clientY < halfway) { this.classList.add('drag-over-top'); } else { this.classList.add('drag-over-bottom'); } }
    function handleDragLeave(e) { this.classList.remove('drag-over-top', 'drag-over-bottom'); }
    function handleDrop(e) { e.preventDefault(); const droppedOnItemIndex = parseInt(this.dataset.index); const rect = this.getBoundingClientRect(); const halfway = rect.top + rect.height / 2; let newIndex = droppedOnItemIndex; if (e.clientY > halfway) newIndex = droppedOnItemIndex + 1; const draggedItem = currentGroup.bookmarks.splice(draggedItemIndex, 1)[0]; if (draggedItemIndex < newIndex) newIndex--; currentGroup.bookmarks.splice(newIndex, 0, draggedItem); mainContent.innerHTML = ''; saveAllData(); renderBookmarks(); }
});