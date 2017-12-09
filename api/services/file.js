'use strict'
var fs = require('fs');
exports.deleteFile = function(image_path){
	fs.unlink(image_path,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
   });
};
