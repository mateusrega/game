function isChromeOnAndroid() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('android') && ua.includes('chrome') && !ua.includes('edg') && !ua.includes('firefox') && !ua.includes('samsungbrowser');
}

document.addEventListener('DOMContentLoaded', () => {
  const messageText = document.getElementById('message-text');
  const mainActionButton = document.getElementById('main-action-button');

  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isPWA) return; // No app instalado já redireciona no <head>

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
          if (isChromeOnAndroid()) {
            messageText.textContent = 'CatTroll instalado! Você pode abrir o app abaixo.';
            mainActionButton.textContent = 'ABRIR APP';
            mainActionButton.style.display = 'inline-block';
            mainActionButton.onclick = () => {
              window.location.href = 'game.html';
            };
          } else {
            messageText.textContent = 'CatTroll instalado! Abra o app pela tela inicial do dispositivo.';
            mainActionButton.style.display = 'none';
          }
        } else {
          messageText.textContent = 'Instalação cancelada.';
          mainActionButton.style.display = 'inline-block';
        }
        deferredPrompt = null;
      });
    };
  });

  // Fallback se o prompt não aparecer (já instalado ou navegador que não suporta)
  setTimeout(() => {
    if (!deferredPrompt) {
      if (isChromeOnAndroid()) {
        messageText.textContent = 'CatTroll já instalado? Clique abaixo para abrir.';
        mainActionButton.textContent = 'ABRIR APP';
        mainActionButton.style.display = 'inline-block';
        mainActionButton.onclick = () => {
          window.location.href = 'game.html';
        };
      } else {
        messageText.textContent = 'Se já instalou, abra o app pela tela inicial do dispositivo.';
        mainActionButton.style.display = 'none';
      }
    }
  }, 1500);
});
