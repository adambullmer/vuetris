module.exports = {
    root: true,
    extends: [
        "plugin:vue/essential",
        "@vue/prettier",
        "typescript",
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
        "parser": "typescript-eslint-parser"
    },
    env: {
        browser: true,
        node: true,
    },
    rules: {
        quotemark: [true, "double"],
        indent: [true, "spaces", 2],
        "interface-name": false,
        "ordered-imports": false,
        "object-literal-sort-keys": false,
        "no-consecutive-blank-lines": true,
        debugger: false,
        "no-console": false
    },
};
