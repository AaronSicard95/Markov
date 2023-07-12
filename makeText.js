mm = require('./markov')

if (process.argv[2] == 'url'){
    mm.readURL(process.argv[3]);
}else if(process.argv[2] = 'file'){
    mm.readFile(process.argv[3]);
}else{
    console.log('not a valid argument (file or url)');
    process.exit(1);
}