
(function() {
  const canvas = document.getElementById('codeCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrame;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  const codeLines = [
    '/* Добро пожаловать! */',
    '',
    'function startLearning(имя) {',
    '  console.log(`Привет, ${имя}!`);',
    '  console.log("Начнём веб-разработку!");',
    '}',
    '',
    'startLearning("новый пользователь");',
    '',
    'const stack = ["HTML", "CSS", "JavaScript", "React"];',
    'stack.forEach(tech => освоить(tech));',
    '',
    '/* Твой код меняет всё */',
  ];

  const fontSize = 16;
  const lineHeight = 24;
  const typeSpeed = 50;
  const pauseBetweenLines = 800;
  let currentLine = 0;
  let charIndex = 0;
  let cursorVisible = true;
  let lastTypeTime = performance.now();

  function getTokenColor(token) {
    if (/^(function|const|let|var|return|import|export|from|if|else|for|while|class|extends|new|this|console|log|forEach)$/.test(token)) return '#ff79c6';
    if (/^(true|false|null|undefined)$/.test(token)) return '#bd93f9';
    if (/^".*"$/.test(token) || /^'.*'$/.test(token) || /^`.*`$/.test(token)) return '#f1fa8c';
    if (/^\/\/.*$/.test(token)) return '#6272a4';
    if (/^\/\*|\*\/$/.test(token)) return '#6272a4';
    if (/^\d+$/.test(token)) return '#bd93f9';
    if (/^(=|===|!==|=>|\{|\}|\(|\)|\.|,|;|:)$/.test(token)) return '#f8f8f2';
    return '#f8f8f2';
  }

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = '500 16px "Fira Code", "Courier New", monospace';
  let maxTextWidth = 0;
  codeLines.forEach(line => {
    const w = tempCtx.measureText(line).width;
    if (w > maxTextWidth) maxTextWidth = w;
  });
  const rightPadding = 60;

  function getStartX() {
    return width - maxTextWidth - rightPadding;
  }

  function drawTokenWithGlow(token, x, y, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = 0.18 * alpha;
    ctx.fillStyle = color;
    ctx.font = '500 16px "Fira Code", "Courier New", monospace';
    for (let dx = -3; dx <= 3; dx += 3) {
      for (let dy = -3; dy <= 3; dy += 3) {
        if (dx === 0 && dy === 0) continue;
        ctx.fillText(token, x + dx, y + dy);
      }
    }
    ctx.restore();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = '500 16px "Fira Code", "Courier New", monospace';
    ctx.fillText(token, x, y);
    ctx.globalAlpha = 1;
  }

  function drawCode(alpha = 1) {
    const startX = getStartX();
    let y = (height - (codeLines.length * lineHeight)) / 2 - 40;
    if (y < 30) y = 30;

    for (let i = 0; i < currentLine && i < codeLines.length; i++) {
      const line = codeLines[i];
      let x = startX;
      const words = line.split(/(\s+)/);
      for (const word of words) {
        if (word === '') continue;
        const color = getTokenColor(word);
        drawTokenWithGlow(word, x, y, color, alpha);
        x += tempCtx.measureText(word).width;
      }
      y += lineHeight;
    }

    if (currentLine < codeLines.length) {
      const line = codeLines[currentLine];
      const visibleText = line.substring(0, charIndex);
      let x = startX;
      const words = line.split(/(\s+)/);
      let charCount = 0;
      for (const word of words) {
        if (word === '') {
          x += tempCtx.measureText(word).width;
          charCount += word.length;
          continue;
        }
        if (charCount + word.length <= charIndex) {
          const color = getTokenColor(word);
          drawTokenWithGlow(word, x, y, color, alpha);
          x += tempCtx.measureText(word).width;
          charCount += word.length;
        } else {
          const part = word.substring(0, charIndex - charCount);
          if (part.length > 0) {
            const color = getTokenColor(word);
            drawTokenWithGlow(part, x, y, color, alpha);
            x += tempCtx.measureText(part).width;
          }
          break;
        }
      }
      if (cursorVisible && alpha > 0.5) {
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(x, y - 14, 2, 20);
      }
    }
  }

  // Волны и поток данных
  let waveTime = 0;
  function drawWaves(alpha = 1) {
    const t = waveTime;
    ctx.save();
    ctx.globalAlpha = alpha;

    const colors = [
      { stroke: '#00d4ff', glow: '#00d4ff' },
      { stroke: '#ff79c6', glow: '#ff79c6' },
      { stroke: '#bd93f9', glow: '#bd93f9' },
      { stroke: '#f1fa8c', glow: '#f1fa8c' }
    ];

    const waves = [
      { yBase: height * 0.2, amp: 40, freq: 0.02, speed: 0.5, offset: 0 },
      { yBase: height * 0.4, amp: 35, freq: 0.025, speed: -0.7, offset: 1.5 },
      { yBase: height * 0.6, amp: 30, freq: 0.015, speed: 0.9, offset: 3.0 },
      { yBase: height * 0.8, amp: 45, freq: 0.03, speed: -0.4, offset: 4.5 },
      { yBase: height * 0.5, amp: 50, freq: 0.01, speed: 0.6, offset: 6.0 },
    ];

    waves.forEach((w, idx) => {
      const color = colors[idx % colors.length];
      ctx.beginPath();
      ctx.moveTo(0, w.yBase);
      for (let x = 0; x <= width; x += 5) {
        const y = w.yBase + Math.sin(x * w.freq + t * w.speed + w.offset) * w.amp;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color.glow;
      ctx.shadowBlur = 15;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, w.yBase);
      for (let x = 0; x <= width; x += 5) {
        const y = w.yBase + Math.sin(x * w.freq * 1.5 + t * w.speed * 0.8 + w.offset) * w.amp * 0.5;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8;
      ctx.stroke();
    });

    for (let i = 0; i < 30; i++) {
      const wx = (i * 137.5 + t * 40) % width;
      const waveIdx = i % waves.length;
      const w = waves[waveIdx];
      const y = w.yBase + Math.sin(wx * w.freq + t * w.speed + w.offset) * w.amp;
      ctx.beginPath();
      ctx.arc(wx, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = colors[waveIdx % colors.length].stroke;
      ctx.shadowColor = colors[waveIdx % colors.length].glow;
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    ctx.restore();
  }

  function draw(timestamp) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    const scrollY = window.scrollY;
    const thresholdStart = window.innerHeight * 0.5;
    const transitionLength = window.innerHeight * 0.5;
    let codeAlpha = 1;
    let wavesAlpha = 0;

    if (scrollY < thresholdStart) {
      codeAlpha = 1;
      wavesAlpha = 0;
    } else if (scrollY > thresholdStart + transitionLength) {
      codeAlpha = 0;
      wavesAlpha = 1;
    } else {
      const t = (scrollY - thresholdStart) / transitionLength;
      codeAlpha = 1 - t;
      wavesAlpha = t;
    }

    if (wavesAlpha > 0) {
      drawWaves(wavesAlpha);
    }

    if (codeAlpha > 0) {
      drawCode(codeAlpha);
    }

    if (wavesAlpha > 0.01) {
      waveTime += 0.016;
    }

    animationFrame = requestAnimationFrame(draw);
  }

  animationFrame = requestAnimationFrame(draw);

  setInterval(() => {
    cursorVisible = !cursorVisible;
  }, 500);

  function typeNext() {
    if (currentLine < codeLines.length) {
      if (charIndex < codeLines[currentLine].length) {
        charIndex++;
        setTimeout(typeNext, typeSpeed);
      } else {
        charIndex = 0;
        currentLine++;
        if (currentLine >= codeLines.length) {
          currentLine = 0;
        }
        setTimeout(typeNext, pauseBetweenLines);
      }
    } else {
      currentLine = 0;
      setTimeout(typeNext, pauseBetweenLines);
    }
  }
  setTimeout(typeNext, 1000);
})();

const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', () => {
  dropdownMenu.classList.remove('active');
});

function redirectTo(url) {
  if (window.parent && window.parent !== window) {
    window.parent.location.href = url;
  } else {
    window.location.href = url;
  }
}

document.querySelector('.login-link').addEventListener('click', (e) => {
  e.preventDefault();
  redirectTo('index.html');
});

document.querySelector('.register-link').addEventListener('click', (e) => {
  e.preventDefault();
  redirectTo('reg.html');
});

document.querySelector('.logout-link').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  redirectTo('index.html');
});

document.getElementById('scrollHint').addEventListener('click', () => {
  document.getElementById('learningSection').scrollIntoView({ behavior: 'smooth' });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(item => {
  observer.observe(item);
});
