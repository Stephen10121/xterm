const input = document.getElementById("input");
const saveSection = document.getElementById("saved-section");
let history = [];
let pointer = 0;

let person = prompt("Password", "");
let passwordIt;
if (person == null || person == "") {
  window.close();
} else {
  passwordIt = person;
}

input.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.key === "ArrowUp") {
    pointer=pointer===history.length ? pointer:pointer+1;
    input.value = pointer===0?input.value :history.reverse()[pointer-1];
    if (pointer !== 0) {
      history.reverse();
    }
  }

  if (e.key === "ArrowDown") {
    pointer = pointer>0 ? pointer-1 : pointer;
    input.value = pointer===0 ? null :history.reverse()[pointer-1];
    if (pointer !== 0) {
      history.reverse();
    }
  }
  
  if (e.key === "Enter") {
    if (input.value === "hisclear") {
      history = [];
      pointer = 0;
      input.value=null;
      saveSection.innerText = ``;
      return;
    }
    pointer = 0;
    postIt(input.value);
    saveSection.innerText += `root@192.168.0.85 # ${input.value}`;
    saveSection.innerHTML += "<br>";
    history.push(input.value);
    input.value=null;
  }
});

const postIt = (what) => {
  axios.post("/command", {
    command: what,
    password: passwordIt
  })
  .then((res) => {
    console.log(res);
    saveSection.innerText += res.data.msg;
  })
  .catch((error) => {
    console.log(error);
  }); 
}