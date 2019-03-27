module.exports = {
  outputDir: 'dist/front',
  pluginOptions: {
    sourceDir: 'front',
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_styles.scss";
          @import "@/scss/_variables.scss";
          @import "@/scss/_mixins.scss";
        `,
      },
    },
  },
};
