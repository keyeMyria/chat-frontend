var gulp     = require("gulp");
var sass     = require("gulp-sass");
var jade     = require("gulp-jade");
var prefix   = require("gulp-autoprefixer");
var header   = require("gulp-header");
var server   = require("gulp-webserver");
var plumber  = require("gulp-plumber");
var del      = require("del");
var sequence = require("run-sequence");
var concat   = require("gulp-concat");

var targets = {
  sass: [
    "./styles/*.scss",
    "./styles/**/*.scss",
    "./styles/**/_*.scss"
  ],

  jade: [
    "./jade/*.jade",
    "./jade/**/*.jade",
    "./jade/**/_*.jade"
  ],

  js: [
    "./js/*.js",
    "./js/**/*.js"
  ],

  venders: {
    css: [
      "./vender/css/normalize.css",
      "./node_modules/flat-ui/bootstrap/css/bootstrap.css",
      "./node_modules/flat-ui/css/flat-ui.css"
    ],

    js: [

    ]
  }
};

var defaultTasks = [
  "sass", "jade", "concat-js", "concat-css"
];

gulp.task("default", defaultTasks, function() {
  gulp.src("app")
    .pipe(plumber())
    .pipe(server({
      root: "app",
      livereload: true,
      open: true
     }));
  gulp.watch(targets.sass, ["sass"]);
  gulp.watch(targets.jade, ["jade"]);
  gulp.watch(targets.js, ["concat-js"]);
  gulp.watch(targets.venders.css, ["concat-css"]);
});

gulp.task("sass", function() {
  console.log("[TASK] sass processing...");
  gulp.src(targets.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(header('@charset "utf-8";\n'))
    .pipe(gulp.dest("./app/"))
});

gulp.task("jade", function() {
  console.log("[TASK] jade processing...");
  gulp.src(targets.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest("./app/"))
});

gulp.task("concat-js", function() {
  var output = "application.js"
  console.log("[TASK] concat-js processing...");
  gulp.src(targets.js)
    .pipe(plumber())
    .pipe(concat(output))
    .pipe(gulp.dest("./app/"))
});

gulp.task("concat-css", function() {
  var output = "venders.css"
  console.log("[TASK] concat-css processing...");
  gulp.src(targets.venders.css)
    .pipe(plumber())
    .pipe(concat(output))
    .pipe(gulp.dest("./app/"))
});

gulp.task("clean", function() {
  del(["./app/*.*"]);
});

