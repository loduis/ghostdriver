var page = require('webpage').create();
page.onLoadStaredOneShot = function () {
    console.log('PRUEBA...')
};

page.open('http://localhost:4567/', function (status) {

});