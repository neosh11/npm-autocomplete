/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require('esbuild');

// Common build options
const buildOptions = {
  entryPoints: ['src/index.ts'], // Your input file
  bundle: true, // Bundle your package
  platform: 'browser', // Target platform for browser
  target: 'es2020', // Target ECMAScript version
  minify: true, // Minify the output
  loader: {
    '.ts': 'tsx', // Load TypeScript files as TSX
  },
  define: {
    'process.env.NODE_ENV': '"production"', // Define the NODE_ENV as production for React
  },
};

// Build CJS output
build({
  ...buildOptions,
  outfile: 'dist/bundle.cjs.js', // Your output file for CJS
  format: 'cjs', // Output format as CommonJS
}).catch(() => process.exit(1));

// Build ESM output
build({
  ...buildOptions,
  outfile: 'dist/bundle.esm.js', // Your output file for ESM
  format: 'esm', // Output format as ECMAScript Modules
}).catch(() => process.exit(1));
