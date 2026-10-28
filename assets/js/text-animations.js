(() => {
    const root = document.documentElement;
    const content = document.getElementById('invitation-content');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!content || reducedMotion.matches) return;

    const selector = [
        '.inna-greeting-title', '.inna-copy p', '.sm-datetime .sm-date',
        '.sm-date__calendar__month', '.sm-location .sm-title',
        '.sm-location .sm-text', '.inna-map-button', '.sm-dress-code .sm-title',
        '.sm-dress-code__box-gallery__title', '.inna-dress-text', '.sm-footer__title'
    ].join(',');
    const items = Array.from(content.querySelectorAll(selector));
    const remaining = new Set(items);
    const sectionOrder = new Map();
    let started = false;
    let frame = 0;

    const reveal = (item) => {
        if (!item || !remaining.delete(item)) return;
        item.classList.add('is-revealed');
        observer?.unobserve(item);
    };

    const observer = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) reveal(entry.target);
            });
        }, { threshold: .1, rootMargin: '0px 0px -24px 0px' })
        : null;

    items.forEach((item) => {
        const section = item.closest('section');
        const order = sectionOrder.get(section) || 0;
        sectionOrder.set(section, order + 1);
        item.style.setProperty('--reveal-delay', `${Math.min(order, 2) * 160}ms`);
        item.classList.add('invitation-reveal');
    });
    root.classList.add('text-animations-ready');

    const revealVisible = () => {
        if (!started) return;
        const height = window.innerHeight || root.clientHeight;
        remaining.forEach((item) => {
            const rect = item.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height) {
                reveal(item);
            }
        });
    };

    const queueVisibleCheck = () => {
        if (!started || frame) return;
        frame = window.requestAnimationFrame(() => {
            frame = 0;
            revealVisible();
        });
    };

    // The greeting starts automatically as soon as the cover disappears.
    const start = () => {
        if (started) {
            revealVisible();
            return;
        }
        started = true;
        // Check the initial viewport directly: no scroll event is required.
        revealVisible();
        remaining.forEach((item) => observer?.observe(item));
        queueVisibleCheck();
    };

    document.addEventListener('invitation:opened', start, { once: true });
    window.addEventListener('scroll', queueVisibleCheck, { passive: true });
    window.addEventListener('resize', queueVisibleCheck, { passive: true });
    window.addEventListener('pageshow', queueVisibleCheck);

    if (!root.classList.contains('invitation-closed')) start();

    reducedMotion.addEventListener('change', (event) => {
        if (!event.matches) return;
        observer?.disconnect();
        window.cancelAnimationFrame(frame);
        root.classList.remove('text-animations-ready');
    });
})();
