// react-bits через jsrepo (вариант JS + plain CSS, суффикс -JS-CSS).
// Добавить компонент:  npx jsrepo add <Name>-JS-CSS --yes
// NB: файлы типа registry:file (.css) jsrepo 3.8.3 не пишет — доносим вручную
// из https://reactbits.dev/r/<Name>-JS-CSS.json (files[].content).
import { defineConfig, js, css, DEFAULT_PROVIDERS } from 'jsrepo';

export default defineConfig({
  registries: ['https://reactbits.dev/r'],
  providers: DEFAULT_PROVIDERS,
  languages: [js(), css()],
  paths: {
    '*': './src/components/reactbits',
    file: './src/components/reactbits',
    component: './src/components/reactbits',
  },
});
