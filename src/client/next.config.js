module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig, // This is important
    webpack5: false,
    distDir: '../../.next',
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      fixEnums(config); // This is important
      return config;
    },
  };
};

function fixEnums(config) {
  config.module.rules.forEach(({ use }, i) => {
    if (!use) return;
    const isBabelLoader = Array.isArray(use)
      ? use.findIndex((item) => item && item.loader && item.loader === 'next-babel-loader') !== -1
      : use.loader === 'next-babel-loader';
    if (isBabelLoader) {
      delete config.module.rules[i].include;
    }
  });
}
