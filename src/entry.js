import * as modularTHREE from 'modular-three';
// import * as modularTHREE from 'modular-three/src/index.js';

import {
  TestDrawing,
}
from './drawings/TestDrawing.js';

modularTHREE.config.showStats = true;
modularTHREE.config.showHeartcodeLoader = true;

modularTHREE.init();

const testDrawing = new TestDrawing();
testDrawing.render();
