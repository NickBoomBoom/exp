module.exports = {
  title: 'Day2Day',
  description: 'Just playing around',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    lastUpdated: 'Last Updated',
    smoothScroll: true,
    displayAllHeaders: true, // 默认值：false
    sidebar:
      [
        {
          title: '日常',
          path: '/base/',
          children: [
          ]
        },
        {
          title: 'React Enjoy',
          path: '/react/',
          children: [

          ]
        },
        {
          title: 'Vue Enjoy',
          path: '/vue/',
          children: [

          ]
        },
        {
          title: 'Webpack Enjoy',
          path: '/webpack/',
          children: [

          ]
        }
      ]
  },
  // permalink: "/:year/:month/:day/:slug",
  configureWebpack: {
    resolve: {
      alias: {
        '@img': 'path/to/some/dir'
      }
    }
  },
  plugins: {
    '@vuepress/active-header-links': {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    },
    '@vuepress/back-to-top': true,
    '@vuepress/nprogress': true
  }
}