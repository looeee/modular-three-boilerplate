const modularTHREE = require('modular-three');

import {
  TestDrawing,
}
from './drawings/TestDrawing';

modularTHREE.config.useHeartcodeLoader = false;

modularTHREE.init();

const testDrawing = new TestDrawing();
testDrawing.render(true);
