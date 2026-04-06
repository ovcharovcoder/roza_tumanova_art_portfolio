// Збираємо дані з HTML-атрибутів
const galleryContainer = document.getElementById('galleryGrid');
let currentFilter = 'all';
let showAll = false;
let currentModalIndex = 0;
let currentDisplayedItems = [];
let isTransitioning = false;

const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModalBtn');
const prevBtn = document.getElementById('prevPhotoBtn');
const nextBtn = document.getElementById('nextPhotoBtn');
const photoCounterSpan = document.getElementById('photoCounter');
const infoLocation = document.getElementById('infoLocation');
const infoDate = document.getElementById('infoDate');
const infoDescription = document.getElementById('infoDescription');
const toggleBtn = document.getElementById('toggleGalleryBtn');

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80;
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.pageYOffset - offset,
      behavior: 'smooth',
    });
  }
}
document
  .querySelectorAll('[data-nav="portfolio"]')
  .forEach(btn =>
    btn.addEventListener('click', () => scrollToSection('portfolioSection')),
  );
document
  .querySelectorAll('[data-nav="about"]')
  .forEach(btn =>
    btn.addEventListener('click', () => scrollToSection('aboutSection')),
  );
document
  .querySelectorAll('[data-nav="contact"]')
  .forEach(btn =>
    btn.addEventListener('click', () => scrollToSection('contactSection')),
  );

function getAllItems() {
  return Array.from(galleryContainer.querySelectorAll('.gallery-item'));
}

function getFilteredItems() {
  const allItems = getAllItems();
  if (currentFilter === 'all') return allItems;
  return allItems.filter(item => item.dataset.category === currentFilter);
}

function setCategoryAttributes() {
  // Встановлюємо категорії на основі індексу (для сумісності з фільтрами)
  const items = getAllItems();
  const categories = [
    'portrait',
    'portrait',
    'landscape',
    'landscape',
    'art',
    'portrait',
    'landscape',
    'art',
    'portrait',
    'landscape',
    'art',
    'portrait',
    'landscape',
    'portrait',
    'art',
    'landscape',
    'portrait',
    'art',
    'landscape',
    'portrait',
    'art',
    'landscape',
    'portrait',
    'art',
    'portrait',
    'landscape',
    'art',
    'portrait',
  ];
  items.forEach((item, idx) => {
    item.dataset.category = categories[idx % categories.length];
  });
}
setCategoryAttributes();

function getDefaultCount() {
  const w = window.innerWidth;
  if (w <= 550) return 8;
  if (w <= 900) return 12;
  return 16;
}
function getItemsToDisplay() {
  const filtered = getFilteredItems();
  if (showAll) return filtered;
  return filtered.slice(0, getDefaultCount());
}

function updateGalleryDisplay() {
  const toShow = getItemsToDisplay();
  currentDisplayedItems = toShow;
  const allItems = getAllItems();
  allItems.forEach(item => {
    item.style.display = 'none';
  });
  toShow.forEach(item => {
    item.style.display = 'block';
  });
  const total = getFilteredItems().length;
  const limit = getDefaultCount();
  if (total <= limit) toggleBtn.style.display = 'none';
  else {
    toggleBtn.style.display = 'inline-block';
    toggleBtn.textContent = showAll ? 'Приховати' : 'Показати більше';
  }
}

function openModal(index) {
  if (!currentDisplayedItems.length) return;
  currentModalIndex = Math.min(
    Math.max(0, index),
    currentDisplayedItems.length - 1,
  );
  const item = currentDisplayedItems[currentModalIndex];
  const img = item.querySelector('img');
  modalImage.src = img.src;
  infoLocation.textContent = item.dataset.location || 'Німеччина, місто Берлін';
  infoDate.textContent = item.dataset.date || '22.04.2025';
  infoDescription.textContent =
    item.dataset.description ||
    'Світла історія про тиху красу міських вуличок та щирі емоції.';
  updateCounter();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  isTransitioning = false;
}
function updateCounter() {
  photoCounterSpan.textContent = `${currentModalIndex + 1} / ${currentDisplayedItems.length}`;
}

