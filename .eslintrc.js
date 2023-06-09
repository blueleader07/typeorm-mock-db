module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: [
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'require-jsdoc': ['off'],
        indent: ['error', 4],
        'no-useless-constructor': ['off'],
        'new-cap': ['off']
    }
}
