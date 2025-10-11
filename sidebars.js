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
    'index',
  ],

  // CommerceBridge sidebar
  commercebridgeSidebar: [
    'commercebridge/index',
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
        'commercebridge/integrations', // Custom Ecosystems
      ],
    },
    {
      type: 'category',
      label: 'SDK Reference',
      items: [
        'commercebridge/sdk-reference',
      ],
    },
  ],

  // Touchpoint sidebar
  touchpointSidebar: [
    'touchpoint/index',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'touchpoint/slot-based-ui',
        'touchpoint/commercebridge-integration',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'touchpoint/customization',
        'touchpoint/example-flows',
      ],
    },
  ],

  // Eidos sidebar
  eidosSidebar: [
    'eidos/index',
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'eidos/product-dna',
        'eidos/data-schema',
      ],
    },
    {
      type: 'category',
      label: 'Implementation',
      items: [
        'eidos/rule-sets',
        'eidos/commercebridge-integration',
      ],
    },
  ],

  // Core Concepts sidebar
  coreSidebar: [
    'core/index',
    {
      type: 'category',
      label: 'Architecture Patterns',
      items: [
        'core/worker-ecosystems',
        'core/bridge-architecture',
        'core/engagement-centric-design',
        'core/engagements',
      ],
    },
    {
      type: 'category',
      label: 'Commerce Concepts',
      items: [
        'core/pricing-models',
        'core/caching-strategies',
        'core/fulfillment',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'core/tenant-isolation',
        'core/security',
        'core/devops-philosophy',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'core/models',
      ],
    },
  ],
};

module.exports = sidebars;

