// База даних послуг
const servicesData = [
    {
        id: 1,
        name: "Жіночий стрижка та укладка",
        category: "hair",
        price: 900,
        duration: "60 хв",
        desc: "Консультація, миття голови з доглядом, моделююча стрижка та укладка феном.",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        name: "Складне фарбування (Airtouch / Balayage)",
        category: "hair",
        price: 2800,
        duration: "180 хв",
        desc: "Сучасні техніки освітлення з м'яким переходом та тонуванням преміум-барвником.",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        name: "Комбінований манікюр з покриттям",
        category: "nails",
        price: 750,
        duration: "90 хв",
        desc: "Безпечна обробка кутикули, вирівнювання нігтьової пластини та покриття гель-лаком.",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        name: "СПА-педикюр з доглядом",
        category: "nails",
        price: 950,
        duration: "90 хв",
        desc: "Глибокий догляд за стопами, пілінг, легкий масаж та покриття на вибір.",
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 5,
        name: "Чистка обличчя + Зволожуюча маска",
        category: "face",
        price: 1200,
        duration: "75 хв",
        desc: "Глибоке очищення шкіри, ультразвуковий пілінг та заспокійливий догляд.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 6,
        name: "Розслабляючий арома-масаж",
        category: "spa",
        price: 1400,
        duration: "60 хв",
        desc: "Масаж усього тіла з натуральними ефірними оліями для зняття напруги та стресу.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600"
    }
];

// База даних майстрів
const mastersData = [
    {
        id: 1,
        name: "Олена Франко",
        role: "Топ-стиліст по волоссю",
        avatar: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=300"
    },
    {
        id: 2,
        name: "Тетяна Бондар",
        role: "Майстер нігтьового сервісу",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
    },
    {
        id: 3,
        name: "Софія Руденко",
        role: "Косметолог-естетист",
        avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=300"
    }
];

// Змінні стану онлайн-запису
let currentStep = 1;
let selectedBooking = {
    service: null,
    master: null,
    date: null,
    time: null,
    client: {}
};

// Ініціалізація після завантаження сторінки
document.addEventListener("DOMContentLoaded", () => {
    renderServices("all");
    renderMasters();
    setupEventListeners();
    initDateInput();
});

