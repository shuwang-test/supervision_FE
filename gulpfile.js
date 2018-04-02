var gulp = require('gulp')
var sass = require('gulp-sass')
var browser = require('browser-sync')
gulp.task('dev', ['sass', 'watch'], function() {
	browser.init({
		server: {
			baseDir: './src'
		},
		port: 8080,
		open: false,
		ghostMode: {
			scroll: false,
			forms: false,
			clicks: false
		}
	})
})
gulp.task('sass', function() {
	gulp
		.src('./src/sass/style.scss')
		.pipe(sass({ includePaths: ['./src/css'] }))
		.pipe(gulp.dest('./src/css'))
		.pipe(
			browser.reload({
				stream: true
			})
		)
})

gulp.task('watch', function() {
	gulp.watch('./src/sass/*.scss', ['sass'])
	gulp.watch('./src/view/**/*.scss', ['sass'])
})

var template = require('gulp-angular-templatecache')
var useref = require('gulp-useref')
var gulpif = require('gulp-if')
var ngAnnotate = require('gulp-ng-annotate')
var uglifyJs = require('gulp-uglify')
var uglifyCss = require('gulp-clean-css')
var prefix = require('gulp-autoprefixer')

gulp.task('template', ['sass'], function() {
	return gulp
		.src('src/view/**/*.html')
		.pipe(
			template({
				root: 'view',
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
	return gulp.src('src/lib/fonts/*.*').pipe(gulp.dest('dist/fonts'))
})

gulp.task('dist', ['useref', 'copyImage', 'copyFonts'])
