const TG_LINK = 'https://t.me/shop333forever';

// Функция отправки в Telegram с передачей ID (Артикула)
function orderInTelegram(shoeId, shoeName, price, currency, selectedSize, warnElement, sizesContainer) {
  if (!selectedSize) {
    warnElement.textContent = '⚠️ Выберите размер';
    sizesContainer.classList.remove('shake');
    void sizesContainer.offsetWidth;
    sizesContainer.classList.add('shake');
    return;
  }
  
  // Здесь мы передаем ID в сообщении. В будущем для бота можно будет сделать ссылку:
  // window.open(`https://t.me/твой_бот?start=order_${shoeId}_size_${selectedSize}`, '_blank');
  
  const msg = encodeURIComponent(
    `🔥 Привет! Хочу оформить заказ:\n\n🆔 Артикул: ${shoeId}\n👟 Модель: ${shoeName}\n📏 Размер: ${selectedSize}\n💰 Цена: ${price} ${currency}\n\nПодскажите по наличию и доставке?`
  );
  window.open(`${TG_LINK}?text=${msg}`, '_blank');
}

// Генератор слайдера
function generateSliderHTML(photos, badge = '') {
  const photosData = encodeURIComponent(JSON.stringify(photos));
  const slides = photos.map((url, i) => `
    <div class="slider-slide">
      <img src="${url}" loading="lazy" alt="Sneaker" class="zoomable-img" data-photos="${photosData}" data-index="${i}">
    </div>
  `).join('');
  
  const dots = photos.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('');
  
  const arrows = photos.length > 1 ? `
    <button class="slider-arrow prev-arrow">&#10094;</button>
    <button class="slider-arrow next-arrow">&#10095;</button>
  ` : '';
  
  return `
    <div class="slider-container">
      ${badge ? `<div class="badge-sale">${badge}</div>` : ''}
      <div class="slider-track">${slides}</div>
      ${photos.length > 1 ? `<div class="slider-dots">${dots}</div>` : ''}
      ${arrows}
    </div>
  `;
}

// Инициализация точек скролла
function initSliderDots(container) {
  const track = container.querySelector('.slider-track');
  const dots = container.querySelectorAll('.dot');
  if (!track || dots.length === 0) return;

  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const slideWidth = track.offsetWidth;
    const activeIndex = Math.round(scrollLeft / slideWidth);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  });
}

// Рендер особенных блоков
function renderFeatured(containerId, shoeData) {
  const container = document.getElementById(containerId);
  if (!container || !shoeData) return;
  
  let selectedSize = null;
  container.innerHTML = `
    <div class="featured-card fade-up">
      ${generateSliderHTML(shoeData.photos, shoeData.badge)}
      <div class="feat-info">
        <h3>${shoeData.name}</h3>
        <p>${shoeData.desc}</p>
        <div class="sizes-label">Выберите размер (EU)</div>
        <div class="sizes-grid">
          ${shoeData.sizes.map(sz => `<button class="size-btn" data-size="${sz}">${sz}</button>`).join('')}
        </div>
        <div class="card-bottom">
          <div class="price-main">${shoeData.price} ${shoeData.currency}</div>
        </div>
        <button class="btn-buy">Оформить заказ в TG</button>
        <div class="warn-text"></div>
      </div>
    </div>
  `;

  initSliderDots(container);
  const sizesGrid = container.querySelector('.sizes-grid');
  const warnText = container.querySelector('.warn-text');
  
  sizesGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-btn')) {
      sizesGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');
      selectedSize = e.target.dataset.size;
      warnText.textContent = '';
    }
  });

  container.querySelector('.btn-buy').addEventListener('click', () => {
    orderInTelegram(shoeData.id, shoeData.name, shoeData.price, shoeData.currency, selectedSize, warnText, sizesGrid);
  });
}

// Рендер каталога
function renderCatalog(catalogData) {
  const grid = document.getElementById('cardsGrid');
  if (!grid || !catalogData) return;
  
  catalogData.forEach(shoe => {
    let selectedSize = null;
    const card = document.createElement('div');
    card.className = 'card fade-up';
    card.innerHTML = `
      ${generateSliderHTML(shoe.photos, shoe.onSale ? 'Sale' : '')}
      <div class="card-body">
        <div class="card-title">${shoe.name}</div>
        <div class="card-desc">${shoe.desc}</div>
        <div class="sizes-label">Размер (EU)</div>
        <div class="sizes-grid">
          ${shoe.sizes.map(sz => `<button class="size-btn" data-size="${sz}">${sz}</button>`).join('')}
        </div>
        <div class="card-bottom">
          <div class="price-main">${shoe.price} ${shoe.currency}</div>
        </div>
        <button class="btn-buy">Заказать сейчас</button>
        <div class="warn-text"></div>
      </div>
    `;

    initSliderDots(card);
    const sizesGrid = card.querySelector('.sizes-grid');
    const warnText = card.querySelector('.warn-text');

    sizesGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('size-btn')) {
        sizesGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedSize = e.target.dataset.size;
        warnText.textContent = '';
      }
    });

    card.querySelector('.btn-buy').addEventListener('click', () => {
      orderInTelegram(shoe.id, shoe.name, shoe.price, shoe.currency, selectedSize, warnText, sizesGrid);
    });

    grid.appendChild(card);
  });
}

// ФУЛЛСКРИН ГАЛЕРЕЯ
let currentModalPhotos =[];
let currentModalIndex = 0;
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const counter = document.getElementById('modal-counter');

function updateModalView() {
  if (!modalImg) return;
  modalImg.src = currentModalPhotos[currentModalIndex];
  if(counter) counter.textContent = `${currentModalIndex + 1} / ${currentModalPhotos.length}`;
}

document.addEventListener('click', (e) => {
  // Клик по фото (открыть на весь экран)
  if (e.target.classList.contains('zoomable-img')) {
    currentModalPhotos = JSON.parse(decodeURIComponent(e.target.dataset.photos));
    currentModalIndex = parseInt(e.target.dataset.index, 10);
    updateModalView();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Клик по стрелкам внутри карточки (скролл)
  const arrow = e.target.closest('.slider-arrow');
  if (arrow) {
    e.stopPropagation();
    const container = arrow.closest('.slider-container');
    const track = container.querySelector('.slider-track');
    const slideWidth = track.offsetWidth;
    if (arrow.classList.contains('next-arrow')) track.scrollBy({ left: slideWidth, behavior: 'smooth' });
    else if (arrow.classList.contains('prev-arrow')) track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
  }
});

// Закрытие фуллскрина
const closeBtn = document.getElementById('modal-close');
if(closeBtn) closeBtn.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target === modalImg) closeModal();
});

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

const nextBtn = document.getElementById('modal-next');
const prevBtn = document.getElementById('modal-prev');
if(nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); currentModalIndex = (currentModalIndex + 1) % currentModalPhotos.length; updateModalView(); });
if(prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); currentModalIndex = (currentModalIndex - 1 + currentModalPhotos.length) % currentModalPhotos.length; updateModalView(); });

// ЗАГРУЗКА БАЗЫ ДАННЫХ ПРИ СТАРТЕ
document.addEventListener('DOMContentLoaded', () => {
  fetch('database.json')
    .then(response => {
      if (!response.ok) throw new Error('Ошибка загрузки базы данных');
      return response.json();
    })
    .then(data => {
      renderFeatured('featuredBlock1', data.featured_1);
      renderFeatured('featuredBlock2', data.featured_2);
      renderCatalog(data.catalog);

      // Анимация при скролле (инициализируем после загрузки карточек)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    })
    .catch(error => console.error(error));
});