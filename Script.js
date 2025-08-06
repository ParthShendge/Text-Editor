const container = document.getElementById("container");
const textArea = document.getElementById("textArea");

// Side Menu variables
const menu    = document.getElementById("menu");
const menubtn = document.getElementById("menubtn");
let menuOpen  = false;



// File and Folder operations
class File{
  constructor(name, path, fileContent){
    this.name = name;
    this.path = path;
    if(fileContent == undefined){
      this.fileContent = "";
    }
    else{
      this.fileContent = fileContent;
    }
  }
  setFileContent(text){
    this.fileContent = text;
  }
  getFilecontent(){
    return this.fileContent;
  }
}

class Folder{
  constructor (name, id){
    this.name = name;
    if(id==undefined){
      this.id = 1;
    }
    else{
      this.id = id;
    }
    this.files = [];// All the files in this folder will be stored in this array
  }
}



const addFolderbtn = document.getElementById("addFolderbtn");
addFolderbtn.onclick = ()=>{createFolder(0)};

let folders = [];
let openFileIndex; // Stores index of currently open file
let openFolderIndex;
let folderOptionsbtns = [];

// Initializing

createDefault();
function createDefault(){
  let DefaultFolder = new Folder("Default Folder", 1);
  folders.push(DefaultFolder);
  let folder = document.createElement("span");
  folder.setAttribute("class", "folder");
  folder.innerHTML = `<span class="folderName">Default Folder
  <button class="folderOptionsbtn" onclick = "displayFolderOptions(1)">•••</button></span>`;
  menu.appendChild(folder);
  folder.firstChild.addEventListener("click",()=>{
    if(folder.style.height == "2rem"){
      folder.style.height = "auto";
    }
    else{
      folder.style.height = "2rem";
    }
  }, false);
  
  let defaultFile = new File("Untitled.txt", "Default Folder", textArea.innerText);
  folders[0].files.push(defaultFile);
  let file = document.createElement("span");
  file.setAttribute("class", "file");
  file.innerHTML = `<span class="fileName">Untitled.txt</span><button class="fileOptionsbtn" onclick="displayFileOptions('Untitled.txt')">•••</button>`;
  file.addEventListener("click", detectFileClick);
  folder.appendChild(file);
}


function createFolder(pathId){
  closePopUp();
  popUp(`
  <input type="text" class="popUpTextinput" id="folderNameinp" placeholder="Enter Folder Name"><br>
  <button class="popUpbtn" onclick="closePopUp()">Cancel</button>
  <button class="popUpbtn" onclick="addFolder(${pathId})">OK</button>
  `);
}

function addFolder(pathId){
  let folderNameinp = document.getElementById("folderNameinp");
  
  if(folderNameinp.value != ""){
    let folderName = folderNameinp.value.trim();
    for(let i=0; i<folders.length;i++){
      if(folders[i].name == folderName){
        alert("This folder already exists .");
        return;
      }
    }
    folders.push(new Folder(folderName, folders[folders.length-1].id+1));
    let folder = document.createElement("span");
    folder.setAttribute("class", "folder");
    folder.innerHTML = `<span class="folderName">${folderName}
    <button class="folderOptionsbtn" onclick = "displayFolderOptions(${folders[folders.length-1].id})">•••</button></span>`;
    
    if(pathId == 0){
      menu.appendChild(folder);
    }
    else{
      let folderNames = document.querySelectorAll(".folderName");
      let index; // To store index of the folder in folders[] with id == pathId
      for(let i=0;i<folders.length;i++){
        if(folders[i].id == pathId){
          index = i;
          folders[i].files.push(folders[folders.length-1]);
          break;
        }
      }
      for(let i=0;i<folderNames.length;i++){
        let splicedName = folderNames[i].textContent.slice(0, folderNames[i].textContent.length - 4).trimEnd();
        console.log(splicedName)
        if(splicedName == folders[index].name){
          document.querySelectorAll(".folder")[i].appendChild(folder);
        }
      }
    }
    
    folder.firstChild.addEventListener("click",()=>{
      if(folder.style.height == "2rem"){
        folder.style.height = "auto";
      }
      else{
        folder.style.height = "2rem";
      }
    }, false);
    
    notify("Folder Created", 1000);
    closePopUp();
  }
  else{
    alert("Please Enter Folder's Name");
  }
}

