var Promise = require("bluebird"),
  getFontData = require("./getFontData");
  getIconList = require("./getIconList");
  generateJson = require("./generateJson");

function generate() {
  getGlyphs().then(function (glyphs) {
    generateJson(glyphs).then(function (json) {
      // output
      console.log(json);
    });
  });
}

function getGlyphs() {
  return Promise.all([getIconList(), getFontData()]).spread(function (icons, fontData) {
    return icons.map(function (icon) {
      return {
        id: icon.id,
        unicodeHex: icon.unicodeHex,
        unicodeDec: icon.unicodeDec,
        data: fontData[icon.unicodeDec].data
      };
    });
  });
}

module.exports = generate;
