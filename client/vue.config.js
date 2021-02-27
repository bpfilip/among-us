module.exports = {
  lintOnSave: false,
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
    },
    manifestOptions: {
      name: 'Among Us Live',
      short_name: 'Among US',
      themeColor: '#4DBA87',
      display: "fullscreen",
      orientation: "landscape",
      icons: [
        {
          src: 'img/icon/16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: 'img/icon/32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: 'img/icon/64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'img/icon/128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: 'img/icon/144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: 'img/icon/180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: 'img/icon/192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'img/icon/512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'img/icon/1980.png',
          sizes: '1980x1980',
          type: 'image/png',
        },
      ],
      iconPaths: {
        icon32: 'img/icon/32.png',
        icon16: 'img/icon/16.png',
        appleTouchIcon: 'img/icon/180.png',
        msTileImage: 'img/icon/144.png',
      }
    },

  },
  devServer: {
    disableHostCheck: true
  },
}
