document.addEventListener('DOMContentLoaded', () => {
    const messageText = document.getElementById('message-text');
    const mainActionButton = document.getElementById('main-action-button');

    let deferredPrompt;

    // Mostrar botão de instalação se possível
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
                    messageText.textContent = 'CatTroll instalado! Abra pelo botão abaixo.';
                    mainActionButton.textContent = 'ABRIR APP';
                    mainActionButton.onclick = () => {
                        window.location.href = 'game.html'; // tentativa simples
                    };
                } else {
                    messageText.textContent = 'Instalação recusada.';
                    mainActionButton.style.display = 'inline-block';
                }
                deferredPrompt = null;
            });
        };
    });

    // Caso não receba o prompt (navegador que já instalou ou não suporta)
    setTimeout(() => {
        if (!deferredPrompt) {
            messageText.textContent = 'CatTroll já instalado. Clique abaixo para abrir.';
            mainActionButton.textContent = 'ABRIR APP';
            mainActionButton.style.display = 'inline-block';
            mainActionButton.onclick = () => {
                window.location.href = 'game.html';
            };
        }
    }, 1500);
});
