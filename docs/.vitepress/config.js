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
            {
              text: 'CSS', collapsed: true,
              items: [
                { text: '盒子模型', link: '/guide/css/' },
                { text: '对BFC的理解', link: '/guide/css/bfc' },
                { text: 'Grid布局', link: '/guide/css/grid' },
              ]
            },
            {
              text: 'JavaScript', collapsed: true,
              items: [
                { text: '基础', link: '/guide/js/' },
                { text: '事件流', link: '/guide/js/event' },
                { text: 'this指向', link: '/guide/js/this' },
                { text: 'ES6', link: '/guide/js/es6' },
                { text: 'Promise', link: '/guide/js/promise' },
                { text: '执行上下文', link: '/guide/js/exc' },
                { text: '原型链', link: '/guide/js/prototype' },
                { text: 'Class', link: '/guide/js/class' },
              ]
            },
            {
              text: 'TypeScript', collapsed: true,
              items: [
                { text: 'keyof', link: '/guide/typescript/keyof' },
              ]
            },
            { text: '工程化',collapsed:true,items:[
              {text:"git",link:'/guide/engineering/git'}
            ] },
            { text: '网络', link: '/guide/network' },
            {
              text: '工具方法', collapsed: true, items: [
                { text: '常用方法', link: '/guide/utils/' }
              ]
            },
            {
              text:"数据结构与算法",collapsed:true,items:[
                {text:"数组",link:"/guide/algorithm/array"},
                {text:"链表",link:"/guide/algorithm/linked"},
                {text:"栈",link:"/guide/algorithm/stack"},
                {text:"队列",link:"/guide/algorithm/queue"},
                {text:"二叉树",collapsed: true, items:[
                  {text:"基础理论",link:"/guide/algorithm/binaryTree/theory"},
                ]},
                
              ]
            }
          ]
        }
      ],
      '/share/': [
        {
          items: [
            {
              text: '技术实践', collapsed: false,
              items: [
                { text: '网页生成截图', link: '/share/technique/' },
                { text: '大文件上传', link: '/share/technique/fileUpload' },
              ]
            },
            {
              text: 'Vue源码分析', collapsed: false,
              items: [
                {
                  text: '学习路线', link: '/share/vue/'
                },
                {
                  text: '响应式系统', collapsed: false, items: [
                    {
                      text: 'proxy', link: '/share/vue/reactivity/proxy'
                    },
                    {
                      text: 'ref', link: '/share/vue/reactivity/ref'
                    },
                    {
                      text: 'reactive', link: '/share/vue/reactivity/reactive'
                    },
                  ]
                },
                { text: 'nextTick', link: '/share/vue/nextTick' },
              ]
            },
            {
              text: 'React源码分析', collapsed: false,
              items: [
                { text: '网页生成截图', link: '/share/react/' }
              ]
            },
          ]
        }
      ],
      '/interview/': [
        {
          items: [
            {
              text: 'Vue', collapsed: false,
              items: [
                { text: '对mvd的理解', link: '/interview/vue/' },
                { text: '对Vue的理解', link: '/interview/vue/vue' },
                { text: '对生命周期的理解', link: '/interview/vue/lifecycle' }
              ]
            },

          ]
        }
      ],
      '/resolve': [
        {
          items: [
            {text:'小程序',collapsed: true, items:[
              {text:'真机测试时，无法显示覆盖在canvas上的图片或其他内容', link:'/resolve/applet/coverImage'}
            ]}
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