Modular Three Boilerplate
========

### ES2015 THREE.js boilerplate code designed for use with ModularTHREE ([npm](https://www.npmjs.com/package/modular-three), [github](https://github.com/looeee/modular-three)). ###

Includes a Gulpfile which:
* Compiles ES2015 to ES5 with [Rollup](http://rollupjs.org/) and [Babel](https://babeljs.io/).
* Compiles [SCSS](http://sass-lang.com/) and applies [Autoprefixer](https://github.com/postcss/autoprefixer) to your CSS.
* Runs [Livereload](http://livereload.com/).

Detailed instructions on using ModularTHREE are [**here**](https://www.npmjs.com/package/modular-three).

### NOTE: ModularTHREE is at  avery early development stage. Features are changing rapidly and this readme may be out of date. You probably shouldn't use this yet.  ###

Requirements
------

[Node.js](https://nodejs.org)

**Optional**:
* Eslint, or an editor using Eslint. The .eslintrc file provided is setup to use the the [Airbnb style guide](https://github.com/airbnb/javascript).
* Livereload extension for [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/livereload/).

Usage
------

Clone this repository into an empty folder

```bash
git clone https://github.com/looeee/modular-three-boilerplate
```

Then install the required NPM modules

```bash
npm install
```

View index.html in your browser - it should show a falling wooden cube if everything is working.

Run the default **Gulp** task to watch for changes to code in the src and scss folders and start the Livereload server:

```bash
gulp default
```

This boilerplate includes a simple ```Drawing``` setup to use [**GSAP**](http://greensock.com/gsap) for animation and show stats using [**stats.js**](https://github.com/mrdoob/stats.js/).

For more detailed instructions on how to create and use ```Drawings```, see the [ModularTHREE](https://www.npmjs.com/package/modular-three) readme.

#### License MIT © Lewy Blue 2016 ####
