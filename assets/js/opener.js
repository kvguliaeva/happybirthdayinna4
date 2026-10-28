(() => {
    const root = document.documentElement;
    const cover = document.getElementById('invitation-opener');
    const content = document.getElementById('invitation-content');
    const panel = cover.querySelector('.invitation-opener__panel--right');
    let opening = false;
    let finished = false;
    let fallback;

    content.inert = true;
    content.setAttribute('aria-hidden', 'true');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const resetScroll = () => {
        if (!finished) window.scrollTo(0, 0);
    };
    resetScroll();
    window.addEventListener('pageshow', resetScroll);

    const finishOpening = () => {
        if (!opening || finished) return;
        finished = true;
        window.clearTimeout(fallback);
        root.classList.remove('invitation-closed', 'invitation-opening');
        content.inert = false;
        content.removeAttribute('aria-hidden');
        cover.hidden = true;
        document.dispatchEvent(new Event('invitation:opened'));
        const title = content.querySelector('.inna-greeting-title');
        if (title) {
            title.setAttribute('tabindex', '-1');
            title.focus({ preventScroll: true });
        }
    };

    const openInvitation = () => {
        if (opening) return;
        opening = true;
        root.classList.add('invitation-opening');
        document.dispatchEvent(new Event('invitation:opening'));
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        fallback = window.setTimeout(finishOpening, reduced ? 250 : 3400);
    };

    const scheduleOpening = () => window.setTimeout(openInvitation, 2000);
    if (document.readyState === 'complete') {
        scheduleOpening();
    } else {
        window.addEventListener('load', scheduleOpening, { once: true });
    }

    panel.addEventListener('animationend', (event) => {
        if (event.target === panel && event.animationName === 'invitation-open-right') {
            finishOpening();
        }
    });
})();
