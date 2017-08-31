
import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
    input: 'src/index.js',
    targets: [
        {
          name: 'react-select',
          dest: 'rollupDist/react-select.js',
          format: 'umd',
        }, {
          dest: 'rollupLib/index.js',
          format: 'es',
        },
    ],
    plugins: [
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: ['es2015-rollup', 'stage-0', 'react'],
        plugins: ['external-helpers']
      }),
      cjs({
        include: [
          'node_modules/classnames/**',
          'node_modules/react-input-autosize/**',
          'node_modules/prop-types/**',
          'node_modules/create-react-class/**',
          'node_modules/fbjs/**',
          'node_modules/object-assign/**',
          'node_modules/react/**',
          'node_modules/react-dom/**',
        ],
        namedExports: {
          'node_modules/react/react.js': ['Children', 'Component'],
        }
      }),
      resolve(),
    ]
};
