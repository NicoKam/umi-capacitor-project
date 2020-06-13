import { defineConfig } from 'umi';
import theme from './theme';

export default defineConfig({
  theme,
  plugins: ['./plugin-convention-router.ts', './plugin-cordova.ts'],
  chainWebpack:(memo) => {
    /* open browser after build */
    memo.devServer.open(true);
  }
});
