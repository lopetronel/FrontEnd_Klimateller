$(document).ready(function() {
  loadGericht();
  loadZutaten();
});

let gericht;
let zutaten;

function loadGericht() {
  gericht = JSON.parse(localStorage.getItem("gericht"));
}

function saveGericht() {
  localStorage.settItem("gericht", JSON.stringify(gericht));
}

function loadZutaten() {
   zutaten = JSON.parse(localStorage.getItem("zutaten"));

   //load the GUI
}

function addZutatSave(index) {
  gericht.ingredients.push(zutaten[index]);
  saveGericht();
  location.href = "add.html";
}
