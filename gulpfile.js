var gulp = require('gulp')

var fontLibSrcList = [
	'./node_modules/bootstrap/dist/fonts/*.*',
	'./node_modules/font-awesome/fonts/*.*'
]
var cssLibSrcList = [
	'./node_modules/bootstrap/dist/css/bootstrap.min.css',
	'./node_modules/font-awesome/css/font-awesome.min.css',
	'./node_modules/ng-dialog/css/ngDialog.min.css',
	'./node_modules/ng-dialog/css/ngDialog-theme-default.min.css',
	'./node_modules/angular-toastr/dist/angular-toastr.min.css',
	'./node_modules/photoswipe/dist/photoswipe.css',
	'./node_modules/photoswipe/dist/default-skin/default-skin.css'
]
var jsLibSrcList = [
	'./node_modules/angular/angular.min.js',
	'./node_modules/angular-animate/angular-animate.min.js',
	'./node_modules/angular-ui-router/release/angular-ui-router.min.js',
	'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
	'./node_modules/ng-dialog/js/ngDialog.min.js',
	'./node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
	'./node_modules/angular-local-storage/dist/angular-local-storage.min.js',
	'./node_modules/ng-file-upload/dist/ng-file-upload.min.js',
	'./node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js',
	'./node_modules/photoswipe/dist/photoswipe.min.js',
	'./node_modules/photoswipe/dist/photoswipe-ui-default.min.js'
]
gulp.task('lib-fonts', function(done) {
	fontLibSrcList.forEach(function(fontsLibSrc) {
		gulp.src(fontsLibSrc).pipe(gulp.dest('./src/lib/fonts'))
	})
	done()
})
gulp.task('lib-css', function(done) {
	cssLibSrcList.forEach(function(cssLibSrc) {
		gulp.src(cssLibSrc).pipe(gulp.dest('./src/lib/css'))
	})
	done()
})
gulp.task('lib-js', function(done) {
	jsLibSrcList.forEach(function(jsLibSrc) {
		gulp.src(jsLibSrc).pipe(gulp.dest('./src/lib/js'))
	})
	done()
})
gulp.task('lib', ['lib-fonts', 'lib-css', 'lib-js'])

var browserSync = require('browser-sync')
gulp.task('server-src', function(done) {
	browserSync.init({
		server: {
			baseDir: './src'
		},
		ghostMode: {
			scroll: false,
			clicks: false,
			forms: false
		},
		port: 8080,
		open: false
	})
	gulp.watch('./src/scss/*.scss', ['sass'])
	gulp.watch('./src/views/**/*.scss', ['sass'])
	done()
})

var sass = require('gulp-sass')

gulp.task('sass', function() {
	return gulp
		.src('./src/scss/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('./src/css'))
		.pipe(
			browserSync.reload({
				stream: true
			})
		)
})

gulp.task('dev', ['lib', 'sass', 'server-src'])

var template = require('gulp-angular-templatecache')
var useref = require('gulp-useref')
var gulpif = require('gulp-if')
var ngAnnotate = require('gulp-ng-annotate')
var uglifyJs = require('gulp-uglify')
var uglifyCss = require('gulp-clean-css')
var prefix = require('gulp-autoprefixer')

gulp.task('template', ['sass'], function() {
	return gulp
		.src('src/views/**/*.html')
		.pipe(
			template({
				root: 'views',
				module: 'app'
			})
		)
		.pipe(gulp.dest('src/js/template'))
})

gulp.task('useref', ['template'], function() {
	return gulp
		.src('src/index.html')
		.pipe(useref())
		.pipe(gulpif('*.js', ngAnnotate()))
		.pipe(gulpif('*.js', uglifyJs()))
		.pipe(
			gulpif(
				'*.css',
				prefix({
					browsers: ['last 2 versions', 'ie 9'],
					cascade: false
				})
			)
		)
		.pipe(gulpif('*.css', uglifyCss()))
		.pipe(gulp.dest('dist'))
})

gulp.task('copyImage', function() {
	return gulp
		.src('src/assets/images/*.*')
		.pipe(gulp.dest('dist/assets/images'))
})

gulp.task('copyFonts', function() {
	return gulp.src('src/lib/fonts/*.*').pipe(gulp.dest('dist/lib/fonts'))
})

gulp.task('copyCss', function() {
	return gulp.src('src/lib/css/*.*').pipe(gulp.dest('dist/lib/css'))
})
gulp.task('copyJs', function() {
	return gulp.src('src/lib/js/*.*').pipe(gulp.dest('dist/lib/js'))
})

gulp.task('dist', ['useref', 'copyImage', 'copyFonts', 'copyCss', 'copyJs'])
