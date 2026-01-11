// ⚠️ ВАЖНО: Вставь сюда свои данные от Telegram бота
const TELEGRAM_BOT_TOKEN = 'ВАШ_ТОКЕН_БОТА'; // Получи у @BotFather
const TELEGRAM_CHAT_ID = 'ВАШ_CHAT_ID';       // Узнай у @userinfobot

// Товары магазина (можешь изменить)
const products = [
    {
        id: 1,
        name: 'Товар 1',
        description: 'Описание первого товара. Отличное качество!',
        price: 1500,
        emoji: '📱'
    },
    {
        id: 2,
        name: 'Товар 2',
        description: 'Описание второго товара. Хит продаж!',
        price: 2500,
        emoji: '💻'
    },
    {
        id: 3,
        name: 'Товар 3',
        description: 'Описание третьего товара. Новинка!',
        price: 3500,
        emoji: '🎧'
    },
    {
        id: 4,
        name: 'Товар 4',
        description: 'Описание четвёртого товара. Премиум!',
        price: 5000,
        emoji: '⌚'
    }
];

// Генерация карточек товаров
function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
            </div>
        </div>
    `).join('');
}

// Заполнение select товарами
function populateProductSelect() {
    const select = document.getElementById('product');
    select.innerHTML = '<option value="">-- Выберите товар --</option>' +
        products.map(p => `<option value="${p.name} (${p.price} ₽)">${p.name} - ${p.price.toLocaleString()} ₽</option>`).join('');
}


// Отправка в Telegram
async function sendToTelegram(data) {
    const message = `
🛒 *НОВАЯ ЗАЯВКА!*

👤 *Имя:* ${data.name}
📞 *Телефон:* ${data.phone}
📦 *Товар:* ${data.product}
💬 *Комментарий:* ${data.comment || 'Нет'}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    });

    return response.ok;
}

// Модальное окно
function showModal(message, isSuccess) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">${isSuccess ? '✅' : '❌'}</div>
        <h3 class="${isSuccess ? 'success' : 'error'}">${message}</h3>
    `;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Обработка формы
document.getElementById('telegramForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Отправка...';

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        product: document.getElementById('product').value,
        comment: document.getElementById('comment').value
    };

    try {
        const success = await sendToTelegram(formData);
        
        if (success) {
            showModal('Заявка отправлена! Мы скоро свяжемся с вами.', true);
            e.target.reset();
        } else {
            showModal('Ошибка отправки. Проверьте настройки бота.', false);
        }
    } catch (error) {
        console.error('Error:', error);
        showModal('Ошибка соединения. Попробуйте позже.', false);
    }

    btn.disabled = false;
    btn.textContent = 'Отправить заявку';
});

// Закрытие модалки по клику вне её
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

// Инициализация
renderProducts();
populateProductSelect();
