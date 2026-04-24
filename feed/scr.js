const API_URL = 'https://jsonplaceholder.typicode.com/photos';
    const LIMIT = 12;
    
    let currentPage = 1;
    let currentQuery = '';
    let isLoading = false;
    let hasMore = true;

    const wrapper = document.getElementById('gallery-wrapper');
    const container = document.getElementById('gallery-container');
    const searchInput = document.getElementById('search-input');
    const sentinel = document.getElementById('sentinel');
    
 
    const loader = document.getElementById('status-loading');
    const errorBox = document.getElementById('status-error');
    const emptyBox = document.getElementById('status-empty');


    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');


    function resetStatuses() {
        loader.style.display = 'none';
        errorBox.style.display = 'none';
        emptyBox.style.display = 'none';
    }

    async function fetchPhotos(page, query = '', append = false) {
        if (isLoading) return;
        
        isLoading = true;
        resetStatuses();
        loader.style.display = 'block';

        const url = new URL(API_URL);
        url.searchParams.append('_page', page);
        url.searchParams.append('_limit', LIMIT);
        if (query) url.searchParams.append('q', query);

        try {
            const response = await fetch(url);
            
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
            
            const photos = await response.json();

            if (!append) {
                const cards = container.querySelectorAll('.photo-card');
                cards.forEach(card => card.remove());
                wrapper.scrollLeft = 0;
            }

            if (photos.length === 0) {
                if (page === 1) emptyBox.style.display = 'block';
                hasMore = false;
            } else {
                renderPhotos(photos);
                hasMore = photos.length === LIMIT;
            }

        } catch (error) {
            errorBox.textContent = `Упс! ${error.message}`;
            errorBox.style.display = 'block';
            console.error(error);
        } finally {
            isLoading = false;
            loader.style.display = 'none';
        }
    }

    function renderPhotos(photos) {
        const fragment = document.createDocumentFragment();

        photos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            
            const imageUrl = `https://picsum.photos/seed/${photo.id}/300/400`;

            card.innerHTML = `
                <img src="${imageUrl}" alt="${photo.title}" loading="lazy">
                <div class="photo-card-info">
                    <p class="photo-title">${photo.title}</p>
                    <span class="photo-id">ID: ${photo.id}</span>
                </div>
            `;
            fragment.appendChild(card);
        });

        container.insertBefore(fragment, sentinel);
    }

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            currentQuery = e.target.value.trim();
            currentPage = 1;
            hasMore = true;
            fetchPhotos(currentPage, currentQuery, false);
        }, 400);
    });

    const observer = new IntersectionObserver((entries) => {
        
        if (entries[0].isIntersecting && hasMore && !isLoading && currentQuery === searchInput.value.trim()) {
            console.log('конец ленты грузим еще...');
            currentPage++;
            fetchPhotos(currentPage, currentQuery, true);
        }
    }, {
        root: wrapper,
        rootMargin: '0px 300px 0px 0px'
    });

    observer.observe(sentinel);

    const scrollAmount = 320;
    nextBtn.addEventListener('click', () => wrapper.scrollBy({ left: scrollAmount * 3, behavior: 'smooth' }));
    prevBtn.addEventListener('click', () => wrapper.scrollBy({ left: -scrollAmount * 3, behavior: 'smooth' }));


    fetchPhotos(currentPage);