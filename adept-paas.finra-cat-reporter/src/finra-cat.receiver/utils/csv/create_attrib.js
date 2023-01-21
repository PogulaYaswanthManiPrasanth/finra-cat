
const error_codes = require('./errors_codes.js');
let code = 0;
error_codes.forEach( _error => {

  code = new Number(_error.code)

  _error['attributes'] = [];

  if( code > 2000 && code < 3000 ) {

    console.log(_error.description )
   

/*
    if( _error.description.startsWith("Missing or Invalid ") )
      _error.attributes.push( _error.description.substring( "Missing or Invalid ".length - 1 , _error.description.length ).trim() )
*/

  }

});

//console.log( JSON.stringify( JSON.parse( JSON.stringify( error_codes )),null, 2) )

process.exit(0);
