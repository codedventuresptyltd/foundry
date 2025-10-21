// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Coded Ventures Foundry',
  tagline: 'Where Coded Ventures builds in the open',
  favicon: 'coded-ventures.ico',

  // Set the production url of your site here
  url: 'https://foundry.codedventures.com.au',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'codedventuresptyltd',
  projectName: 'foundry',

  onBrokenLinks: 'warn',
  
  markdown: {
    mermaid: true,
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/codedventuresptyltd/foundry/tree/main/',
        },
        blog: {
          path: 'fieldnotes',
          routeBasePath: 'fieldnotes',
          showReadingTime: true,
          blogTitle: 'Field Notes',
          blogDescription: 'Engineering narratives and insights from the Coded Ventures forge',
          blogSidebarTitle: 'Recent Notes',
          blogSidebarCount: 10,
          postsPerPage: 10,
          authorsMapPath: 'authors.yml',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: '/coded-ventures.ico',
      },
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'CodedVenturesLogo.webp',
      
      // SEO metadata
      metadata: [
        {name: 'keywords', content: 'commerce, b2b, framework, architecture, distributed systems, engagement, pricing, fulfillment'},
        {name: 'description', content: 'Foundry is the public engineering forge for Coded Ventures - documentation, architectural insights, and SDK references for CommerceBridge, Touchpoint, and Eidos.'},
        {property: 'og:type', content: 'website'},
        {property: 'og:site_name', content: 'Coded Ventures Foundry'},
        {name: 'theme-color', content: '#7a8599'},
        {name: 'apple-mobile-web-app-capable', content: 'yes'},
        {name: 'apple-mobile-web-app-status-bar-style', content: 'black'},
      ],
      navbar: {
        title: 'The Foundry',
        logo: {
          alt: 'Coded Ventures',
          src: 'CodedVenturesLogo.webp',
          href: 'https://codedventures.com.au',
        },
        hideOnScroll: false,
        items: [
          {
            to: '/',
            position: 'left',
            label: 'Home',
          },
          {
            to: '/commercebridge',
            position: 'left',
            label: 'CommerceBridge',
          },
          {
            to: '/touchpoint',
            position: 'left',
            label: 'Touchpoint',
          },
          {
            to: '/eidos',
            position: 'left',
            label: 'Eidos',
          },
          {
            to: '/fieldnotes',
            label: 'Field Notes',
            position: 'left'
          },
          {
            href: 'https://github.com/codedventuresptyltd/public',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Products',
            items: [
              {
                label: 'CommerceBridge',
                to: '/commercebridge',
              },
              {
                label: 'Touchpoint',
                to: '/touchpoint',
              },
              {
                label: 'Eidos',
                to: '/eidos',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Core Concepts',
                to: '/core',
              },
              {
                label: 'Field Notes',
                to: '/fieldnotes',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/codedventuresptyltd/public',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Coded Ventures. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'json', 'typescript', 'javascript'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      
      // Algolia search (can be enabled later)
      // algolia: {
      //   appId: 'YOUR_APP_ID',
      //   apiKey: 'YOUR_SEARCH_API_KEY',
      //   indexName: 'foundry',
      // },
    }),

  // Cloudflare Web Analytics (optional - replace token when ready)
  scripts: [
    // {
    //   src: 'https://static.cloudflareinsights.com/beacon.min.js',
    //   defer: true,
    //   'data-cf-beacon': '{"token": "REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN"}',
    // },
  ],
};

module.exports = config;

