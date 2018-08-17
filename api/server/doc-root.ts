import {WebApp} from "meteor/webapp";

let fs = Npm.require('fs');
let crypto = Npm.require('crypto');

// adapted from:
// https://stackoverflow.com/questions/37881148/how-can-i-rewrite-redirect-the-default-page-in-meteor-to-point-to-public-index
// see reference info:
// https://docs.meteor.com/packages/webapp.html

// load file data -- this will only ever really get used on prod in our setup, so no need to worry about changing data
let path: string;

if (fs.existsSync(process.env.PWD + '/public/index.html')) {
  // dev environment
  path = process.env.PWD + '/public/';
} else if (fs.existsSync(process.env.PWD + '/api/public/index.html')) {
  // heroku environment
  path = process.env.PWD + '/api/public/';
}
// calculate eTags for possibly more efficient 304 responses
let info: any = {};
info.root = {path: path+'index.html'};
info.teacher = {path: path+'teacher/index.html'};
info.student = {path: path+'student/index.html'};


function buildFileHandler(fileInfo: any) {
  return function(req, res, next) {
    if (req.method !== 'GET') {
      return next();
    }

    if (!fileInfo.data) {
      fileInfo.data = fs.readFileSync(fileInfo.path);
      fileInfo.eTag = crypto.createHash('md5').update(fileInfo.data).digest('hex');
    }

    // if we can get away with a 304 Not Modified response, do that
    if (req.headers['if-none-match'] === fileInfo.eTag) {
      res.writeHead(304, 'Not Modified');
      return res.end();
    }

    // send the actual data instead
    res.writeHead(200, {
      'ETag': fileInfo.eTag,
      'Content-Type': 'text/html'
    });
    return res.end(fileInfo.data);
  };
}

WebApp.connectHandlers.use("/web", buildFileHandler(info.teacher));
WebApp.connectHandlers.use("/student", buildFileHandler(info.student));
WebApp.connectHandlers.use("/", buildFileHandler(info.root));
