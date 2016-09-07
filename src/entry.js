//import setupGlobals for side effects
import './setupGlobals.js';

import { TestDrawing } from './drawings/TestDrawing';
import { initHeartcodeLoader } from './loadingOverlay';

//Set any config options here
modularTHREE.config.useLoadingManager = true;

//Run init() AFTER setting config options
modularTHREE.init();

if (modularTHREE.config.useLoadingManager) initHeartcodeLoader();

const testDrawing = new TestDrawing();
testDrawing.render();
