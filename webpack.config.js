const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
// Variable d'environnement récupérée depuis le script lancé (voir package.json)

const dev = process.env.NODE_ENV === "dev"

///////////////////////////
/// Loaders CSS et SCSS ///
///////////////////////////

// On va utiliser 1) css-loader, 2) style-loader en mode dev (css injecté dans la balise style) et MiniCssExtractPlugin.loader en prod (css extrait dans un fichier à part)
let cssLoaders = [
    dev ? 'style-loader' : {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: ''
        }
    },
    'css-loader',
]

// Si on est en production, AVANT d'utiliser css-loader, on va utiliser postcss-loader pour autoprefixer (et rendre le css compatible avec les vieux navigateurs)
if (!dev) {
    cssLoaders.push({
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: [
                    [
                        "autoprefixer",
                        {
                            browsers: ['last 2 versions', 'ie > 8']
                        }
                    ]
                ],
            }
        },
    })
}

////////////////////////
/// OBJET DE CONFIG ///
///////////////////////

let config = {
    mode: dev ? "development" : "production",
    // Modules d'entry à bundler
    entry: {
        main: ['./assets/css/main.scss', './assets/js/script.js'],
        compteur: ['./assets/js/compteur.js'], // , './assets/js/contact.js'],
    },
    output: {
        // Dossier absolu où vont les modules bundlés
        path: path.resolve('./dist'),
        // En mode dev, les fichiers bundlés prennent le nom du module d'entry, en mode prod on rajoute un chunkhash (pour la mise en cache)
        filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
        // Emplacement des fichiers bundlés par rapport au dossier public du serveur (donc par rapport au index.html)
        publicPath: ''
    },
    devServer: {
        // Si une erreur de compilation pendant l'utilisation du dev server ==> on overlay avec l'erreur
        overlay: true,
    },
    resolve: {
        // alias pour import plus facilement des fichiers depuis les fichiers d'entry
        alias: {
            '@': path.resolve('./assets'),
            '@css': path.resolve('./assets/css'),
            '@html': path.resolve('./assets/html'),
            '@js': path.resolve('./assets/js'),
            // react-dom amélioré pour le hot-reload
            'react-dom': '@hot-loader/react-dom',
        },
        // POUR REACT
        extensions: ['.js', '.jsx'],
    },
    // On watch si on est en mode dev
    watch: dev,
    // cofiguration du source-map en mode dev
    devtool: dev ? "eval-cheap-module-source-map" : false,
    optimization: {
        minimizer: []
    },
    module: {
        rules: [
            // rule pour rendre les .js bundlés compatibles < ES5 
            {
                test: /.(js|jsx)$/, // REACT: on rajoute jsx
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            // rule pour loader le css
            {
                test: /\.css$/,
                use: cssLoaders,
            },
            // Idem pour le scss (on commencer par utiliser un loader qui transforme le scss en css)
            {
                test: /\.scss$/,
                use: [
                    ...cssLoaders,
                    'sass-loader'
                ]
            },
            // rule pour utiliser des fichiers de police dans les entry
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
            // rule pour optimiser et pouvoir loader les images depuis les entry
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 0,
                            name: 'images/[name].[ext]'
                        },
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: !dev,
                        },
                    }
                ],
            },

        ]
    },
    plugins: [
        // Plugin pour recycler les fichiers bundlés dans le dossier output
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        // Plugin pour mettre en place un linter
        /* new ESLintPlugin({
            fix: true, // Auto-fix des erreur de lint
            failOnError: !dev, // En mode prod, si il reste des erreurs, ça compile pas
        }), */
        // Pour communiquer avec react si on est en mode dev ou de prod
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(dev ? "development" : "production")
            }
        })
    ]
}

// En mode prod, on veut que les fichiers extraits css aient un hash (pour la mise en cache)
if (!dev) {
    // Pour minimiser avec le plugin UglifyJsPlugin
    config.optimization.minimizer.push(new UglifyJsPlugin())
    config.plugins.push(new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
    }))
}


/////////////////////////////////////////////////////////
/// HTML DYNAMIQUEMENT LINKE AUX ENTRY (.JS et .SCSS) ///
/////////////////////////////////////////////////////////
/// But: Générer tous les html avec les modules d'entry linkés dynamiquement, à partir du dossier assets/html 

const glob = require('glob') // package qui permets de trouver des fichiers d'extension donnée

// On récupère la liste des noms des fichiers .html du dossier /assets/html/
const files = glob.sync(process.cwd() + '/assets/html/*.html')

// On boucle sur ces fichiers pour les faire passer dans HtmlWebpackPlugin
files.forEach(file => {
    const name = path.basename(file).replace('.html', '') // Nom du fichier sans l'extension

    // Si il existe un module dans 'entry' du même nom que le fichier html (ex: module 'index' pour le fichier index.html), on associe ce module pour le linker dans le html, sinon on associe le module 'default' pour linker style_base.scss
    const chunk = name === "index" ? ['main','compteur'] : ['main'] //(name in config.entry) ? [name] : ['default']

    config.plugins.push(
        new HtmlWebpackPlugin({
            template: file,
            filename: path.basename(file), // Le fichier bundlé aura le même nom que le template
            chunks: chunk// Le nom du module à link est le même que le fichier html
        })
    )
})

module.exports = config