function renameFolder(id, confirmed){
  if(!confirmed){
    closePopUp();
    popUp(`<input type="text" id="renameFolderinp" placeholder="Enter New Name"><br>
    <button onclick="closePopUp()" class="popUpbtn">Cancel</button>
    <button onclick="renameFolder(${id}, true)" class="popUpbtn">OK</button>
    `);
  }
  else{
    let folderNames = document.getElementsByClassName("folderName");
    for(let i=0;i<folders.length;i++){
      if(folders[i].id == id){
        for(let j=0;j<folderNames.length;j++){
          if(folderNames[j].textContent.slice(0, folderNames[j].textContent.length-4).trim()  == folders[i].name){
            folderNames[j].innerHTML = `<span class="folderName">${document.getElementById("renameFolderinp").value}
    <button class="folderOptionsbtn" onclick = "displayFolderOptions(${id})">•••</button></span>`;
            break;
          }
        }
        
        folders[i].name = document.getElementById("renameFolderinp").value;
        
        for(j=0;j<folders[i].files.length;j++){
          folders[i].files[j].path = folders[i].name;
        }
        break;
      }
    }
    closePopUp();
    notify("Renamed Successfully", 1000);
  }
}

function deleteFolder(id, confirmed){
  if(id == 1){
    alert("You cannot delete Default Folder .");
    return;
  }
  if(!confirmed){
    closePopUp();
    popUp(`This folder will be deleted<br>
    <button onclick="closePopUp()" class="popUpbtn">Cancel</button>
    <button onclick="deleteFolder(${id}, true)" class="popUpbtn">Confirm</button>
    `);
  }
  else{
    let index;
    for(let i=0;i<folders.length;i++){
      if(folders[i].id == id){
        index = i;
      }
    }
    let folderNames = document.querySelectorAll(".folderName");
    for(let i=0;i<folderNames.length;i++){
      if(folderNames[i].textContent.slice(0, folderNames[i].textContent.length-4).trim() == folders[index].name){
        document.querySelectorAll(".folder")[i].remove();
        folders.splice(i,1);
        break;
      }
    }
    closePopUp();
    notify("Folder Deleted", 1000);
  }
}

function displayFolderOptions(folderId){
  closePopUp();
  popUp(`<span class="folderOption" onclick="createFile(${folderId})">New File
  </span>
  <span class="folderOption" onclick="createFolder(${folderId})">New Folder
  </span>
  <span class="folderOption" onclick="deleteFolder(${folderId}, false)">Delete Folder
  </span>
  <span class="folderOption" onclick="renameFolder(${folderId}, false)">Rename Folder</span>
  <br><button class="popUpbtn" onclick="closePopUp()">close</button>`);
}

function createFile(id){
  closePopUp();
  popUp(`<input id="fileNameInp" type="text" placeholder="Enter File Name"><br>
  <button class="popUpbtn" onclick="closePopUp()">Cancel</button>
  <button class="popUpbtn" onclick="addFile(${id})">OK</button>
  `);
}

function addFile(id){
  let folderNames = document.querySelectorAll(".folderName");
  let folderelmnts = document.querySelectorAll(".folder")
  let index;
  let name = document.getElementById("fileNameInp").value.trim();
  let file; 
  
  if(name == ""){
    alert("Please Enter the name of file .");
    return;
  }
  
  for(let i=0;i<folders.length;i++){
    if(folders[i].id == id){
      index = i;
      break;
    }
  }
  
  for(let i=0;i<folders[index].files.length; i++){
    
    if(folders[index].files[i].name == name){
      alert("A file with this name exists in this folder . Please enter a different name .")
      return;
    }
  }
  
  file = new File(name, folders[index].name);
  folders[index].files.push(file);
  
  let span = document.createElement("span");
  span.setAttribute("class", "file");
  span.innerHTML = `<span class="fileName">${file.name}</span><button class="fileOptionsbtn" onclick="displayFileOptions('${file.name}')">•••</button>`;
  span.addEventListener("click", detectFileClick);
  
  for(let i=0;i<folderNames.length;i++){
    if(folderNames[i].textContent.slice(0, folderNames[i].textContent.length-4).trim() == file.path){
      folderelmnts[i].appendChild(span);
      break;
    }
  }
  
  closePopUp();
  notify("File Created", 1000);
}

