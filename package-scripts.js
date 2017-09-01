const npsUtils = require('nps-utils');
const series = npsUtils.series;
const rimraf = npsUtils.rimraf;
const concurrent = npsUtils.concurrent;

module.exports = {
  scripts: {
    build: {
      description: 'clean dist directory and run all builds',
      default: series(
        rimraf('dist'),
        rimraf('lib'),
        concurrent.nps('build.css', 'build.min'),
        concurrent.nps('build.umd', 'build.umdMin', 'build.es')
      ),
      umdMin: 'rollup --config --environment UGLIFY',
      umd: 'rollup --config',
      es: 'babel src -d lib',
      css: 'lessc less/default.less dist/react-select.css',
      min: 'lessc --clean-css less/default.less dist/react-select.min.css',
      standalone: series(
        'cp examples/src/standalone.html examples/dist/standalone.html',
        'lessc examples/src/example.less examples/dist/example.less',
        'rollup --config --environment STANDALONE'
      )
    },
  },
};
