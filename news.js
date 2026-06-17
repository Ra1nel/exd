// ========== АНИМАЦИЯ ЛИНИЙ ДАННЫХ ==========
(function() {
    const canvas = document.getElementById('dataCanvas');
    if (!canvas) return; // если канваса нет, выходим
    const ctx = canvas.getContext('2d');
    let width, height, lines, animFrame;
  
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initLines();
    }
    window.addEventListener('resize', resize);
  
    function initLines() {
      const count = 50;
      lines = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.8 + 0.2;
        lines.push({
          startX: Math.random() * width,
          startY: Math.random() * height,
          length: Math.random() * 100 + 50,
          angle: angle,
          speed: speed,
          color: ['#00d4ff', '#ff79c6', '#bd93f9'][Math.floor(Math.random() * 3)],
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    }
  
    function drawLines() {
      ctx.clearRect(0, 0, width, height);
      lines.forEach(line => {
        const endX = line.startX + Math.cos(line.angle) * line.length;
        const endY = line.startY + Math.sin(line.angle) * line.length;
  
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = 1.5;
        ctx.stroke();
  
        line.startX += Math.cos(line.angle) * line.speed;
        line.startY += Math.sin(line.angle) * line.speed;
  
        if (line.startX < -line.length) line.startX = width + line.length;
        if (line.startX > width + line.length) line.startX = -line.length;
        if (line.startY < -line.length) line.startY = height + line.length;
        if (line.startY > height + line.length) line.startY = -line.length;
      });
      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(drawLines);
    }
  
    resize();
    drawLines();
  })();