const TG_LINK = 'https://t.me/shop333forever';

// ДАННЫЕ ОБУВИ (Теперь с массивом фотографий)

// Блок 1: Хит продаж (Светлый)
const featuredShoe1 = {
  id: 101,
  name: 'Travis Scott x Air Jordan 1 Low',
  desc: 'Самый громкий релиз года. Обратный свуш, премиальная замша и идеальная детализация.',
  price: 2500,
  currency: 'руб',
  sizes: [40, 41, 42, 43, 44],
  badge: '🔥 Хит',
  photos:[
    'https://i.ibb.co.com/2YfTpH2V/photo-2026-04-23-16-49-59.jpg',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
  ]
};

// Блок 2: Лимитированный дроп (Темный)
const featuredShoe2 = {
  id: 102,
  name: 'Yeezy Boost 700 Wave Runner',
  desc: 'Легендарный силуэт Канье. Массивная подошва, рефлективные вставки. В наличии всего несколько пар.',
  price: 3200,
  currency: 'руб',
  sizes: [39, 40, 41],
  badge: '⚡ Limited',
  photos:[
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop'
  ]
};

// Каталог
const catalogShoes =[
  {
    id: 1,
    name: 'Nike Dunk Low Panda',
    desc: 'Абсолютная классика. Черно-белая расцветка, которая подходит под любой лук.',
    price: 1500,
    currency: 'руб',
    sizes:[37, 38, 39, 40, 41, 42],
    onSale: true,
    photos:[
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 2,
    name: 'New Balance 2002R Protection Pack',
    desc: 'Рваные края замши, винтажная эстетика и нереальный комфорт на каждый день.',
    price: 1800,
    currency: 'руб',
    sizes:[39, 40, 41, 42, 43],
    onSale: false,
    photos:[
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 3,
    name: 'Air Jordan 4 Retro Military Black',
    desc: 'Один из самых востребованных силуэтов в строгой черно-белой расцветке.',
    price: 2100,
    currency: 'руб',
    sizes:[40, 41, 42, 43, 44],
    onSale: true,
    photos:[
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=800&auto=format&fit=crop'
    ]
  }
];

// Функция заказа
function orderInTelegram(shoeName, price, currency, selectedSize, warnElement, sizesContainer) {
  if (!selectedSize) {
    warnElement.textContent = '⚠️ Выберите размер';
    sizesContainer.classList.remove('shake');
    void sizesContainer.offsetWidth; // reset animation
    sizesContainer.classList.add('shake');
    return;
  }
  const msg = encodeURIComponent(
    `🔥 Привет! Хочу заказать:\n\n👟 Модель: ${shoeName}\n📏 Размер: ${selectedSize}\n💰 Цена: ${price} ${currency}\n\nКак оформить доставку?`
  );
  window.open(`${TG_LINK}?text=${msg}`, '_blank');
}

// Генерация слайдера
// Генерация слайдера
function generateSliderHTML(photos, badge = '') {
  const photosData = encodeURIComponent(JSON.stringify(photos));
  
  const slides = photos.map((url, i) => `
    <div class="slider-slide">
      <img src="${url}" loading="lazy" alt="Sneaker" class="zoomable-img" data-photos="${photosData}" data-index="${i}">
    </div>
  `).join('');
  
  const dots = photos.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('');
  
  // Добавляем стрелки, если фоток больше 1
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

// Инициализация логики скролла для точек
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

// Отрисовка особенного блока
function renderFeatured(containerId, shoeData) {
  const container = document.getElementById(containerId);
  let selectedSize = null;

  const html = `
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
  container.innerHTML = html;

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
    orderInTelegram(shoeData.name, shoeData.price, shoeData.currency, selectedSize, warnText, sizesGrid);
  });
}

// Отрисовка каталога
function renderCatalog() {
  const grid = document.getElementById('cardsGrid');
  
  catalogShoes.forEach(shoe => {
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
      orderInTelegram(shoe.name, shoe.price, shoe.currency, selectedSize, warnText, sizesGrid);
    });

    grid.appendChild(card);
  });
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured('featuredBlock1', featuredShoe1);
  renderFeatured('featuredBlock2', featuredShoe2);
  renderCatalog();

  // Плавное появление блоков при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});

let currentModalPhotos =[];
let currentModalIndex = 0;

const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const counter = document.getElementById('modal-counter');

function updateModalView() {
  modalImg.src = currentModalPhotos[currentModalIndex];
  counter.textContent = `${currentModalIndex + 1} / ${currentModalPhotos.length}`;
}

// Открытие при клике на картинку
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('zoomable-img')) {
    currentModalPhotos = JSON.parse(decodeURIComponent(e.target.dataset.photos));
    currentModalIndex = parseInt(e.target.dataset.index, 10);
    updateModalView();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл сайта
  }
});

// Закрытие крестиком или кликом по фону
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target === modalImg) closeModal(); // Закрываем при тапе мимо стрелок
});

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Переключение стрелками
document.getElementById('modal-next').addEventListener('click', (e) => {
  e.stopPropagation();
  currentModalIndex = (currentModalIndex + 1) % currentModalPhotos.length;
  updateModalView();
});

document.getElementById('modal-prev').addEventListener('click', (e) => {
  e.stopPropagation();
  currentModalIndex = (currentModalIndex - 1 + currentModalPhotos.length) % currentModalPhotos.length;
  updateModalView();
});

// ЛОГИКА СТРЕЛОК ВНУТРИ КАРТОЧЕК
document.addEventListener('click', (e) => {
  const arrow = e.target.closest('.slider-arrow');
  if (arrow) {
    e.stopPropagation(); // Чтобы клик по стрелке не открывал полноэкранное фото
    
    const container = arrow.closest('.slider-container');
    const track = container.querySelector('.slider-track');
    const slideWidth = track.offsetWidth;

    // Скроллим на ширину одной картинки вправо или влево
    if (arrow.classList.contains('next-arrow')) {
      track.scrollBy({ left: slideWidth, behavior: 'smooth' });
    } else if (arrow.classList.contains('prev-arrow')) {
      track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    }
  }
});