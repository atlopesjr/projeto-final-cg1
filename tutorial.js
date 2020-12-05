let tutorialPainel;

const createOrRemoveTutorial = () => {
  if (!tutorialPainel) {
    createTutorial();
  } else {
    removeTutorial();
  }
};

const createTutorial = () => {
  tutorialPainel = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  const panelHeading = new BABYLON.GUI.StackPanel();
  panelHeading.background = 'black';
  panelHeading.width = '1000px';
  panelHeading.height = '500px';
  panelHeading.paddingTop = '10px';
  panelHeading.paddingLeft = '10px';
  tutorialPainel.addControl(panelHeading);

  const text = new BABYLON.GUI.TextBlock();
  text.text = `
    Alunos:

    Alexandre Trindade Lopes Junior 171175
    André Chierighini 171340
    Augusto Hideki Shimizu 171026
    Vinícius Henrique Cavalcanti 171911
    
    Objetivos:

    Para ganhar é necessário marcar 3 gols na IA;


    Como jogar:

    Para jogar basta posicionar o ponteiro do mouse em cima do rebatedor, clicar, 
    manter pressionado e movimentar, com isso o rebatedor será posicionado aonde o ponteiro estiver.


    Informações adicionais:

    Caso sejam sofridos 3 gols, você perde;
    O marcador de gols é exibido no canto superior esquerdo;
    Jogue com o som habilitado;
    (Para Habilitar, basta clicar no simbolo de alto falante próximo ao placar).

    `;
  text.color = 'white';
  text.fontSize = '17px';
  text.paddingTop = '20px';
  text.paddingLeft = '20px';
  panelHeading.addControl(text);
};

const removeTutorial = () => {
  tutorialPainel.dispose();
  tutorialPainel = null;
};