function displayFileOptions(fName){
  //fName = Name of the file which we want to perform operation on
  closePopUp();
  popUp(`<span onclick="fileOperations('${fName}', 1)">Delete File</span><br><br><span onclick="fileOperations('${fName}', 2)">Rename File</span><br><button class="popUpbtn" onclick="closePopUp()">Cancel</button>`);
}

function fileOperations(fName, operation=0){
  /*operation 0 => (Default)
    operation 1 => Delete File
    operation 2 => Rename File */
    closePopUp();
    let folderIndex, fileIndex, fileNameIndex;
    let fileNames = document.querySelectorAll(".file");
    for(let i=0;i<folders.length;i++){
      for(let j=0; j<folders[i].files.length;j++){
        if(folders[i].files[j].name == fName){
          folderIndex = i;
          fileIndex   = j;
          break;
        }
      }
    }
    for(let i=0;i<fileNames.length;i++){
      if(fileNames[i].textContent.slice(0, fileNames[i].textContent.length-3).trim()==fName){
        fileNameIndex = i;
        break;
      }
    }
    
  switch(operation){
    case 0:
      alert("Error Unknown");
    break;
    case 1:
      function deleteFile(){
        closeFile(folders[folderIndex].files[fileIndex].name);
        folders[folderIndex].files.splice(fileIndex,1);
        fileNames[fileNameIndex].remove();
        closePopUp();
        notify("File Deleted", 1000);
      }
      popUp(`This File will be deleted permanently .<br>
      <button class="popUpbtn" onclick="closePopUp()">Cancel</button>
      <button class="popUpbtn" id="deleteFilebtn">Confirm</button>`);
      document.getElementById("deleteFilebtn").addEventListener("click", deleteFile);
      
    break;
    case 2:
      function renameFile(){
        let newName = document.getElementById("renameFileinp").value.trim();
        
        for(let i=0;i<folders[folderIndex].files.length; i++){
          if(folders[folderIndex].files[i].name == newName){
          alert("A file with this name exists in this folder . Please enter a different name .")
          return;
          }
        }
        
        folders[folderIndex].files[fileIndex].name = newName;
        fileNames[fileNameIndex].innerHTML = `<span class="fileName">${newName}</span><button class="fileOptionsbtn" onclick="displayFileOptions('${newName}')">•••</button>`;
        closePopUp();
        notify("File Renamed");
      }
      popUp(`<input id="renameFileinp" placeholder="Enter New Name"><br>
      <button class="popUpbtn" onclick="closePopUp()">Cancel</button>
      <button class="popUpbtn" id="renameFilebtn">Confirm</button>
      `);
      document.getElementById("renameFilebtn").addEventListener("click", renameFile);
    break;
  }
}


//Code for file tabs, opening and saving files 
let tabList = document.getElementById("innerTabList");
let openFileName;

function detectFileClick(event){
  //<span class="fileTab">Untitled.txt<button class="fileClosebtn">x</button></span>
  let fName = event.currentTarget.innerText.replace("•••", "");
  let fileTabNames = document.getElementsByClassName("fileTabName");
  
  navigate(fName);
  
  for(let i=0;i<fileTabNames.length;i++){
    if(fileTabNames[i].innerText == fName){
      return;
    }
  }
  
  let fileTab = document.createElement("span");
  fileTab.setAttribute("class",  "fileTab");
  fileTab.innerHTML = `<span class="fileTabName" onclick="navigate('${fName}')">${fName}</span> <button class="fileClosebtn" onclick="closeFile('${fName}')">x</button>`;
  innerTabList.appendChild(fileTab);
}
function closeFile(fName){
  if(openFileName == fName){
    navigate("Untitled.txt");
  }
  let fileTabNames = document.getElementsByClassName("fileTabName");
  let fileTabs = document.getElementsByClassName("fileTab");
  for(let i=0;i<fileTabNames.length;i++){
    if(fileTabNames[i].innerText == fName){
      fileTabs[i].remove();
      notify("File Closed");
      return;
    }
  }
}

function saveFile(fName){
  for(let i=0;i<folders.length;i++){
    for(let j=0;j<folders[i].files.length;j++){
      if(folders[i].files[j].name == fName){
        folders[i].files[j].setFileContent(textArea.innerText);
        notify("File Saved");
        return;
      }
    }
  }
}

