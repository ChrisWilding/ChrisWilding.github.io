module.exports = {
  siteMetadata: {
    title: `Chris Wilding`,
    description: `Chris Wilding is a software engineer living and working in Manchester, UK`,
    author: `@ChrisWildingUK`,
    email: `hello@chriswilding.co.uk`,
    github: `ChrisWilding`,
    linkedin: `ChrisWildingUK`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-remove-generator`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Chris Wilding`,
        short_name: `ChrisW`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/*": [
            "Content-Security-Policy: default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; connect-src 'self'",
            "Referrer-Policy: same-origin",
            "Strict-Transport-Security: max-age=31536000; includeSubdomains; preload",
            "X-Content-Type-Options: nosniff",
            "X-Frame-Options: DENY",
            "X-XSS-Protection: 1; mode=block",
          ],
        },
      },
    },
  ],
}
