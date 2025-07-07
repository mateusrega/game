document.addEventListener('DOMContentLoaded', () => {
    const messageText = document.getElementById('message-text');
    const mainActionButton = document.getElementById('main-action-button');
    const gameUrl = 'game.html';

    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isPWA) {
        // Já está no app instalado
        messageText.textContent = 'Bem-vindo ao CatTroll!';
        mainActionButton.textContent = 'JOGAR';
        mainActionButton.style.display = 'inline-block';
        mainActionButton.onclick = () => window.location.href = gameUrl;
    } else {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            messageText.textContent = 'Instale o jogo CatTroll no seu dispositivo!';
            mainActionButton.textContent = 'INSTALAR';
            mainActionButton.style.display = 'inline-block';

            mainActionButton.onclick = () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        messageText.textContent = 'Instalando... Você pode abrir o app no menu do dispositivo.';
                    } else {
                        messageText.textContent = 'Instalação cancelada.';
                        mainActionButton.style.display = 'inline-block';
                    }
                    deferredPrompt = null;
                });
            };
        });

        // Se não suportar prompt, oferecer "Abrir no navegador"
        setTimeout(() => {
            if (!deferredPrompt) {
                messageText.textContent = 'Você pode jogar direto no navegador.';
                mainActionButton.textContent = 'JOGAR';
                mainActionButton.style.display = 'inline-block';
                mainActionButton.onclick = () => window.location.href = gameUrl;
            }
        }, 1500);
    }
});