// Відображення карт послуг на сторінці
function renderServices(categoryFilter) {
    const container = document.getElementById("servicesGrid");
    container.innerHTML = "";

    const filtered = categoryFilter === "all" 
        ? servicesData 
        : servicesData.filter(s => s.category === categoryFilter);

    filtered.forEach(service => {
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML = `
            <img src="${service.image}" alt="${service.name}" class="service-img">
            <div class="service-content">
                <h3 class="service-title">${service.name}</h3>
                <p class="service-desc">${service.desc}</p>
                <div class="service-meta">
                    <span class="service-price">${service.price} грн</span>
                    <span class="service-duration"><i class="fa-regular fa-clock"></i> ${service.duration}</span>
                </div>
                <button class="btn btn-outline" onclick="openBookingWithService(${service.id})">Обрати та записатись</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Відображення карт майстрів
function renderMasters() {
    const container = document.getElementById("mastersGrid");
    container.innerHTML = "";

    mastersData.forEach(master => {
        const card = document.createElement("div");
        card.className = "master-card";
        card.innerHTML = `
            <img src="${master.avatar}" alt="${master.name}" class="master-avatar">
            <h3 class="master-name">${master.name}</h3>
            <p class="master-role">${master.role}</p>
            <button class="btn btn-outline" onclick="openBookingWithMaster(${master.id})">Записатися до майстра</button>
        `;
        container.appendChild(card);
    });
}

// Налаштування слухачів подій
function setupEventListeners() {
    // Перемикання табів послуг
    const tabs = document.querySelectorAll("#serviceTabs .tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderServices(tab.dataset.category);
        });
    });

    // Відкриття та закриття модального вікна
    document.querySelectorAll(".open-booking-btn").forEach(btn => {
        btn.addEventListener("click", () => openBookingModal());
    });
    document.getElementById("closeModal").addEventListener("click", closeBookingModal);
    document.querySelector(".modal-overlay").addEventListener("click", closeBookingModal);

    // Навігація по кроках модального вікна
    document.getElementById("nextStepBtn").addEventListener("click", nextStep);
    document.getElementById("prevStepBtn").addEventListener("click", prevStep);
    document.getElementById("finishBookingBtn").addEventListener("click", closeBookingModal);

    // Мобільне меню
    document.getElementById("mobileToggle").addEventListener("click", () => {
        document.getElementById("navMenu").classList.toggle("active");
    });

    // Підписка на розсилку
    document.getElementById("newsletterForm").addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Дякуємо за підписку!");
        e.target.reset();
    });
}

// Початкова дата для календаря
function initDateInput() {
    const dateInput = document.getElementById("bookingDate");
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
    selectedBooking.date = today;

    dateInput.addEventListener("change", (e) => {
        selectedBooking.date = e.target.value;
        generateTimeSlots();
    });
}

// Відкриття модального вікна
function openBookingModal() {
    currentStep = 1;
    updateStepUI();
    renderModalServices();
    renderModalMasters();
    document.getElementById("bookingModal").classList.add("active");
}

function closeBookingModal() {
    document.getElementById("bookingModal").classList.remove("active");
}

// Відкриття з обраною послугою
function openBookingWithService(serviceId) {
    selectedBooking.service = servicesData.find(s => s.id === serviceId);
    openBookingModal();
    nextStep();
}

// Відкриття з обраним майстром
function openBookingWithMaster(masterId) {
    selectedBooking.master = mastersData.find(m => m.id === masterId);
    openBookingModal();
}

// Логіка кроків модального вікна
function updateStepUI() {
    document.querySelectorAll(".booking-step").forEach(step => step.classList.remove("active"));
    const currentStepEl = document.getElementById(`step${currentStep}`);
    if (currentStepEl) currentStepEl.classList.add("active");

    // Індикатор кроків
    document.querySelectorAll(".step-dot").forEach((dot, index) => {
        if (index + 1 <= currentStep) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });

    // Кнопки навігації
    const prevBtn = document.getElementById("prevStepBtn");
    const nextBtn = document.getElementById("nextStepBtn");
    const footer = document.getElementById("modalFooter");

    if (currentStep === 5) {
        footer.style.display = "none";
        return;
    }

    footer.style.display = "flex";
    prevBtn.style.display = currentStep > 1 ? "block" : "none";
    nextBtn.innerText = currentStep === 4 ? "Підтвердити запис" : "Далі";
}

function nextStep() {
    if (currentStep === 1 && !selectedBooking.service) {
        showToast("Будь ласка, оберіть послугу!");
        return;
    }
    if (currentStep === 2 && !selectedBooking.master) {
        showToast("Будь ласка, оберіть майстра!");
        return;
    }
    if (currentStep === 3 && !selectedBooking.time) {
        showToast("Будь ласка, оберіть час!");
        return;
    }
    if (currentStep === 4) {
        const name = document.getElementById("clientName").value.trim();
        const phone = document.getElementById("clientPhone").value.trim();

        if (!name || !phone) {
            showToast("Заповніть обов'язкові поля!");
            return;
        }

        selectedBooking.client = {
            name,
            phone,
            comment: document.getElementById("clientComment").value
        };

        submitBooking();
        return;
    }

    currentStep++;
    if (currentStep === 3) generateTimeSlots();
    updateStepUI();
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
}

// Рендеринг послуг у модальному вікні
function renderModalServices() {
    const container = document.getElementById("modalServicesList");
    container.innerHTML = "";

    servicesData.forEach(service => {
        const isSelected = selectedBooking.service?.id === service.id;
        const item = document.createElement("div");
        item.className = `modal-item ${isSelected ? 'selected' : ''}`;
        item.style.cssText = `
            padding: 12px;
            border: 1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'};
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: ${isSelected ? 'var(--bg-card)' : 'transparent'};
        `;
        item.innerHTML = `
            <div>
                <strong>${service.name}</strong>
                <div style="font-size: 12px; color: var(--text-muted);">${service.duration}</div>
            </div>
            <span style="font-weight: 600; color: var(--accent);">${service.price} грн</span>
        `;
        item.addEventListener("click", () => {
            selectedBooking.service = service;
            renderModalServices();
        });
        container.appendChild(item);
    });
}

// Рендеринг майстрів у модальному вікні
function renderModalMasters() {
    const container = document.getElementById("modalMastersList");
    container.innerHTML = "";

    mastersData.forEach(master => {
        const isSelected = selectedBooking.master?.id === master.id;
        const item = document.createElement("div");
        item.className = `modal-item ${isSelected ? 'selected' : ''}`;
        item.style.cssText = `
            padding: 12px;
            border: 1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'};
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            background-color: ${isSelected ? 'var(--bg-card)' : 'transparent'};
        `;
        item.innerHTML = `
            <img src="${master.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <div>
                <strong>${master.name}</strong>
                <div style="font-size: 12px; color: var(--text-muted);">${master.role}</div>
            </div>
        `;
        item.addEventListener("click", () => {
            selectedBooking.master = master;
            renderModalMasters();
        });
        container.appendChild(item);
    });
}

// Генерація часових слотів
function generateTimeSlots() {
    const container = document.getElementById("timeSlots");
    container.innerHTML = "";
    const slots = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

    slots.forEach(slot => {
        const btn = document.createElement("button");
        btn.className = `time-slot ${selectedBooking.time === slot ? 'selected' : ''}`;
        btn.innerText = slot;
        btn.addEventListener("click", () => {
            selectedBooking.time = slot;
            generateTimeSlots();
        });
        container.appendChild(btn);
    });
}

// Завершення підтвердження запису
function submitBooking() {
    currentStep = 5;
    document.querySelectorAll(".booking-step").forEach(step => step.classList.remove("active"));
    document.getElementById("stepSuccess").classList.add("active");
    updateStepUI();

    const receipt = document.getElementById("bookingReceipt");
    receipt.innerHTML = `
        <p><strong>Послуга:</strong> ${selectedBooking.service.name}</p>
        <p><strong>Майстер:</strong> ${selectedBooking.master.name}</p>
        <p><strong>Дата та час:</strong> ${selectedBooking.date} о ${selectedBooking.time}</p>
        <p><strong>Клієнт:</strong> ${selectedBooking.client.name} (${selectedBooking.client.phone})</p>
        <hr style="margin: 10px 0; border: none; border-top: 1px solid var(--border-color);">
        <p style="font-size: 18px; font-weight: 700; color: var(--accent);">До сплати: ${selectedBooking.service.price} грн</p>
    `;
}

// Функція сповіщення Тост
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}