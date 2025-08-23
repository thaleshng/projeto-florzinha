document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('section.hero');
    const videoSection = document.querySelector('section.video');
    const btn = hero?.querySelector('button');
    const video = videoSection?.querySelector('video');

    if (!hero || !videoSection || !btn || !video) return;

    // Estado inicial: hero visível, vídeo oculto
    hero.classList.add('visible');
    videoSection.classList.remove('visible');

    // Tenta tocar com som; se não conseguir, toca mudo e mostra botão "Ativar som"
    const playWithSound = async () => {
        try {
            video.muted = false;
            await video.play();  // em geral funciona no clique
            return true;
        } catch (err) {
            // fallback: toca mudo e pede gesto para ativar som
            try {
                video.muted = true;
                await video.play();
            } catch (_) { }
            showUnmuteButton();
            return false;
        }
    };

    btn.addEventListener('click', async () => {
        // Alterna visibilidade
        hero.classList.remove('visible');
        videoSection.classList.add('visible');

        // Play com som (ou fallback)
        await playWithSound();
    }, { once: true });

    function showUnmuteButton() {
        const unmute = document.createElement('button');
        unmute.type = 'button';
        unmute.textContent = 'Ativar som 🔊';
        Object.assign(unmute.style, {
            position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 9999,
            padding: '12px 16px', border: 'none', borderRadius: '10px',
            fontSize: '16px', cursor: 'pointer',
            background: '#FF69B4', color: '#fff',
            boxShadow: '0 0 15px rgba(255,105,180,.6)'
        });
        document.body.appendChild(unmute);

        const enable = async () => {
            video.muted = false;
            try { await video.play(); } catch (_) { }
            unmute.remove();
            document.removeEventListener('pointerdown', enable, { capture: true });
        };

        // Qualquer clique/toque (ou o próprio botão) ativa o som
        unmute.addEventListener('click', enable, { once: true });
        document.addEventListener('pointerdown', enable, { once: true, capture: true });
    }
});
