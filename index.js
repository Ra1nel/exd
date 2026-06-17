(function() {
  const canvas = document.getElementById('geoCanvas');
  const ctx = canvas.getContext('2d');
  let width, height, shapes, animFrame;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initShapes();
  }
  window.addEventListener('resize', resize);

  function initShapes() {
    const count = 25;
    shapes = [];
    for (let i = 0; i < count; i++) {
      const type = Math.random() < 0.5 ? 'circle' : 'square';
      shapes.push({
        type: type,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 60 + 30,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        color: ['#00d4ff', '#ff79c6', '#bd93f9'][Math.floor(Math.random() * 3)]
      });
    }
  }

  function drawShapes() {
    ctx.clearRect(0, 0, width, height);
    shapes.forEach(shape => {
      ctx.save();
      ctx.globalAlpha = shape.opacity;
      ctx.fillStyle = shape.color;
      if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
      }
      ctx.restore();

      shape.x += shape.speedX;
      shape.y += shape.speedY;
      if (shape.x < -shape.size) shape.x = width + shape.size;
      if (shape.x > width + shape.size) shape.x = -shape.size;
      if (shape.y < -shape.size) shape.y = height + shape.size;
      if (shape.y > height + shape.size) shape.y = -shape.size;
    });
    animFrame = requestAnimationFrame(drawShapes);
  }

  resize();
  drawShapes();
})();

const VALID_LOGIN = 'admin';
const VALID_PASSWORD = '12345';

const loginForm = document.getElementById('loginForm');
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