function navigate(fName){
  if(openFileName == fName){
    saveFile(fName);
    return;
  }
  else{
    openFileName = fName;
    for(let i=0;i<folders.length;i++){
      for(let j=0;j<folders[i].files.length;j++){
        if(folders[i].files[j].name == fName){
          textArea.innerText = folders[i].files[j].getFilecontent();
          return;
        }
      }
    }
  }
}


// Code for SideBar Menu

menubtn.addEventListener("click", toggleMenu);
function toggleMenu(){
  if(menuOpen){
    menu.style.transform = "translate(-100%, 0)";
    menuOpen = false;
  }
  else{
    menu.style.transform = "translate(0,0)";
    menuOpen = true;
  }
}



// Code Preview
const closePreviewbtn = document.getElementById("closePreviewbtn");
const frame = document.getElementById("codePreview");

closePreviewbtn.addEventListener("touchmove", dragClosebtn);

function closePreview(){
  frame.style.zIndex = "-2";
  closePreviewbtn.style.zIndex = "-2";
}

function preview(){
  frame.style.zIndex = "10";
  frame.srcdoc = textArea.textContent;
  closePreviewbtn.style.zIndex = "11";
  notify("Running...", 1000);
}

function dragClosebtn(touch){
  if(touch.cancelable){
    touch.preventDefault();
  }
  closePreviewbtn.style.top = touch.touches[0].clientY + "px";
  closePreviewbtn.style.left = touch.touches[0].clientX + "px";
}


//Code for settings

let settings = {
  background    : "rgba(10, 10, 20, 0.8)",
  textColor     : "white",
  fontSize      : "0.8rem",
  fontFamily    : "Quicksand",
  lineHeight    : "1.5rem",
  letterSpacing : "0",
  wordSpacing   : "0.3rem",
  showLineNumber: true,
  textWrap      : true,
  
  // Code preview settings
  closebtnSize: "100%",
  closebtnOpacity : "100%"
}

const settingsbtn = document.getElementById("settingsbtn");
settingsbtn.addEventListener('click', ()=>{
  let menu=document.getElementById("settingsMenu")
  menu.style.transform = "rotateY(0deg)";
  menu.style.zIndex = "100";
});

function closeSettings(){
  let menu=document.getElementById("settingsMenu")
  menu.style.transform = "rotateY(90deg)";
  menu.style.zIndex = "-10";
}
function applySettings(){
  let closePreviewbtn = document.getElementById("closePreviewbtn");
  let es = textArea.style; // es = Editor Style
  let inp = document.querySelectorAll(".settingsinp");
  es.background    = inp[0].value;
  es.color         = inp[1].value;
  es.fontSize      = inp[2].value + "rem";
  es.fontFamily    = inp[3].value;
  es.lineHeight    = inp[4].value + "rem";
  es.letterSpacing = inp[5].value + "rem";
  es.wordSpacing   = inp[6].value + "rem";
  
  closePreviewbtn.style.transform = "scale("+ inp[9].value +","+ inp[9].value +")";
  closePreviewbtn.style.filter = "opacity("+ inp[10].value +"%)";
  
  document.getElementById("lineNoDisplay").style.lineHeight = inp[4].value + "rem";
  closeSettings();
  
  if(!inp[7].checked){document.getElementById("lineNoDisplay").style.display= "none";}
  else{document.getElementById("lineNoDisplay").style.display = "block";}
  
  if(inp[8].checked){es.whiteSpace = "normal";}else{es.whiteSpace = "nowrap";}
}



// Other functions
function alert(message){
  let pop = document.createElement("div");
  let closebtn = document.createElement("button");
  pop.setAttribute("class", "alert");
  closebtn.setAttribute("class", "closeAlertbtn");
  pop.innerHTML = message;
  closebtn.textContent = "Close";
  pop.appendChild(closebtn);
  closebtn.addEventListener("click",()=>{
    container.removeChild(pop);
  });
  container.appendChild(pop);
}

function popUp(content){
  let popUp = document.createElement("div");
  popUp.setAttribute("class", "popUp");
  popUp.innerHTML = content;
  container.appendChild(popUp);
}

function closePopUp(){
  let popUps = document.getElementsByClassName("popUp");
  for(let i=0; i<popUps.length; i++){
      container.removeChild(popUps[i]);
  }
}

function notify(message, duration=1000){
  let toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.top = "2rem";
  setTimeout(()=>{
    toast.style.top = "-5rem";
    toast.innerText = "Toast";
  }, duration);
}