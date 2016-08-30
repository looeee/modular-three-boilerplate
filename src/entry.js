import './setupGlobals.js';

import { TestDrawing } from './drawings/TestDrawing';

modularTHREE.config.showStats = false;
modularTHREE.config.showHeartcodeLoader = true;

modularTHREE.init();

const testDrawing = new TestDrawing();
testDrawing.render();
