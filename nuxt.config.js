module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ffe180' },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/_reset.scss'],
  styleResources: {
    scss: [
      '@/assets/scss/_variables.scss',
      '@/assets/scss/_font.scss',
      '@/assets/scss/_reboot.scss'
    ]
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '@/plugins/element-ui', ssr: true },
    { src: '@/plugins/mint-ui', ssr: true }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          //import whole set
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-regular-svg-icons',
            icons: ['far']
          }
        ]
      }
    ]
  ],
  fontawesome: {
    // icon 的標籤使用 <fa>，這邊不設定就會依照 plugin 裡的設定<font-awesome-icon>
    component: 'fa',
    imports: [
      // 引入 fas 所有的icon
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  proxy: {
    '/users': {
      target: 'https://jameslin-ishop.herokuapp.com/',
      changeOrigin: true
    },
    '/geo': {
      target: 'https://jameslin-ishop.herokuapp.com/',
      changeOrigin: true
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // analyze: true,
    // extractCSS: true,
    vendor: ['element-ui', 'mint-ui'],
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'mint-ui',
            style: true
          },
          'mint-ui'
        ],
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          },
          'element-ui'
        ]
      ],
      comments: true
    },
    extend(config, ctx) {}
  }
}
