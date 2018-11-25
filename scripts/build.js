const purify = require("purify-css");
const minify = require('minify');
const fs = require('fs');
const ncp = require('ncp').ncp;
const mkdirp = require('mkdirp');
const path = require('path');

let output = {
    css: {
        path: './dist/css/',
        file: 'bundle.css'
    },
    index: './dist/index.html',
    images: './dist/images',
    robots: './dist/robots.txt'
}

// process css: purify + minify
mkdirp(output.css.path, err => {
    if (err) return console.error(err);
    processCSS()
    copyImages()
    processHTML()
    copyRobots()
})

function processCSS() {
    console.log("css purify start")
    let content = ['src/index.html'];
    let css = ['src/css/*.css'];
    let options = { output: output.css.path+output.css.file};
    purify(content, css, data => {
        fs.writeFile(output.css.path+output.css.file, data, err => {
            if (err) return console.log(err);
            console.log("css purify: complete");
            minifyFile(output.css.path+output.css.file);
        })
    });
};

function minifyFile(fileName) {
    console.log("css minify: start");
    minify(fileName, (error, data) => {
        if (error) return console.error(error.message);
        fs.writeFile(fileName, data, err => {
            if (err) return console.log(err);
            console.log("css minify: complete");
        });
    });
};

function copyImages() {
    console.log('copy images directory: start');
    ncp('./src/images',output.images, err => {
        if (err) return console.error(err);
        console.log('copy images directory: complete');
    });
}

function copyRobots() {
    console.log('copy robots.txt: start');
    ncp('./src/robots.txt',output.robots, err => {
        if (err) return console.error(err);
        console.log('copy robots.txt: complete');
    });
}

function processHTML() {
    console.log('processing index');
    fs.readFile('./src/index.html', {encoding: 'utf-8'}, (err,data) => {
        if (err) return console.log(err)
        data = data.replace('<link href="/css/bootstrap.css" rel="stylesheet">','<link href="/css/bundle.css" rel="stylesheet">')
        data = data.replace('<link href="/css/custom.css" rel="stylesheet">','')
        fs.writeFile(output.index, data, err => {
            if (err) return console.log(err);
            minifyFile(output.index);
        })
    });

}
