var fs = require('fs'),
    atomsCache = {};
function requireAtoms(atomName) {
  if (!atomsCache.hasOwnProperty(atomName)) {
      var atomFileName = module.dirname + '/../webdriver-atoms/' +
                         atomName + '.js';
      try {
          atomsCache[atomName] = fs.read(atomFileName);
      } catch (e) {
          throw "Unable to load Atom '" + atomName +
                "' from file '"+atomFileName+"'";
      }
  }
  return atomsCache[atomName];
}

module.exports = requireAtoms;
