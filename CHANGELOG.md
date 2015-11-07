# Changelog

## 0.3.3 (11/2/2015)

**Implemented Enhancements**

- https paths in API
- Angular Material version bumped to 1.0.0-rc
- Cleaned up file reading
- Switched to class method syntax
- Move persistence to separate module
  - Add profiles
  - Login info same for all profiles
  - Account username restrictions
- Login/Create account screen
- Stretch tab selectors to fill screen

**Bugs Fixed**

- Various template tweaks

## 0.3.2 (10/4/2015)

**Implemented Enhancements**

- split ng.js into modules (John Papa ravioli style)
- Added gulp and `dist/` to build to, using ES6
- `.eslintrc` for frontend JS
- `deploy` task for building with electron-packager
  - Configured in `gulpconfig.js`
  - Can be overwritten with argv
  - Builds to `deploy/`
- Switched `main.js` to `index.js`, seems to work better with electron-packager
- Named imports in submodules
- Updated angular and material via bower, copied into `deps/` manually
- Bumped electron version to `0.33.7`
- Added license from original repo
- etc...

## 0.3.1 (9/30/2015)

**Implemented Enhancements**

- Added Changelog
- Added Readme
- Super ignored `auth.dat`
