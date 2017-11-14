'use strict';

const exec = require('child_process').exec;
var aws = require('aws-sdk');
var fs = require('fs');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
var mysql = require('mysql');
exports.handler = (event, context, callback) => {
   const file_get = {
         Bucket: event.BucketName,
         Key: 'test/' + event.ProjectName+'.exe',
   };
s3.getObject(file_get,(err,data) => {
   if(err){
     callback('Failed to get judgd');
   }else if(data.Body){
      fs.writeFileSync("/tmp/submit.exe",data.Body);
      const input_get = {Bucket:event.BucketName,Key:event.ProjectName+'/input/'+event.inputcase+'.txt'};
      s3.getObject(input_get,(err,datas) =>{
        if(err) callback('Failed');
        fs.writeFileSync("/tmp/input.txt",datas.Body);
        const childs= exec("/bin/bash ./judge.sh;",(error) =>{
                  fs.readFile('/tmp/submission.txt','utf8',function (err, text) {
                 var params = {Bucket:event.BucketName, Key:event.ProjectName+'/output/'+event.inputcase+'.txt', Body: text};
                  s3.putObject(params, function(err, data) {
                     var cmd = "chmod 777 /tmp -R;ls /tmp;/bin/bash ./next.sh;ls /tmp";
                    const child = exec(cmd, (error) => {
                    callback(null,"OK");
                    });
                    });
                  });
            });
       });
    }
});
};