document.addEventListener('DOMContentLoaded', () => {
    // Canvas & Image Sequence Logic
    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');

    // Configuration
    const frameCount = 240;
    const folderPath = 'ezgif-286b71efb41cd7b3-jpg/';
    const images = [];
    const imageObjects = []; // Store Image objects to avoid GC churn if possible, though browser caching helps

    // Resize handling to ensure canvas covers screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call

    // Preload Images
    // Helper to pad numbers with leading zeros (e.g., 1 -> "001")
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

    // Drawing the image with "object-fit: cover" logic
    function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
        if (arguments.length === 2) {
            x = y = 0;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        }

        // Default offset is center
        offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
        offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

        // Keep bounds [0.0, 1.0]
        if (offsetX < 0) offsetX = 0;
        if (offsetY < 0) offsetY = 0;
        if (offsetX > 1) offsetX = 1;
        if (offsetY > 1) offsetY = 1;

        var iw = img.width,
            ih = img.height,
            r = Math.min(w / iw, h / ih),
            nw = iw * r,   // new prop. width
            nh = ih * r,   // new prop. height
            cx, cy, cw, ch, ar = 1;

        // Decide which gap to fill
        if (nw < w) ar = w / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
        nw *= ar;
        nh *= ar;

        // Calc source rectangle
        cw = iw / (nw / w);
        ch = ih / (nh / h);

        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;

        // Make sure source rectangle is valid
        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;

        // Fill image in dest. rectangle
        ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    }

    function render(currentTime) {
        requestAnimationFrame(render);

        // Control FPS
        const deltaTime = currentTime - lastTime;
        if (deltaTime < interval) return;

        // Adjust for variance
        lastTime = currentTime - (deltaTime % interval);

        // Draw current frame
        const img = images[frameIndex];
        if (img.complete) {
            drawImageProp(context, img, 0, 0, canvas.width, canvas.height);
        }

        // Advance frame
        frameIndex = (frameIndex + 1) % frameCount;
    }

    // Start Animation
    requestAnimationFrame(render);


    // Scroll Animations (Existing Logic preserved)
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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
