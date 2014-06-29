var gulp = require("gulp");
var fileinclude = require("gulp-file-include");
var rename = require("gulp-rename");

gulp.task("default", function() {
	gulp.src(["en/index.phtml"])
		.pipe(fileinclude({
			prefix: "@@",
			basepath: "@file"
		}))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("./en/"));
	gulp.src(["it/index.phtml"])
		.pipe(fileinclude({
			prefix: "@@",
			basepath: "@file"
		}))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("./it/"));
});
