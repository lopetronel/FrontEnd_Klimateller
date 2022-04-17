$(document).ready(function() {
  loadZutaten(loadGericht);
  $("#submitgerichtbutton").click(function() {
    submitGericht();
  })
});

let mode;
let user_meal_id;
let zutaten;
let gericht;
let addedIngredient;

function getZutatByEmissionsID(product_emissions_id) {
  for(let i = 0;i<zutaten.length;i++) {
    for(let j = 0;j<zutaten[i].types.length;j++) {
      if(zutaten[i].types[j].product_emissions_id == product_emissions_id) {
        return zutaten[i];
      }
    }
  }
}

function loadGericht() {
  let data = localStorage.getItem("gericht");
  mode = localStorage.getItem("mode");
  user_meal_id = localStorage.getItem("user_meal_id");
  if(mode == undefined || !(mode == "edit" || mode=="add")) {
    location.href = "index.html";
    return;
  }

  if(data != undefined) {
    gericht = JSON.parse(data);
  }else {
    gericht = {name:"", portions:1, ingredients:[]};
  }

  let gerichtNameInput = $("#gerichtname");
  gerichtNameInput.val(gericht.name);
  gerichtNameInput.keyup(function() {
    gericht.name = gerichtNameInput.val();
    saveGericht();
  });

  let portionsInput = $("#portions");
  portionsInput.val(gericht.portions);

  portionsInput.keyup(function() {
    gericht.portions = parseInt(portionsInput.val());
    updatePreview();
    saveGericht();
  })

  //Add the ingredient inputs

  $("#zutatencontainer").html("");

  for(let i = 0;i<gericht.ingredients.length;i++) {
    const zutat = getZutatByEmissionsID(gericht.ingredients[i].product_emissions_id);

    let result = "";
    result += "	<div class='text_container2'><h3>" + zutat.product_name + "</h3>";

    result += "<select class='ingredienttypeselect'>";

    const types = zutat.types;
    for(let j = 0;j<types.length;j++) {
      let selected = (gericht.ingredients[i].product_emissions_id == types[j].product_emissions_id) ? "selected" : "";
      result +=  "<option " + selected + ">" + types[j].product_emissions_name + "</option>";
    }
    result +=  "</select>";

    result +=  "<h5>Gramm:</h5><input type=\"number\" class=\"gramm\" name=\"gramm\" value=\"" + gericht.ingredients[i].product_amount + "\">";

    result +=  "<div class=\"right\"><a class=\"button-62\">Löschen</a></div>";

    result +=  "</div><hr class='accessory'>";

    $("#zutatencontainer").append(result);

    const indexCopy = i;

    $(".ingredienttypeselect").eq(indexCopy).change(function() {
        gericht.ingredients[indexCopy].product_emissions_id = types[$(".ingredienttypeselect").eq(indexCopy).prop('selectedIndex')].product_emissions_id;
        saveGericht();
        updatePreview();
    });

    $(".gramm").eq(indexCopy).keyup(function() {
      gericht.ingredients[indexCopy].product_amount = parseInt($(".gramm").val());
      saveGericht();
      updatePreview();
    });

    $(".button-62").eq(indexCopy).click(function() {
      deleteZutat(indexCopy);
    });
  }
  updatePreview();
}

function deleteZutat(index) {
  gericht.ingredients.splice(index, 1);
  saveGericht();
  loadGericht();
}

function loadZutaten(callback) {
  let data = localStorage.getItem("zutaten");
  if(data != undefined) {
    zutaten = JSON.parse(data);
    callback();
  }else {
    makeRequest("GET", "https://klimateller.eliaschenker.com/api/getzutaten.php", "", function(data) {
      zutaten = data["result"];
      localStorage.setItem("zutaten", JSON.stringify(zutaten));
      callback();
    });
  }
}

function updatePreview() {
  let co2_emissions = 0;
  let proteins = 0;
  let carbohydrates = 0;
  let fats = 0;

  for(let i = 0;i<gericht.ingredients.length;i++) {
      const zutat = getZutatByEmissionsID(gericht.ingredients[i].product_emissions_id);
      //Add CO2 emissions
      for(let j = 0;j<zutat.types.length;j++) {
        if(zutat.types[j].product_emissions_id == gericht.ingredients[i].product_emissions_id) {
          co2_emissions += zutat.types[j].co2_emissions / 1000 * gericht.ingredients[i].product_amount;
          break;
        }
      }

      //Add Proteins, Carbohydrates, fats
      proteins += zutat.product_proteins / 100 * gericht.ingredients[i].product_amount;
      carbohydrates += zutat.product_carbohydrates / 100 * gericht.ingredients[i].product_amount;
      fats += zutat.product_fats / 100 * gericht.ingredients[i].product_amount;
  }

  co2_emissions *= gericht.portions;
  proteins *= gericht.portions;
  carbohydrates *= gericht.portions;
  fats *= gericht.portions;

  $("#meal_co2").text(co2_emissions + "kg CO2-Äq.")
  $("#meal_carbohydrates").text("Kohlenhydrate: " + carbohydrates + "g");
  $("#meal_proteins").text("Proteine: " + proteins + "g");
  $("#meal_fats").text("Fett: " + fats + "g");
}

function saveGericht() {
  localStorage.setItem("gericht", JSON.stringify(gericht));
}

function submitGericht() {
  let file = mode == "add" ? "addgericht.php" : "editgericht.php";
  makeRequest("POST", "https://klimateller.eliaschenker.com/api/" + file, {"meal": JSON.stringify(gericht), "user_meal_id" : user_meal_id}, function(data) {
    location.href = "index.html";
  });
}
