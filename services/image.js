'use strict'
var fs = require('fs');
exports.deleteImage = function(image_path){
	fs.unlink(image_path,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
   });
};
