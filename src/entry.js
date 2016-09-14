//import setupGlobals for side effects
// import './setupGlobals.js';

import { TestDrawing } from './drawings/TestDrawing';
import { initLoader } from './loadingOverlay';

//Set any config options here
modularTHREE.config.useLoadingManager = true;

//Run init() AFTER setting config options
modularTHREE.init();

if (modularTHREE.config.useLoadingManager) initLoader();

const testDrawing = new TestDrawing();
testDrawing.render();
