import { defineConfig } from 'umi';
import theme from './theme';

export default defineConfig({
  theme,
  // plugins: ['./plugin-capacitor'],
  chainWebpack:(memo) => {
    /* open browser after build */
    memo.devServer.open(true);
  }
});
