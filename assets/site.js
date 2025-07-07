
document.addEventListener('DOMContentLoaded', () => {
    const messageText = document.getElementById('message-text');
    const mainActionButton = document.getElementById('main-action-button');
    const gameUrl = 'game.html';

    let deferredPrompt;
    const isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

    if (isPWAInstalled) {
        messageText.textContent = 'Jogo instalado! Clique para jogar.';
        mainActionButton.textContent = 'ABRIR APLICATIVO';
        mainActionButton.style.display = 'block';
        mainActionButton.addEventListener('click', () => {
            window.location.href = gameUrl;
        });
    } else {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            messageText.textContent = 'Instale o jogo no seu dispositivo!';
            mainActionButton.textContent = 'INSTALAR';
            mainActionButton.style.display = 'block';
            mainActionButton.addEventListener('click', () => {
                mainActionButton.style.display = 'none';
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            messageText.textContent = 'Instalação aceita!';
                        } else {
                            messageText.textContent = 'Instalação recusada.';
                        }
                        deferredPrompt = null;
                    });
                }
            });
        });
    }
});
