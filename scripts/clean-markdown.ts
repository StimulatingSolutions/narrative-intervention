const getStdin = require('get-stdin');

getStdin().then((s: string) => {

  s = s.replace(new RegExp('\\n\\*\\*\\s*?\\n', 'gi'), '\n**');
  s = s.replace(new RegExp(' > ', 'gi'), ' ');

  console.log(s);
  process.exit(0);
});
