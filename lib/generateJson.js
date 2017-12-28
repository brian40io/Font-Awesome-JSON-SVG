var Promise = require("bluebird"),
  getIconSvg = require("./getIconSvg"),
  SVGO = require('svgo'),
  svgson = require('svgson');

function generateJson(glyphs) {
  return getIcons(glyphs).then(function (icons) {
    var json = {};
    icons.forEach(function (icon) {

      var id = icon.name.replace(/[_-](\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
      const { height, width, viewBox } = icon.data.attrs;
      const paths = icon.data.childs.map(child => child.attrs.d);
      json[id] = {
        height,
        path: paths.join(' '),
        paths,
        width,
        viewBox,
      };
    });

    return JSON.stringify(json, null, 2);
  });
}
function getIcon(name, params) {
  return new Promise(function(resolve, reject) {
    var getsvg = getIconSvg(params);
    new SVGO().optimize(getsvg, function(result) {
      svgson(result.data, {}, res => resolve({ name, data: res}));
    });
  });
}

function getIcons(glyphs) {
  var workChain = [];
  glyphs.forEach(function(glyph) {
    var spriteGen = getIcon(glyph.id, {
      advWidth: glyph.data['horiz-adv-x'] || 1536,
      path: glyph.data.d
    });

    workChain.push(spriteGen);
  });
  return Promise.all(workChain);
}

module.exports = generateJson;
