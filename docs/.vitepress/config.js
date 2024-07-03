export default {
  title: 'VitePress',
  description: '前端学习',
  themeConfig: {
    siteTitle: "学习笔记",
    externalLinkIcon: true,
    aside: true,
    outline: "deep",
    nav: [
      { text: "首页", link: '/' },
      { text: "基础", link: '/markdown-examples' },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/interview/vue' },
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
      ],
      '/share/':[
        {
          items: [
            {text: '技术实践', collapsed: false,
              items: [
                { text: '网页生成截图', link: '/share/technique/'  }
              ]
            },
            {text: 'Vue源码分析', collapsed: false,
              items: [
                { text: '网页生成截图', link: '/share/vue/'  }
              ]
            },
            {text: 'React源码分析', collapsed: false,
              items: [
                { text: '网页生成截图', link: '/share/react/'  }
              ]
            },
          ]
        }
      ],
      '/interview/':[
        {
          items: [
            { text: 'Vue', collapsed: false,
              items: [
                { text: '对MVVM的理解', link: '/interview/vue/'  },
                { text: '对Vue的理解', link: '/interview/vue/vue' },
                { text: '对生命周期的理解', link: '/interview/vue/lifecycle' }
              ]
            },
            
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
    },
  }
}