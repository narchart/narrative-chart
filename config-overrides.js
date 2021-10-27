const {
    override,
    addWebpackAlias
} = require("customize-cra");
const path = require("path");

module.exports = override(
    addWebpackAlias({
        ['@/vis']: path.resolve(__dirname, "src/vis")
    }),
);