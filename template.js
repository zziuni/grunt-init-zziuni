/*
  zziuni-template
*/

exports.description = '@zziuni가 만든 grunt template';
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

    done();
  });
};
