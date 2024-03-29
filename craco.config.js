// module.exports = {
//   webpack: {
//     configure: (webpackConfig) => {
//       const wasmExtensionRegExp = /\.wasm$/;

//       webpackConfig.module.rules.forEach((rule) => {
//         (rule.oneOf || []).forEach((oneOf) => {
//           if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
//             oneOf.exclude.push(wasmExtensionRegExp);
//           }
//         });
//       });

//       webpackConfig.module.rules.unshift({
//         test: wasmExtensionRegExp,
//         use: "wasm-loader",
//       });
//       return webpackConfig;
//     },
//   },
// };

module.exports = {
  webpack: {
    configure: {
      experiments: {
        asyncWebAssembly: true,
      },
    },
  },
};
