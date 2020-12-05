let GoalTop;
let GoalBottom;

const createPainel = () => {
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  var panelHeading = new BABYLON.GUI.StackPanel();
  panelHeading.background = 'black';
  panelHeading.width = '180px';
  panelHeading.height = '120px';
  panelHeading.isVertical = true;
  panelHeading.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  panelHeading.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  panelHeading.paddingTop = '10px';
  panelHeading.paddingLeft = '10px';
  advancedTexture.addControl(panelHeading);

  GoalTop = new BABYLON.GUI.TextBlock();
  GoalTop.text = 'Player : 0';
  GoalTop.color = 'white';
  GoalTop.goals = 0;
  GoalTop.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  GoalTop.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  GoalTop.fontSize = 24;
  GoalTop.paddingTop = '20px';
  GoalTop.paddingLeft = '20px';
  panelHeading.addControl(GoalTop);

  GoalBottom = new BABYLON.GUI.TextBlock();
  GoalBottom.text = 'Ia : 0';
  GoalBottom.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  GoalBottom.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  GoalBottom.color = 'white';
  GoalBottom.goals = 0;
  GoalBottom.fontSize = 24;
  GoalBottom.paddingTop = '60px';
  GoalBottom.paddingLeft = '20px';
  panelHeading.addControl(GoalBottom);
};

const updateGoal = (goal) => {
  if (hasWin(goal)) {
    return;
  }

  if (goal === 'Top') {
    GoalTop.goals++;
    GoalTop.text = `Player : ${GoalTop.goals.toString()}`;
    playerGoal.play();
  } else {
    GoalBottom.goals++;
    GoalBottom.text = `Ia : ${GoalBottom.goals.toString()}`;
    iaGoal.play();
  }
};

const hasWin = (goal) => {
  if (goal === 'Top' && GoalTop.goals == 2) {
    playerWin.play();
    resetGoals();
    alert('Você ganhou!');
    return true;
  } else if (goal === 'Bottom' && GoalBottom.goals == 2) {
    iaWin.play();
    resetGoals();
    alert('Você perdeu!');
    return true;
  }

  return false;
};

const resetGoals = () => {
  GoalTop.goals = 0;
  GoalBottom.goals = 0;
  GoalTop.text = `Player : ${GoalTop.goals.toString()}`;
  GoalBottom.text = `Ia : ${GoalBottom.goals.toString()}`;
};
