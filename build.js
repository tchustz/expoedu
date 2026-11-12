// Only public application assets are included in the GitHub Pages directory.
const fs=require('node:fs');const path=require('node:path');
const output=path.join(__dirname,'docs');fs.mkdirSync(output,{recursive:true});
for(const name of ['index.html','app.js','styles.css','sw.js','manifest.webmanifest','icon.svg'])fs.copyFileSync(path.join(__dirname,name),path.join(output,name));
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log('Built GitHub Pages site in docs/');
