module.exports = {
    "babel-loader": {
        test: /.js$/,
        use: [
            {
                loader: "thread-loader",
                options: {
                    workers: 3,
                },
            },
            "babel-loader?cacheDirectory=true",
        ],
        exclude: /node_modules/,
    },
    "css-loader": {
        test: /.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
                loader: 'postcss-loader',
            }
        ],
    },
    'less-loader': {
        test: /.less$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
            {
                loader: 'postcss-loader',
            }
        ],
    },
    'file-loader': {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ],
    }
}