document.addEventListener('DOMContentLoaded', () => {
    // 3D Canvas Background Logic
    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');

    // Configuration
    const frameCount = 240;
    const folderPath = 'ezgif-51f909cdc326542d-jpg/';
    const images = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Preload Images
    const currentFrame = index => (index + 1).toString().padStart(3, '0');

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `${folderPath}ezgif-frame-${currentFrame(i)}.jpg`;
        images.push(img);
    }

    // Animation Loop
    let frameIndex = 0;
    const fps = 30;
    const interval = 1000 / fps;
    let lastTime = 0;

    function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
        if (arguments.length === 2) {
            x = y = 0;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        }

        offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
        offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

        if (offsetX < 0) offsetX = 0;
        if (offsetY < 0) offsetY = 0;
        if (offsetX > 1) offsetX = 1;
        if (offsetY > 1) offsetY = 1;

        var iw = img.width,
            ih = img.height,
            r = Math.min(w / iw, h / ih),
            nw = iw * r,
            nh = ih * r,
            cx, cy, cw, ch, ar = 1;

        if (nw < w) ar = w / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
        nw *= ar;
        nh *= ar;

        cw = iw / (nw / w);
        ch = ih / (nh / h);

        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;

        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;

        ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    }

    function render(currentTime) {
        requestAnimationFrame(render);
        const deltaTime = currentTime - lastTime;
        if (deltaTime < interval) return;
        lastTime = currentTime - (deltaTime % interval);

        const img = images[frameIndex];
        if (img.complete) {
            drawImageProp(context, img, 0, 0, canvas.width, canvas.height);
        }
        frameIndex = (frameIndex + 1) % frameCount;
    }
    requestAnimationFrame(render);

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Assembly Showcase Scroll Trigger (Simple)
    const assemblySection = document.getElementById('assembly');
    window.addEventListener('scroll', () => {
        const sectionPos = assemblySection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.5;

        // Add class active when in view
        if (sectionPos < screenPos) {
            // Logic to animate parts could go here
            // For now, simpler CSS opacity transition via IntersectionObserver handles visibility
        }
    });
});
