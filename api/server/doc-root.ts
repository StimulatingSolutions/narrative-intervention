import {WebApp} from "meteor/webapp";

let fs = Npm.require('fs');
let crypto = Npm.require('crypto');

// adapted from:
// https://stackoverflow.com/questions/37881148/how-can-i-rewrite-redirect-the-default-page-in-meteor-to-point-to-public-index
// see reference info:
// https://docs.meteor.com/packages/webapp.html


// load file data -- this will only ever really get used on prod in our setup, so no need to worry about changing data

let path: string;
let data: string;


function report(dir) {
  let files = fs.readdirSync(dir);
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@ '+dir);
  for (let file of files) {
    console.log('----------------- '+file);
  }
}


report(process.env.PWD);
report(process.env.PWD+'/..');
report(process.env.PWD+'/api');
report(process.env.PWD + '/.meteor/heroku_build');
report(process.env.PWD + '/.meteor/heroku_build/app');
report(process.env.PWD + '/.meteor/heroku_build/app/api');
if (fs.existsSync(process.env.PWD + '/public/index.html')) {
  // dev environment
  path = process.env.PWD + '/public/index.html';
} else if (fs.existsSync(process.env.PWD + '/.meteor/heroku_build/app/api/public/index.html')) {
  // heroku environment
  path = process.env.PWD + '/.meteor/heroku_build/app/api/public/index.html';
}
// calculate eTag for possibly more efficient 304 responses
data = fs.readFileSync(path);
let eTag: string = crypto.createHash('md5').update(data).digest('hex');


WebApp.connectHandlers.use("/", function(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }

  // if we can get away with a 304 Not Modified response, do that
  if (req.headers['if-none-match'] === eTag) {
    res.writeHead(304, 'Not Modified');
    return res.end();
  }

  // send the actual data instead
  res.writeHead(200, {
    'ETag': eTag,
    'Content-Type': 'text/html'
  });
  return res.end(data);
});
