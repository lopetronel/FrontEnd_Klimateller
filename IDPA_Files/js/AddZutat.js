$(document).ready(function() {
  loadGericht();
  loadZutaten();
  prepareSearchUI();
});

let gericht;
let zutaten;
let categories = ["fleisch", "gemuese_fruechte", "kh", "getraenke"];
let category;

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
}

function updateZutatenUI() {
  //Load the GUI
  $("#libraryitems").html("");
  for(let i = 0;i<zutaten.length;i++) {
    if(category == 0 || zutaten[i].category == categories[category - 1]) {
      $("#libraryitems").append(`<div class="zutatitem"><div class="wrap2">
      <h1>` + zutaten[i].product_name + `</h1><br>
        <a align="right"><button class="button2"><ion-icon name="add-outline"></ion-icon></button></a>
      </div>
      <hr class="accessory"></div>`);
      const indexCopy = i;
      $(".button2").eq(indexCopy).click(function() {
        addZutat(indexCopy);
      });
    }
  }
}

function prepareSearchUI() {
  category = 0;
  $(".nav__link").each(function(index) {
    $(".nav__link").eq(index).click(function() {
      category = index;
      $(".nav__link").each(function(index2) {
        if(index == index2) {
          $(".nav__link").eq(index2).children().eq(0).addClass("nav__link--active");
        }else {
          $(".nav__link").eq(index2).children().eq(0).removeClass("nav__link--active");
        }
        updateZutatenUI();
      });
    });
  });

  $("#zutatensearch").on('keyup input', function() {
    filterZutaten();
  });
  updateZutatenUI();
}

function filterZutaten() {
  let value = $("#zutatensearch").val();
  $(".zutatitem").each(function() {
    let text = $(this).children().eq(0).children().eq(0).text();
    let searchResult = text.toLowerCase().trim().indexOf(value.toLowerCase())
    if(searchResult >= 0) {
      $(this).css("display", "block");
    }else {
      $(this).css("display", "none");
    }
  });
}

function addZutat(index) {
  gericht.ingredients.push({product_emissions_id: zutaten[index].types[0].product_emissions_id, product_amount: 100});
  saveGericht();
  location.href = "add.html";
}
