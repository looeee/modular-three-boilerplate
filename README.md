# Modular Three Boilerplate
========

###ES2015 THREE.js boilerplate code designed for use with Modular THREE ([npm](https://www.npmjs.com/package/modular-three), [github](https://github.com/looeee/modular-three)).

Includes a Gulpfile with tasks to build SCSS and compile ES2015 to ES5 with Rollup, Browserify and Babel

### Requirements
========

[Node.js](https://nodejs.org)

**Optional**:
* Eslint, or an editor using Eslint. The .eslintrc file provided is setup to the the [Airbnb style guide](https://github.com/airbnb/javascript).
* Livereload extension for [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/livereload/).

### Usage
========

Clone this repository into an empty folder

```bash
git clone https://github.com/looeee/modular-three-boilerplate
```

Then install the required NPM modules

```bash
npm install
```

View index.html in your browser - it should show a red cube on a black background if everything is working.

Run the default Gulp task to watch for changes to code in the src and scss folders.

This boilerplate includes a simple drawing setup to use [GSAP](http://greensock.com/gsap) for animation.

For more detailed instructions on how to create and use drawings, see the [Modular THREE](https://www.npmjs.com/package/modular-three) readme.