function nextPhoto() {
  if (!currentDisplayedItems.length || isTransitioning) return;
  isTransitioning = true;
  currentModalIndex = (currentModalIndex + 1) % currentDisplayedItems.length;
  const item = currentDisplayedItems[currentModalIndex];
  const img = item.querySelector('img');
  modalImage.style.transition = 'opacity 0.2s';
  modalImage.style.opacity = '0';
  setTimeout(() => {
    modalImage.src = img.src;
    infoLocation.textContent =
      item.dataset.location || 'Німеччина, місто Берлін';
    infoDate.textContent = item.dataset.date || '22.04.2025';
    infoDescription.textContent =
      item.dataset.description ||
      'Світла історія про тиху красу міських вуличок та щирі емоції.';
    modalImage.onload = () => {
      modalImage.style.opacity = '1';
      setTimeout(() => {
        isTransitioning = false;
        modalImage.style.transition = '';
      }, 200);
    };
    updateCounter();
  }, 180);
}

function prevPhoto() {
  if (!currentDisplayedItems.length || isTransitioning) return;
  isTransitioning = true;
  currentModalIndex =
    (currentModalIndex - 1 + currentDisplayedItems.length) %
    currentDisplayedItems.length;
  const item = currentDisplayedItems[currentModalIndex];
  const img = item.querySelector('img');
  modalImage.style.transition = 'opacity 0.2s';
  modalImage.style.opacity = '0';
  setTimeout(() => {
    modalImage.src = img.src;
    infoLocation.textContent =
      item.dataset.location || 'Німеччина, місто Берлін';
    infoDate.textContent = item.dataset.date || '22.04.2025';
    infoDescription.textContent =
      item.dataset.description ||
      'Світла історія про тиху красу міських вуличок та щирі емоції.';
    modalImage.onload = () => {
      modalImage.style.opacity = '1';
      setTimeout(() => {
        isTransitioning = false;
        modalImage.style.transition = '';
      }, 200);
    };
    updateCounter();
  }, 180);
}

function toggleShow() {
  const total = getFilteredItems().length;
  if (total <= getDefaultCount()) return;
  showAll = !showAll;
  updateGalleryDisplay();
  toggleBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function setFilter(filter) {
  currentFilter = filter;
  showAll = false;
  updateGalleryDisplay();
  document
    .querySelectorAll('.filter-btn')
    .forEach(btn =>
      btn.classList.toggle('active', btn.dataset.filter === filter),
    );
}

let resizeTimer;
function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!showAll) updateGalleryDisplay();
  }, 200);
}

// Додаємо обробники кліків для галереї
function attachClickHandlers() {
  const items = getAllItems();
  items.forEach((item, idx) => {
    item.removeEventListener('click', item._clickHandler);
    const handler = () => {
      const currentItems = getItemsToDisplay();
      const index = currentItems.findIndex(i => i === item);
      if (index !== -1) openModal(index);
    };
    item._clickHandler = handler;
    item.addEventListener('click', handler);
  });
}

toggleBtn.addEventListener('click', toggleShow);
closeModalBtn.addEventListener('click', closeModal);
prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  prevPhoto();
});
nextBtn.addEventListener('click', e => {
  e.stopPropagation();
  nextPhoto();
});
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', e => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') {
    prevPhoto();
    e.preventDefault();
  }
  if (e.key === 'ArrowRight') {
    nextPhoto();
    e.preventDefault();
  }
});
window.addEventListener('resize', handleResize);
document
  .querySelectorAll('.filter-btn')
  .forEach(btn =>
    btn.addEventListener('click', () => setFilter(btn.dataset.filter)),
  );

updateGalleryDisplay();
attachClickHandlers();

const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px',
};
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, observerOptions);
observer.observe(document.querySelector('.profile-section'));
observer.observe(document.querySelector('.filter-wrapper'));

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('fade-out');
  }, 500);
});
