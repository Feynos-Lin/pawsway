// Inlines data.json into template.html and wraps it as a standalone page at ../index.html
import fs from 'fs';
const body = fs.readFileSync('template.html', 'utf8').replace('__DATA__', fs.readFileSync('data.json', 'utf8'));
const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
`;
const i = body.indexOf('<div class="wrap">');
fs.writeFileSync('../index.html', head + body.slice(0, i) + '</head>\n<body>\n' + body.slice(i) + '\n</body>\n</html>\n');
console.log('wrote ../index.html');
