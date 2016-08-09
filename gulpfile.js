// ----------------------------
// Include Dependencies 
// ----------------------------

var gulp            = require('gulp');
var stylus          = require('gulp-stylus');
var babel			= require('gulp-babel');
var concat 			= require('gulp-concat'); 


// ----------------------------
// Define Paths
// ----------------------------

var paths = {
    stylus_watch: './src/assets/styles/**/*.styl',
    stylus_main: './src/assets/styles/style.styl',
    js_main: './src/assets/scripts/main.js'
};

// ----------------------------
// Define Gulp Sass Task
// ----------------------------

gulp.task('stylus', function() {
  gulp.src(paths.stylus_main)
    .pipe(stylus())
    .pipe(gulp.dest('./src/assets/styles/'))
});

gulp.task('babel', function(){
	gulp.src(paths.js_main)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./src/assets/scripts/'));
		// .pipe(reload({stream: true}));
});



// -------------------------
// Set up our default tasks
// ----------------------------

gulp.task('watch', function(){
	gulp.watch(paths.js_main, ['babel']);
	gulp.watch(paths.stylus_watch,['stylus']);
	// gulp.watch('.src/*.html', reload);

});

gulp.task('default', ['stylus', 'babel', 'watch']);
