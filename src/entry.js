const modularTHREE = require('modular-three');

import {
  TestDrawing,
}
from './drawings/TestDrawing';

modularTHREE.config.showStats = true;

modularTHREE.init();

const testDrawing = new TestDrawing();
testDrawing.render();
