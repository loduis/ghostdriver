var error = false, i = 100, j = 1;

function execute() {
    console.log('------------------ STRESS: ' + j  + ' --------------------');
    var exec = require('child_process').exec;

    exec('make test REPORTER=dot', function(error, stdout, stderr) {
        if (error !== null) {
          console.log(stderr);
        } else if (--i) {
          j ++;
          execute();
        }
    });

}
execute();