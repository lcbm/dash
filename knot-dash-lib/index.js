const config = require('./utils/config.json');
const DashButton = require('./lib/DashButton');
const Router = require('./src/Router');

let presses = [];

config.buttons.forEach((button) => {
  let dash_button = DashButton(button.id)

  dash_button.on('pressed', () => {
    if (!presses[button.id]) {
      Router[button.action](button);
      presses[button.id] = true;
    };

    setTimeout(() => {
      presses[button.id] = false
    }, 5000)
  });
});
