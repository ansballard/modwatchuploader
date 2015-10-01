TO BUILD
==

### Dependencies

1. [NodeJS/NPM](https://nodejs.org) (Latest Stable Version)
2. [Bower](http://bower.io) (`sudo npm install -g bower`)
3. [Electron](http://electron.atom.io/) (`sudo npm install -g electron-prebuilt electron-packager`)

### Setup

1. `cd` to this directory
2. `bower install`
3. `electron ./`

### Legacy Version Setup and Build

1. Python 2.7
2. Python Tkinter
3. Build with `python /path/to/pyinstaller.py --onefile --windowed /path/to/readloadorder.py`

GENERAL
==

This is a desktop Electron app. It uses Angular and Angular Material for the frontend. As with the rest of the modwatch repos, the Angular code should be switching to the [John Papa Styleguide](https://github.com/johnpapa/angular-styleguide) for modularity and Angular 2 conversion. Gulp should also be incorporated at some point, if only for cleaner file structure.

CONTRIBUTING
==

1. Fork this repo
2. Open an issue for the problem/enhancement you want to work on
3. Create a branch that has to do with the issue you want to fix
4. Implement your changes
5. Make a pull request to this repo
6. If there are no merge conflicts, and I've already approved the issue you created, I'll most likely merge your changes in

When making changes, do your best to follow the standards already set in other parts of the repo. Changes should not be noticeable when looking through source code. I would prefer all changes pass `eslint` with the `.eslintrc` in the root directory.

LINKS
==

- [The Live Site](http://www.modwat.ch)
- [The Nexus Mods Page](http://nexusmods.com/skyrim/mods/56640)
- [The API](http://github.com/ansballard/modwatchapi)
- [The Frontend](http://github.com/ansballard/modwatch)
