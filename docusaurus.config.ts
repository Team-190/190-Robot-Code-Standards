import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'FRC 190 Code Standards',

  // Set the production URL of your site here
  url: 'https://team-190.github.io/',
  baseUrl: '/190-Robot-Code-Standards/',

  // GitHub pages deployment config.
  organizationName: 'Team-190', // Usually your GitHub org/user name.
  projectName: '190-Robot-Code-Standards', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Internationalization
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // Make docs the root path
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath], // Add remark-math plugin here
          rehypePlugins: [rehypeKatex], // Add rehype-katex plugin here
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '190 Code Standard',
      logo: {
        src: 'img/team190_hat_FINAL2.svg',
      },
      items: [
        {
          href: 'https://github.com/Team-190/190-Robot-Code-Standards',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-no6+qq8FyDyUjWzWW0sr2mFHOaPtZpvUolqk2vh5Tdt3L+4anWWNWAo2F3Q9Ja5g',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;
