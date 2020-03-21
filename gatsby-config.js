/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /assets/, // See below to configure properly
        },
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Andre Landgraf',
        short_name: 'andrelandgraf',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#1890ff',
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: 'standalone',
        icon: 'src/assets/img/appicon.jpg', // This path is relative to the root of the site.
        // An optional attribute which provides support for CORS check.
        // If you do not provide a crossOrigin option, it will skip CORS for manifest.
        // Any invalid keyword or empty string defaults to `anonymous`
        crossOrigin: 'use-credentials',
      },
    },
    // You can add a manifest file. Ensure that the manifest plugin is listed before
    // the offline plugin so that the offline plugin can cache the created manifest.webmanifest.
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        precachePages: ['/', '/uses'],
      },
    },
  ],
};
