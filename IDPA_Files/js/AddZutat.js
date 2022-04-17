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
  localStorage.setItem("gericht", JSON.stringify(gericht));
}

function loadZutaten() {
   let data = localStorage.getItem("zutaten");
   if(data == undefined) {
     location.href = "add.html";
     return;
   }
   zutaten = JSON.parse(data);

   //Load the GUI
   for(let i = 0;i<zutaten.length;i++) {
     $("#libraryitems").append(`<div class="wrap2">
     <h1>` + zutaten[i].product_name + `</h1><br>
       <a align="right"><button class="button2"><ion-icon name="add-outline"></ion-icon></button></a>
     </div>
     <hr class="accessory">`);
     const indexCopy = i;
     $(".button2").eq(indexCopy).click(function() {
       addZutat(indexCopy);
     });
   }
}

function addZutat(index) {
  gericht.ingredients.push({product_emissions_id: zutaten[index].types[0].product_emissions_id, product_amount: 100});
  saveGericht();
  location.href = "add.html";
}
