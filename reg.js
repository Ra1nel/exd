      (function() {
      const canvas = document.getElementById('particleCanvas');
      const ctx = canvas.getContext('2d');
      let width, height, particles, animFrame;

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
      }
      window.addEventListener('resize', resize);

      function initParticles() {
        const count = Math.floor((width * height) / 9000); // плотность
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.3,
            color: ['#00d4ff', '#ff79c6', '#bd93f9', '#f1fa8c'][Math.floor(Math.random() * 4)]
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          
          p.x += p.speedX;
          p.y += p.speedY;
          
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        });
        ctx.globalAlpha = 1;
        animFrame = requestAnimationFrame(draw);
      }

      resize();
      draw();
    })();

    
    const form = document.getElementById('regForm');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;

      
      passwordError.style.display = 'none';
      confirmError.style.display = 'none';

      
      const pwd = passwordInput.value;
      const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,8}$/;
      if (!pwdRegex.test(pwd)) {
        passwordError.style.display = 'block';
        valid = false;
      }

      if (pwd !== confirmInput.value) {
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
