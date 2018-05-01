//used for file upload

var express = require('express');
var busboy = require('connect-busboy');
var formidable = require('formidable');
var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;
var querystring = require('querystring');
var async = require('async');
var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

var printfile;


app.route('/print').post(function(req, res, next){
	//console.log("prepare to print " + printfile);
	var queryData = "";
	req.on('data', function(data){
		queryData += data;
	});
	req.on('end', function(){
		console.log(queryData);
		var cmd = "python2 /home/pi/Printrun/printcore.py -s /dev/ttyACM0 ";
		if (!queryData.trim()) { //empty
		    console.log("Print file: " + printfile);
		    cmd += printfile;
            var child = exec(cmd, function(err, stdout, stderr){
                console.log(stdout);
            });

		} else {
            var files = queryData.split(" ");
            async.each(files, function(file, callback){
                file = "/home/pi/3dPrinterServer/template/" + file;
                cmd += file;
                console.log("Print file: " + file);
                var child = exec(cmd, function(err, stdout, stderr){
                    console.log(stdout);
                });

			}, function(err) {
            	if (err) {
            		console.log("Error printing");
				} else {
            		console.log("Printing complete");
				}
			});
        }
	});

	//var child = exec("echo " + printfile + ">test");
});


app.route('/upload').post(function (req, res, next) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {

		//Path where image will be uploaded
		printfile = __dirname + '/template/' + filename;
		console.log(printfile);
		fstream = fs.createWriteStream(__dirname + '/template/' + filename);
		file.pipe(fstream);
		fstream.on('close', function () {    
			console.log("Upload Finished of " + filename);
			res.status(200).json("upload success");
		});
	});
	//req.on('end', function() {

	//});
});

app.route('/template').get(function (req, res, next) {
	var str = "";
	//var path='/home/ubuntu/3dPrinterServer/template';
    var path='/home/pi/3dPrinterServer/template';
	fs.readdir(path, function(err, items){
		for (var i = 0; i < items.length; ++i){
			if (items[i].endsWith(".g") == true || items[i].endsWith(".gcode")) {
				console.log(items[i]);
				str += items[i];
				str += " ";
			}
		}
		if (err) return callback(err);
		res.status(200).json(str.trim());
	});
	
});


var server = app.listen(8080, function() {
	var host = server.address().address;
    	var port = server.address().port;
});
