
const
  { src, dest, watch, parallel, series } = require('gulp'),
	imagemin = require('gulp-imagemin'),
	del = require('del');
 
// Gulp File 2.0
const
	sassObservePath = '../sass/**/*.sass',
	stylesObservePath = '../stylus/**/*.styl',
	htmlObservePath = '../templates/**/*.pug',
	scriptsObservePath = '../js/**/*.js',
	stylusSheets = require('./styles/stylus.js'),
	sassSheets = require('./styles/sass.js'),
	pugTpl = require('./templates/pug.js'),
	jsScripts = require('./scripts/js.js'),
	liveReload = require('./live/liveReload.js');


function observe(){
  watch([sassObservePath],sassSheets);
  watch([stylesObservePath],stylusSheets);
  watch([htmlObservePath],pugTpl);
  watch([scriptsObservePath],jsScripts);
}

function fonts(){
	return src([
		'../fonts/**/*.*'
	])
	.pipe(dest('../../build/fonts'))
}
function images(){
	return src([
		'../img/**/*.*'
	])
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 75, progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		// imagemin.svgo({
		// 	plugins: [
		// 		{removeViewBox: true},
		// 		{cleanupIDs: false}
		// 	]
		// })
	]))
	.pipe(dest('../../build/img'))
}

function clean(){
	return del('../../build/',{force:true});
}



exports.sass= parallel([observe,pugTpl,liveReload,sassSheets,jsScripts,fonts,images]);
exports.default= parallel([pugTpl,liveReload,stylusSheets,jsScripts,fonts,images,observe]);

