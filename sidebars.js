/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Home/Welcome sidebar
  homeSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'core/index',
          label: 'Overview',
        },
        'core/worker-ecosystems',
        'core/bridge-architecture',
        'core/engagement-centric-design',
        'core/engagements',
        'core/translators',
        'core/pricing-models',
        {
          type: 'doc',
          id: 'core/caching-strategies',
          label: 'Datastores',
        },
        'core/fulfillment',
        'core/devops-philosophy',
        'core/models',
      ],
    },
    {
      type: 'category',
      label: 'Platforms',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'CommerceBridge',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'commercebridge/index',
              label: 'Overview',
            },
            'commercebridge/architecture',
            {
              type: 'category',
              label: 'Core Components',
              items: [
                'commercebridge/bridge',
                'commercebridge/core-bridge',
                'commercebridge/workers',
                'commercebridge/pricing-engine',
                'commercebridge/fulfillment-engine',
                'commercebridge/integrations',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Touchpoint',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'touchpoint/index',
              label: 'Overview',
            },
            'touchpoint/commercebridge-integration',
            'touchpoint/slot-based-ui',
            'touchpoint/search',
            {
              type: 'category',
              label: 'Modules',
              items: [
                'touchpoint/trade-order-form',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Eidos',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'eidos/index',
              label: 'Overview',
            },
            'eidos/product-dna',
            'eidos/repositories',
            'eidos/relationships',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'integrations/index',
          label: 'Overview',
        },
        'integrations/redpanda',
        'integrations/mongodb',
        'integrations/rabbitmq',
        'integrations/opensearch',
        'integrations/mailgun',
        'integrations/twilio',
        'integrations/openai',
      ],
    },
    {
      type: 'category',
      label: 'Roadmap',
      collapsed: true,
      items: [
        'roadmap/commercebridge',
        'roadmap/touchpoint',
        'roadmap/eidos',
      ],
    },
    {
      type: 'category',
      label: 'Releases',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'CommerceBridge',
          collapsed: true,
          items: [
            'releases/commercebridge-v1',
            'releases/commercebridge-v0',
          ],
        },
        {
          type: 'category',
          label: 'Touchpoint',
          collapsed: true,
          items: [
            'releases/touchpoint-v1',
            'releases/touchpoint-v0',
          ],
        },
        {
          type: 'category',
          label: 'Eidos',
          collapsed: true,
          items: [
            'releases/eidos-v1',
            'releases/eidos-v0',
          ],
        },
      ],
    },
    {
      type: 'link',
      label: 'Field Notes',
      href: '/fieldnotes',
    },
    {
      type: 'link',
      label: 'GitHub',
      href: 'https://github.com/codedventuresptyltd/public',
    },
  ],
};

module.exports = sidebars;

