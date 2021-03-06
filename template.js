/*
  zziuni-template
*/

exports.description = '@zziuni 개인용 grunt template';
exports.notes = '';
exports.warnOn = '{.*,*}';

exports.template = function(grunt, init, done) {
  init.process({}, [
    init.prompt('name'),
    init.prompt('description'),
    init.prompt('version', '0.0.1'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name', 'zziuni'),
    init.prompt('author_email', 'zziuni@gmail.com'),
    init.prompt('author_url', 'http://zziuni.github.io'),
    init.prompt('angular_version', '1.2.19')
  ], function(err, props) {
    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {
      noProcess: 'libs/**'
    });
    grunt.file.mkdir('dest');
    grunt.file.mkdir('images');
    grunt.file.mkdir('libs');
    grunt.file.mkdir('stylesheets');
    grunt.file.mkdir('views');
    grunt.file.mkdir('js/controllers');
    grunt.file.mkdir('js/services');
    grunt.file.mkdir('js/filters');
    grunt.file.mkdir('js/directives');

    done();
  });
};
