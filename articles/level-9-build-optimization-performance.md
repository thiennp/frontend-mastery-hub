# Build Optimization & Performance

## Overview

Build optimization is crucial for creating fast, efficient web applications. This involves techniques to reduce bundle sizes, improve loading performance, and optimize the build process itself. Understanding these optimization strategies is essential for delivering excellent user experiences.

## Bundle Size Optimization

### Code Splitting

Code splitting allows you to split your code into smaller chunks that can be loaded on demand, reducing the initial bundle size.

#### Route-Based Code Splitting

```javascript
// React Router with lazy loading
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

#### Component-Based Code Splitting

```javascript
// Dynamic component loading
const loadComponent = async (componentName) => {
  const { default: Component } = await import(`./components/${componentName}`);
  return Component;
};

// Usage
const MyComponent = await loadComponent('MyComponent');
```

#### Webpack Code Splitting Configuration

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};
```

### Tree Shaking

Tree shaking eliminates dead code that's not being used in your application.

#### ES Module Tree Shaking

```javascript
// math.js - Use named exports for better tree shaking
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// main.js - Only import what you need
import { add, subtract } from './math.js';
// multiply will be tree-shaken out
```

#### Webpack Tree Shaking Configuration

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};

// package.json
{
  "sideEffects": false
}
```

#### Rollup Tree Shaking

```javascript
// rollup.config.js
export default {
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
};
```

### Minification

Minification reduces file size by removing whitespace, shortening variable names, and optimizing code.

#### Terser Configuration

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          mangle: {
            safari10: true
          }
        }
      })
    ]
  }
};
```

#### CSS Minification

```javascript
// webpack.config.js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ]
  }
};
```

## Asset Optimization

### Image Optimization

#### Webpack Image Optimization

```javascript
// webpack.config.js
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        }
      }
    ]
  },
  plugins: [
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['mozjpeg', { quality: 80 }],
            ['pngquant', { quality: [0.65, 0.8] }],
            ['svgo', { plugins: [{ name: 'preset-default' }] }]
          ]
        }
      }
    })
  ]
};
```

#### Vite Image Optimization

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { ViteImageOptimize } from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    ViteImageOptimize({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.65, 0.8] },
      svgo: {
        plugins: [{ name: 'preset-default' }]
      }
    })
  ]
});
```

### Font Optimization

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  }
};

// CSS font loading optimization
@font-face {
  font-family: 'MyFont';
  src: url('./fonts/myfont.woff2') format('woff2'),
       url('./fonts/myfont.woff') format('woff');
  font-display: swap; /* Improves loading performance */
}
```

## Build Performance Optimization

### Caching Strategies

#### Webpack Caching

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  }
};
```

#### Vite Caching

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
```

### Parallel Processing

#### Webpack Parallel Processing

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
};
```

#### Thread-Loader for Heavy Tasks

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }
    ]
  }
};
```

### Build Analysis

#### Bundle Analyzer

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

#### Vite Bundle Analysis

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

## Performance Budgets

### Setting Performance Budgets

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: 'warning'
  }
};
```

### Bundle Size Monitoring

```javascript
// webpack.config.js
const SizePlugin = require('size-plugin');

module.exports = {
  plugins: [
    new SizePlugin()
  ]
};
```

## Advanced Optimization Techniques

### Module Concatenation

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    concatenateModules: true
  }
};
```

### Scope Hoisting

```javascript
// webpack.config.js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
  plugins: [
    new ModuleConcatenationPlugin()
  ]
};
```

### Dead Code Elimination

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
```

## Environment-Specific Optimizations

### Development Optimizations

```javascript
// webpack.dev.js
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  cache: {
    type: 'memory'
  }
};
```

### Production Optimizations

```javascript
// webpack.prod.js
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

## Monitoring and Metrics

### Build Time Monitoring

```javascript
// webpack.config.js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // webpack configuration
});
```

### Bundle Size Monitoring

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      statsFilename: 'stats.json'
    })
  ]
};
```

## Best Practices

### 1. Start with Analysis
- Use bundle analyzers to understand your bundle composition
- Identify the largest dependencies and chunks
- Set performance budgets and monitor them

### 2. Implement Code Splitting
- Split by routes for single-page applications
- Split by features for complex applications
- Use dynamic imports for heavy components

### 3. Optimize Assets
- Compress images and use modern formats
- Optimize fonts and use font-display: swap
- Minimize CSS and JavaScript

### 4. Use Caching
- Enable build caching for faster rebuilds
- Use deterministic chunk and module IDs
- Implement proper cache busting strategies

### 5. Monitor Performance
- Track bundle sizes over time
- Monitor build times
- Set up alerts for performance regressions

## Common Pitfalls

### 1. Over-Optimization
- Don't optimize prematurely
- Measure before and after changes
- Focus on user-perceived performance

### 2. Ignoring Dependencies
- Large dependencies can bloat bundles
- Consider alternatives or custom implementations
- Use bundle analyzers to identify heavy dependencies

### 3. Poor Code Splitting
- Avoid splitting too granularly
- Consider the cost of additional HTTP requests
- Balance bundle size with loading performance

### 4. Inadequate Caching
- Not using build caching
- Poor cache invalidation strategies
- Ignoring browser caching

## Conclusion

Build optimization is a continuous process that requires understanding your application's specific needs and performance characteristics. By implementing the right strategies and monitoring your results, you can create fast, efficient applications that provide excellent user experiences.

The key is to start with analysis, implement optimizations incrementally, and continuously monitor and improve your build process. Remember that optimization is not just about reducing file sizes - it's about improving the overall user experience.

## Next Steps

1. **Analyze your current bundle** using bundle analyzers
2. **Implement code splitting** based on your application structure
3. **Optimize assets** and dependencies
4. **Set up monitoring** for build performance
5. **Iterate and improve** based on metrics and user feedback

Remember: The best optimization is the one that measurably improves your users' experience while maintaining development productivity.
