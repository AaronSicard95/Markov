/** Textual markov chain generator */
const fs = require('fs');
const puctuation = [".","!","?"];
const axios = require('axios');
const sh = require('sanitize-html');


class MarkovMachine {

    /** build markov machine; read in text.*/
  
    constructor(text) {
      let words = text.split(/[ \r\n]+/);
      this.words = words.filter(c => c !== "");
      this.key={}
      this.makeChains();
    }
  
    /** set markov chains:
     *
     *  for text of "the cat in the hat", chains will be
     *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */
  
    makeChains() {
      for (let i=0; i < this.words.length-1; i++){
        let checkWord = this.words[i].toLowerCase();
        if (checkWord in this.key){
            this.key[checkWord].push(this.words[i+1].toLowerCase());
        }else{
            this.key[checkWord]= [this.words[i+1].toLowerCase()];
        }
      }
    }
  
  
    /** return random text from chains */
  
    makeText(numWords = 100) {
      let story = this.words[(Math.round(Math.random()*(this.words.length-1)))];
      let lastWord = story;
      let nextWord = "";
      for (let i=1;i<numWords;i++){
        if (this.key[lastWord]){
            nextWord = this.key[lastWord][(Math.round(Math.random()*(this.key[lastWord].length-1)))]
        } else{
            nextWord = this.words[(Math.round(Math.random()*(this.words.length-1)))];
        }
        if (puctuation.includes(lastWord.slice(-1))){
            story = `${story} ${capitalize(nextWord)}`
        } else{
            story = `${story} ${nextWord}`
        }
        lastWord = nextWord;
        }
        console.log(story);
    }
}

let readFile = async function(path){
    fs.readFile(path, "utf8", function(err, data){
        if(err){
            console.error(err);
            process.exit(1);
        }
        start(data);
    })
}

let readURL = async function(path){
    let text = await axios.get(path);
    start((text.data));
}

let start = async function(text){
    let y = new MarkovMachine(text);
    y.makeText();
    //console.log(y.key);
}

let capitalize = function(word){
    return word.charAt(0).toUpperCase()+word.slice(1);
}


module.exports = {
    fs:fs,
    puctuation:puctuation,
    MarkovMachine:MarkovMachine,
    readFile:readFile,
    start:start,
    readURL:readURL
}