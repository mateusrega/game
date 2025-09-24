function isChromeOnAndroid() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('android') && ua.includes('chrome') && !ua.includes('edg') && !ua.includes('firefox') && !ua.includes('samsungbrowser');
}

document.addEventListener('DOMContentLoaded', () => {
  const messageText = document.getElementById('message-text');
  const mainActionButton = document.getElementById('main-action-button');

  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    messageText.textContent = 'Instale o jogo CatTroll no seu dispositivo!';
    mainActionButton.style.display = 'inline-block';

    mainActionButton.onclick = () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          if (isChromeOnAndroid()) {
            messageText.textContent = 'CatTroll instalado! Abra o app pela tela inicial.';
          } else {
            messageText.textContent = 'CatTroll instalado! Abra o app pela tela inicial.';
          }
        } else {
          messageText.textContent = 'Instalação do CatTroll foi recusada.';
        }
      });
    };
  });
});
