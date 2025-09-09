# Modern Bundlers (Vite, Webpack, Rollup)

## Overview

Modern bundlers are sophisticated tools that transform and optimize your source code for production. Each bundler has its strengths and is suited for different use cases. Understanding their differences and capabilities is crucial for choosing the right tool for your project.

## Vite: Next Generation Frontend Tooling

### What is Vite?
Vite is a build tool that provides fast development server and optimized production builds. It leverages native ES modules in development and Rollup for production builds.

### Key Features
- **Lightning-fast HMR**: Hot Module Replacement with instant updates
- **Native ES Modules**: Uses browser's native module system in development
- **Optimized Production Builds**: Uses Rollup for efficient bundling
- **Built-in TypeScript Support**: No additional configuration needed
- **Plugin Ecosystem**: Extensible with plugins

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'moment']
        }
      }
    }
  }
});
```

### Vite Plugins

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});
```

### Vite Environment Variables

```javascript
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// .env.production
VITE_API_URL=https://api.production.com

// Usage in code
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_APP_TITLE);
```

### Vite CSS Processing

```javascript
// vite.config.js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
```

## Webpack: The Battle-Tested Bundler

### What is Webpack?
Webpack is a static module bundler that processes your application and creates a dependency graph, then packages all modules into one or more bundles.

### Key Features
- **Mature Ecosystem**: Extensive plugin and loader ecosystem
- **Code Splitting**: Dynamic imports and chunk splitting
- **Tree Shaking**: Dead code elimination
- **Hot Module Replacement**: Development-time module updates
- **Asset Management**: Handles all types of assets

### Webpack Configuration

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  optimization: {
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

### Webpack Loaders

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  }
};
```

### Webpack Plugins

```javascript
// webpack.config.js
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

### Webpack Code Splitting

```javascript
// Dynamic imports
const loadComponent = async () => {
  const { default: Component } = await import('./Component');
  return Component;
};

// Route-based splitting
const routes = {
  '/': () => import('./pages/Home'),
  '/about': () => import('./pages/About'),
  '/contact': () => import('./pages/Contact')
};
```

## Rollup: The ES Module Bundler

### What is Rollup?
Rollup is a module bundler for JavaScript that compiles small pieces of code into something larger and more complex, like a library or application.

### Key Features
- **Tree Shaking**: Excellent dead code elimination
- **ES Module Focus**: Optimized for ES modules
- **Small Bundle Sizes**: Produces smaller bundles
- **Library Development**: Ideal for creating libraries
- **Plugin System**: Extensible with plugins

### Rollup Configuration

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MyLibrary',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    terser()
  ],
  external: ['react', 'react-dom']
};
```

### Rollup Plugins

```javascript
// rollup.config.js
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    postcss({
      extract: true,
      minimize: true
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
};
```

## Bundler Comparison

### Performance Comparison

| Feature | Vite | Webpack | Rollup |
|---------|------|---------|--------|
| Dev Server Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Build Speed | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Bundle Size | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Tree Shaking | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Ecosystem | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### Use Case Recommendations

#### Choose Vite When:
- Building modern web applications
- Need fast development experience
- Using modern frameworks (React, Vue, Svelte)
- Want minimal configuration
- Need TypeScript support out of the box

```javascript
// Perfect for modern React apps
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
```

#### Choose Webpack When:
- Building complex applications
- Need extensive customization
- Working with legacy code
- Require specific loaders or plugins
- Building micro-frontends

```javascript
// Perfect for complex enterprise apps
// webpack.config.js
module.exports = {
  entry: {
    app: './src/index.js',
    vendor: './src/vendor.js'
  },
  module: {
    rules: [
      // Complex loader configurations
    ]
  },
  plugins: [
    // Extensive plugin ecosystem
  ]
};
```

#### Choose Rollup When:
- Building libraries
- Need optimal tree shaking
- Want smallest possible bundles
- Creating npm packages
- Building ES modules

```javascript
// Perfect for library development
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'esm'
  },
  external: ['react', 'react-dom']
};
```

## Advanced Bundler Features

### Module Federation (Webpack)

```javascript
// webpack.config.js
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        'mfe1': 'mfe1@http://localhost:3001/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

### Vite SSR

```javascript
// vite.config.js
export default defineConfig({
  build: {
    ssr: true,
    rollupOptions: {
      input: 'src/entry-server.js'
    }
  }
});
```

### Rollup Watch Mode

```javascript
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'esm'
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
};
```

## Build Optimization Strategies

### Bundle Analysis

```javascript
// webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};

// Vite bundle analyzer
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
});
```

### Code Splitting Strategies

```javascript
// Webpack code splitting
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};

// Vite code splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'moment']
        }
      }
    }
  }
});
```

### Tree Shaking Optimization

```javascript
// Webpack tree shaking
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};

// Rollup tree shaking (built-in)
export default {
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  }
};
```

## Migration Strategies

### Webpack to Vite Migration

```javascript
// Before: webpack.config.js
module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};

// After: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});
```

### Rollup to Webpack Migration

```javascript
// Before: rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd'
  }
};

// After: webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    library: 'MyLibrary',
    libraryTarget: 'umd'
  }
};
```

## Best Practices

### 1. Choose the Right Tool
- **Vite**: Modern applications, fast development
- **Webpack**: Complex applications, extensive customization
- **Rollup**: Libraries, optimal tree shaking

### 2. Optimize for Your Use Case
- Development: Fast HMR, quick builds
- Production: Small bundles, optimal performance
- Libraries: Tree shaking, multiple formats

### 3. Use Appropriate Plugins
- Only add plugins you actually need
- Keep plugin configurations minimal
- Use official plugins when possible

### 4. Monitor Bundle Size
- Regular bundle analysis
- Set size limits
- Optimize based on metrics

### 5. Keep Dependencies Updated
- Regular updates for security and performance
- Test thoroughly after updates
- Use lock files for consistency

## Conclusion

Modern bundlers are powerful tools that can significantly impact your development workflow and application performance. Understanding their strengths and weaknesses helps you choose the right tool for your project and optimize your build process effectively.

The key is to start with the tool that best fits your project's needs and iterate based on your specific requirements. Remember that the best bundler is the one that helps you build better applications faster.

## Next Steps

1. **Evaluate your project needs** and choose the appropriate bundler
2. **Set up a basic configuration** and test it
3. **Add plugins and optimizations** based on your requirements
4. **Monitor performance** and iterate on your configuration
5. **Stay updated** with the latest bundler features and best practices

Remember: The bundler is just a tool - focus on building great applications and let the bundler help you achieve that goal.
