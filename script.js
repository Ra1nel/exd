// Ожидание загрузки DOM
document.addEventListener('DOMContentLoaded', () => {

    // ---------- ВЫПАДАЮЩЕЕ МЕНЮ (универсально) ----------
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
  
    if (menuToggle && dropdownMenu) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
      });
  
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
      });
    }
  
    // ---------- РЕДИРЕКТЫ ДЛЯ ПУНКТОВ МЕНЮ ----------
    function redirectTo(url) {
      if (window.parent && window.parent !== window) {
        window.parent.location.href = url;
      } else {
        window.location.href = url;
      }
    }
  
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const logoutLink = document.querySelector('.logout-link');
  
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        redirectTo('index.html');
      });
    }
  
    if (registerLink) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        redirectTo('reg.html');
      });
    }
  
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        redirectTo('index.html');
      });
    }
  
    // ---------- ВЫХОД ЧЕРЕЗ ОТДЕЛЬНУЮ КНОПКУ (если есть logoutBtn) ----------
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
      });
    }
  
    // ---------- ЗАЩИТА СТРАНИЦ (только для main.html и news.html) ----------
    const protectedPages = ['main.html', 'news.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage) && !localStorage.getItem('isLoggedIn')) {
      window.location.href = 'index.html';
    }
  
    // ---------- СТРАНИЦА ВХОДА (index.html) ----------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      const VALID_LOGIN = 'admin';
      const VALID_PASSWORD = '12345';
      const loginInput = document.getElementById('login');
      const passwordInput = document.getElementById('password');
      const loginError = document.getElementById('loginError');
      const passwordError = document.getElementById('passwordError');
  
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        loginError.style.display = 'none';
        passwordError.style.display = 'none';
  
        if (loginInput.value.trim() !== VALID_LOGIN) {
          loginError.style.display = 'block';
          isValid = false;
        }
        if (passwordInput.value !== VALID_PASSWORD) {
          passwordError.style.display = 'block';
          isValid = false;
        }
  
        if (isValid) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', loginInput.value.trim());
          window.location.href = 'main.html';
        }
      });
    }
  
    // ---------- СТРАНИЦА РЕГИСТРАЦИИ (reg.html) ----------
    const regForm = document.getElementById('regForm');
    if (regForm) {
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      const passwordError = document.getElementById('passwordError');
      const confirmError = document.getElementById('confirmError');
  
      regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        passwordError.style.display = 'none';
        confirmError.style.display = 'none';
  
        const pwd = password.value;
        const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,8}$/;
        if (!pwdRegex.test(pwd)) {
          passwordError.style.display = 'block';
          valid = false;
        }
        if (pwd !== confirmPassword.value) {
          confirmError.style.display = 'block';
          valid = false;
        }
  
        if (valid) {
          const userData = {
            surname: document.getElementById('surname').value,
            name: document.getElementById('name').value,
            patronymic: document.getElementById('patronymic').value,
            email: document.getElementById('email').value,
            birthdate: document.getElementById('birthdate').value,
            phone: document.getElementById('phone').value
          };
          localStorage.setItem('registeredUser', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', userData.name || 'Пользователь');
          window.location.href = 'main.html';
        }
      });
    }
  
    // ---------- ГЛАВНАЯ СТРАНИЦА (main.html) ----------
    // Отображение имени пользователя
    const userNameSpan = document.getElementById('userNameDisplay');
    if (userNameSpan) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) userNameSpan.textContent = currentUser;
    }
  
    // Слайдер отзывов
    const slidesContainer = document.getElementById('slidesContainer');
    if (slidesContainer) {
      const slides = document.querySelectorAll('.slide');
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');
      let currentIndex = 0;
  
      function updateSlider() {
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
  
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      });
  
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
      });
    }
  
    // Модальное окно «Подробнее»
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.getElementById('closeModal');
    const detailBtns = document.querySelectorAll('.btn-detail');
  
    if (detailBtns.length > 0) {
      detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const title = btn.getAttribute('data-title');
          const desc = btn.getAttribute('data-desc');
          modalTitle.textContent = title;
          modalDescription.textContent = desc;
          modalOverlay.style.display = 'flex';
        });
      });
  
      closeModal.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
      });
  
      window.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
      });
    }
  
    // Аккордеон программы курса
    const programHeaders = document.querySelectorAll('.program-header');
    programHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
      });
    });
  
  });