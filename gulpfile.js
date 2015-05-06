var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins(),
    argv            = require('yargs').argv,
    bower           = require('bower'),
    mainBowerFiles  = require('main-bower-files'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload;


// Define main 
var jsFiles = mainBowerFiles().concat(['src/*/**/*.js', 'src/templates.js', 'src/app.js']);

// Run a local web server
gulp.task('connect', function() {
  $.connect.server({
    root: [__dirname],
    fallback: 'index.html'
  });
});

// Task for live injection
gulp.task('browser-sync', function() {
    return browserSync({
      proxy: 'localhost:8080',
      open: false,
      minify: false,
      files: ['*.html', 'build/script.js'],
      injectChanges: true
    });
});


// Generate angular templates
gulp.task('tpl', function () {
    gulp.src("src/**/*.html")
        .pipe($.angularTemplatecache({'standalone': true}))
        .pipe(gulp.dest('./src/'));
});

// Generate slim templates
gulp.task('slim', function () {
    gulp.src("src/**/*.slim")
        .pipe($.plumber({
            errorHandler: $.notify.onError("<%= error.message %>")}))
        .pipe($.slim({
            pretty: true,
            options: "attr_list_delims={'(' => ')', '[' => ']'}"
        }))
        .pipe(gulp.dest('./src/'));
});

// Generate index slim
gulp.task('slim_index', function () {
    gulp.src("index.slim")
        .pipe($.plumber({
            errorHandler: $.notify.onError("<%= error.message %>")}))
        .pipe($.slim({
            pretty: true,
            options: ":attr_list_delims={'(' => ')', '[' => ']'}"
        }))
        .pipe(gulp.dest('./'));
});

// Javascript build
gulp.task('js', function() {
    gulp.src(jsFiles)
        .pipe($.ngAnnotate())
        // .pipe($.angularFilesort())
        .pipe($.uglify())
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('build/'));
});

// Javascript build development
gulp.task('jsDev', function() {
    gulp.src(jsFiles)
        // .pipe($.angularFilesort())
        .pipe($.uglify({
            'mangle': false,
            'compress': false,
            'output': {
                'beautify': true
            }
        }))
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('build/'));
});



// SASS build
gulp.task('sass', function () {
    gulp.src('src/**/*.scss')
        .pipe($.cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe($.sass())
        .pipe($.concat('style.css'))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest('build/'));
});

// SASS Development
gulp.task('sassDev', function () {
    gulp.src('src/**/*.scss')
        .pipe($.plumber({
            errorHandler: $.notify.onError("<%= error.message %>")}))
        .pipe($.cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe($.sass())
        .pipe($.concat('style.css'))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/'))
        .pipe($.filter('*.css'))
        .pipe(browserSync.reload({stream:true}));
});

// Set up watchers
gulp.task('default', ['connect', 'sassDev', 'slim', 'tpl', 'jsDev', 'browser-sync'], function() {
    gulp.watch('./src/**/*.scss', ['sassDev']);
    gulp.watch('src/**/*.html', ['tpl']);
    gulp.watch('src/**/*.slim', ['slim']);
    gulp.watch('index.slim', ['slim_index']);
    gulp.watch(jsFiles, ['jsDev']);
});

// Build JS and SASS
gulp.task('build', ['js', 'sass']);

// Build then add and commit
gulp.task('commit', ['build'], function(){
    gulp.src(['build/script.js', 'build/style.css'])
        .pipe($.git.add())
        .pipe($.git.commit('Build'));
});

// Create new feature with --name
gulp.task('newfeature', function() {
    var name = argv.name;
    gulp.src('src/features/_feature/*')
        .pipe($.clone())
        .pipe($.template({'name': name, 'bigname': name.charAt(0).toUpperCase() + name.slice(1)}))
        .pipe($.rename(function(path) {
            path.dirname = name;
            path.basename = '_' + name;
        }))
        .pipe(gulp.dest('src/features/'));
});

// Create new pattern with --name
gulp.task('newpattern', function() {
    var name = argv.name;
    gulp.src('src/patterns/_pattern/*')
        .pipe($.clone())
        .pipe($.template({'name': name, 'bigname': name.charAt(0).toUpperCase() + name.slice(1)}))
        .pipe($.rename(function(path) {
            path.dirname = name;
            path.basename = '_' + name;
        }))
        .pipe(gulp.dest('src/patterns/'));
});

// Clear the git repo
gulp.task('clean-git', function() {
    gulp.src('.git')
        .pipe($.clean());
});

// Make new repo with initial commit
gulp.task('init', ['clean-git'], function() {
    gulp.src('*')
        .pipe($.git.init())
        .pipe($.git.add())
        .pipe($.git.comiit('init'));
});
