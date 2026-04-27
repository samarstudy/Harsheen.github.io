const navbar = document.querySelector('.navbar');
const lines = Array.from(navbar.children);
const lineCount = lines.length;

// wave strength settings
const peakScale = 4;
const decayFactor = 0.5;

navbar.addEventListener('mousemove', e => {
    const rect = navbar.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    lines.forEach((line, idx) => {
        const lineRect = line.getBoundingClientRect();
        const lineCenterY = lineRect.top - rect.top + lineRect.height / 2;
        
        const distance = Math.abs(lineCenterY - mouseY);
        const scaled = Math.max(peakScale - (distance * decayFactor / (rect.height / lineCount)), 1);

        line.style.transform = `scaleX(${scaled}) scaleY(1)`;
    });
});

navbar.addEventListener('mouseleave', () => {
    lines.forEach(line => {
        line.style.transform = 'scaleX(1) scaleY(1)';
    });
});

const books = document.querySelectorAll('.book');

books.forEach(book => {
  book.addEventListener('mouseenter', () => {
    books.forEach(b => {
      if (b !== book) {
        b.style.transform = 'translate(-50%, -50%) scale(0.97)';
        b.style.filter = 'brightness(0.8)';
      } else {
        b.style.transform = 'translate(-50%, -60%) scale(1.05) translateZ(60px)';
        b.style.filter = 'brightness(1.1)';
        b.style.zIndex = 10;
      }
    });
  });

  book.addEventListener('mouseleave', () => {
    books.forEach(b => {
      b.style.transform = '';
      b.style.filter = '';
      b.style.zIndex = '';
    });
  });
});
