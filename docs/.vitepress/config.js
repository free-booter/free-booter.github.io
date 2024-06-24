export default {
  title: 'VitePress',
  description: '前端学习',
  themeConfig: {
    siteTitle: "学习笔记",
    externalLinkIcon: true,
    nav: [
      { text: "首页", link: '/' },
      { text: "基础", link: '/markdown-examples' },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/item-1' },
          { text: 'React', link: '/item-2' },
          { text: 'Taro', link: '/item-3' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          items: [
            { text: 'HTML', link: '/guide/' },
            { text: 'CSS', link: '/guide/css' },
            {
              text: 'JavaScript', collapsed: false,
              items: [
                { text: '基础', link: '/guide/js/' },
                { text: 'ES6', link: '/guide/js/es6' },
                { text: 'Promise', link: '/guide/js/promise' },
                { text: '执行上下文', link: '/guide/js/exc' },
              ]
            },
            { text: '工程化', link: '/guide/engineering' },
            { text: '网络', link: '/guide/network' },
          ]
        }
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
    search: {
      provider: "local",
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © xxxxxxxxx",
    }
  }
}