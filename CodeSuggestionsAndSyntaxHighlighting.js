let tags = ["<html></html>","<head></head>","<body></body>",
"<title></title>","<style></style>","<meta></meta>","<script></script>",
"<p></p>","<span></span>","<div></div>","<form></form>","<br>",
`<input type="">`,"<button></button>","<select></select>","<hr>",
"<option></option>","<h1></h1>","<h2></h2>","<h3></h3>","<h4></h4>",
"<h5></h5>","<h6></h6>","<link></link>","<iframe></iframe>"];
let attributes = [`class=""`, `id=""`, `src=""`, `href=""`];

let highlights = [tags, attributes];


let textBeforeEdit = (textArea.innerText == undefined) ? "" : textArea.innerText;
let newText;
let prevWord;
let curPos; // Stores Position of cursor
let tabSize = "  ";// Tab size is two spaces
let indent = "";

const suggestionsBar = document.getElementById("innerSuggestionsBar");

textArea.addEventListener("keyup", detectKeyPress);

function detectKeyPress(event){
  getCurPos();
  suggestCode();
  if(event.keyCode != 8){
    // 8 is the keyCode for backspace
    bracketAutocomplete(event.key);
  }else{
    if(newText.charAt(curPos) == " " && newText.charAt(curPos-1)==" "){
      indent.replace("  ", "");
    }
  }
  
  if(event.keyCode == 13){
    // keyCode = 13 is the key Code for enter key
    displayLineNo();
    autoIndent();
  }
}
function getCurPos(){
  // getCurPos = gets cursor position while typing
  newText = textArea.innerText;
  let changedAtIndex; // To store at what index was to character changed
  
  for(let i=0;i<textBeforeEdit.length;i+=100){
    //console.log(textBeforeEdit.charAt(i), newText.charAt(i))
    if(textBeforeEdit.charAt(i) != newText.charAt(i)){
      changedAtIndex = i;
      break;
    }
    else{
      changedAtIndex = textBeforeEdit.length;
    }
  }
  
  for(let i=(changedAtIndex-100);i<changedAtIndex;i++){
    if(i<0){ 
      i=0;
      changedAtIndex = 100;
    }
    if(textBeforeEdit.charAt(i) != newText.charAt(i)){
      curPos = i;
      console.log(textBeforeEdit.charAt(i), i)
      break;
    }
  }
  textBeforeEdit = newText;
  console.log("curPos: "+curPos);
}

function suggestCode(){
  suggestionsBar.innerHTML = "";
  findPrevWord();
  searchIndexOfSuggestion();
}

function findPrevWord(){
  prevWord = "";
  let i = curPos;
  if(curPos<3){
    prevWord = textArea.innerText.slice(0, 2);
    return;
  }
  while(newText.charAt(i) != " " && newText.charAt(i)!="." && newText.charAt(i) != undefined &&
  newText.charAt(i)!="(" && newText.charAt(i)!=")" && newText.charAt(i)!=";" &&
  newText.charAt(i)!="{" && newText.charAt(i)!="}" && newText.charAt(i)!=`"` &&
  newText.charAt(i)!=":" && newText.charAt(i)!="<" && newText.charAt(i)!=">" &&
  newText.charAt(i)!="=" && newText.charAt(i)!="+" && newText.charAt(i)!="-" &&
  newText.charAt(i)!="*" && newText.charAt(i)!="/" && newText.charAt(i)!="?" &&
  newText.charAt(i)!="&" && newText.charAt(i)!="|" && newText.charAt(i)!="!" &&
  newText.charAt(i)!="" && newText.charAt(i)!="\n"){
    prevWord = newText.charAt(i) + prevWord;
    i--;
  }
  prevWord = prevWord.trim();
}

function searchIndexOfSuggestion(){
  let indices = [];
  for(let i=0;i<highlights.length;i++){
    for(let j=0;j<highlights[i].length;j++){
      if(isSimilarTo(highlights[i][j], prevWord)){
        //<span class="suggestion">html</span>
        let span = document.createElement("span");
        span.setAttribute("class", "suggestion");
        span.innerText = highlights[i][j];
        suggestionsBar.appendChild(span);
        span.setAttribute("onclick", `insertSuggestion(${i},${j})`);
      }
    }
  }
}
function isSimilarTo(str1, str2){
  let str1len = str1.length;
  str1 = str1.replace(str2, "");
  if(str1.length == str1len){
    return false;
  }
  else{
    return true;
  }
}

function insertSuggestion(i, j){
  let str1 = newText.slice(0, curPos-prevWord.length +1);
  let str2 = newText.slice(curPos+prevWord.length, newText.length);
  let newStr = str1 + highlights[i][j]+ " " + str2;
  if(newStr != undefined){
    textArea.innerText = newStr;
  }
}

function displayLineNo(){
  let str1 = newText;
  let str2 = str1.replaceAll("\n", "..");
  let noOfLines = str2.length - str1.length;
  let numbers = "";
  for(let i=1;i<=noOfLines;i++){
    numbers += (i + "\n");
  }
  document.querySelectorAll("#lineNoDisplay").innerText = numbers;
}

function bracketAutocomplete(){
  
}

function autoIndent(){
  let str1 = newText.slice(0, curPos-prevWord.length +1);
  let str2 = newText.slice(curPos+prevWord.length, newText.length);
  
}