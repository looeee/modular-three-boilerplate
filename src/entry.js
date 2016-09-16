import { ExampleDrawing } from './drawings/exampleDrawing';
import { initLoader } from './loadingOverlay';

//Set any config options here
modularTHREE.config.useLoadingManager = false;

//Run init() AFTER setting config options
modularTHREE.init();

//Run initLoader() AFTER modularTHREE.init()
initLoader();

//Drawing set up and control goes next
const exampleDrawing = new ExampleDrawing();
exampleDrawing.render();
