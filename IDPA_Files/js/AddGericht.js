//Sobald das Dokument geladen wurde, Zutaten und Gericht laden
$(document).ready(function() {
  loadZutaten(loadGericht);
  $("#submitgerichtbutton").click(function() {
    submitGericht();
  })
});

let mode; //In welchem Modus befindet sich die Eingabe (add oder edit)
let user_meal_id; //Falls edit: Welches Gericht (mit welcher id) wird editiert
let zutaten; //Array von zutaten
let gericht; //Gerichte-Objekt

//Gibt eine Zutat mit der Typen_ID zurück
function getZutatByEmissionsID(product_emissions_id) {
  for(let i = 0;i<zutaten.length;i++) {
    for(let j = 0;j<zutaten[i].types.length;j++) {
      if(zutaten[i].types[j].product_emissions_id == product_emissions_id) {
        return zutaten[i];
      }
    }
  }
}

//Ladet das Gericht und bereitet das GUI vor
function loadGericht() {
  let data = localStorage.getItem("gericht");
  mode = localStorage.getItem("mode");
  user_meal_id = localStorage.getItem("user_meal_id");
  if(mode == undefined || !(mode == "edit" || mode=="add")) {
    location.href = "index.html";
    return;
  }

  //Falls bereits ein Gericht in der Cache ist, dieses verwenden (falls der Nutzer
  //von der Zutatenbibliothek zurückkehrt), sonst ein leeres erstellen
  if(data != undefined) {
    gericht = JSON.parse(data);
  }else {
    gericht = {name:"", portions:1, ingredients:[]};
  }

  let gerichtNameInput = $("#gerichtname");
  gerichtNameInput.val(gericht.name);
  gerichtNameInput.on('keyup input', function() {
    gericht.name = gerichtNameInput.val();
    saveGericht();
  });

  let portionsInput = $("#portions");
  portionsInput.val(gericht.portions);

  portionsInput.on('keyup input', function() {
    let value = parseInt(portionsInput.val());
    gericht.portions = isNaN(value) ? 0 : value;
    updatePreview();
    saveGericht();
  })

  $("#zutatencontainer").html("");

  //Durch die Zutaten des Gerichtes iterieren und diese dem GUI hinzufügen
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

    result +=  "<h5>Gramm:</h5><input type=\"number\" class=\"gramm\" name=\"gramm\" min=1 max=100000 value=\"" + gericht.ingredients[i].product_amount + "\">";

    result +=  "<div class=\"right\"><a class=\"button-62\">Löschen</a></div>";

    result +=  "</div><hr class='accessory'>";

    $("#zutatencontainer").append(result);

    const indexCopy = i;

    $(".ingredienttypeselect").eq(indexCopy).change(function() {
        gericht.ingredients[indexCopy].product_emissions_id = types[$(".ingredienttypeselect").eq(indexCopy).prop('selectedIndex')].product_emissions_id;
        saveGericht();
        updatePreview();
    });

    $(".gramm").eq(indexCopy).on('keyup input', function() {
      let value = parseInt($(".gramm").eq(indexCopy).val());
      gericht.ingredients[indexCopy].product_amount = isNaN(value) ? 0 : value;
      saveGericht();
      updatePreview();
    });

    $(".button-62").eq(indexCopy).click(function() {
      deleteZutat(indexCopy);
    });
  }
  saveGericht();
  updatePreview();
}

//Löschen einer Zutat des Gerichtes mit einem Index
function deleteZutat(index) {
  gericht.ingredients.splice(index, 1);
  saveGericht();
  loadGericht();
}

//Ladet die Zutaten und ruft beim Erfolg das callback auf
function loadZutaten(callback) {
  //Falls die Zutaten bereits geladen wurden (ins LocalStorage), muss die Request
  //nicht mehr durchgeführt werden.
  let data = localStorage.getItem("zutaten");
  if(data != undefined) {
    zutaten = JSON.parse(data);
    callback();
  }else {
    makeRequest("GET", "getzutaten.php", "", function(data) {
      zutaten = data["result"];
      localStorage.setItem("zutaten", JSON.stringify(zutaten));
      callback();
    });
  }
}

//Aktualisiert die Previews in dem Gericht-Screen
function updatePreview() {
  let co2_emissions = 0;
  let proteins = 0;
  let carbohydrates = 0;
  let fats = 0;
  let kcal = 0;

  //Durch die Zutaten des Gerichtes iterieren
  for(let i = 0;i<gericht.ingredients.length;i++) {
      //Zutat aus der Zutatenbibliothek mit der Typen-ID erhalten
      const zutat = getZutatByEmissionsID(gericht.ingredients[i].product_emissions_id);
      //Durch die Typen iterieren, um den CO2-Wert dieses Typen zu erhalten
      for(let j = 0;j<zutat.types.length;j++) {
        if(zutat.types[j].product_emissions_id == gericht.ingredients[i].product_emissions_id) {
          co2_emissions += zutat.types[j].co2_emissions / 1000 * gericht.ingredients[i].product_amount;
          break;
        }
      }

      //Proteine, Kohlenhydrate, Fette und Kilokalorien hinzufügen
      proteins += zutat.product_proteins / 100 * gericht.ingredients[i].product_amount;
      carbohydrates += zutat.product_carbohydrates / 100 * gericht.ingredients[i].product_amount;
      fats += zutat.product_fats / 100 * gericht.ingredients[i].product_amount;
      kcal += zutat.product_kcal / 100 * gericht.ingredients[i].product_amount;
  }

  //Alle Werte mit der Portionenmenge multiplizieren
  co2_emissions *= gericht.portions;
  proteins *= gericht.portions;
  carbohydrates *= gericht.portions;
  fats *= gericht.portions;
  kcal *= gericht.portions;

  //Texte mit den entsprechenden Werten aktualisieren
  $("#meal_co2").text(round(co2_emissions, 2) + " kg CO2-Äquivalenz")
  $("#meal_carbohydrates").text("Kohlenhydrate: " + round(carbohydrates, 2) + " g");
  $("#meal_proteins").text("Proteine: " + round(proteins, 2) + " g");
  $("#meal_fats").text("Fett: " + round(fats, 2) + " g");
  $("#meal_kcal").text("Kilokalorien: " + round(kcal, 2) + " kcal");

  //Wieviele Kilokalorien pro kg emissionen
  let kcalPerCo2 = kcal / co2_emissions;
  //Vergleichen dieser kcalPerCo2 mit denjenigen von einem optimalen Teller (2980)
  //und einem subobtimalen Teller (787) und diese umwandeln zu einer 1-5 Sterne Bewertung
  let stars = (((kcalPerCo2 - 787) * (5 - 1)) / (2980 - 790)) + 1;
  //Der Stern entsprechend der Bewertung anwählen
  if(stars < 1) {
    $("#rating-1").click();
  }else if(stars < 2) {
    $("#rating-2").click();
  }else if(stars < 3) {
    $("#rating-3").click();
  }else if(stars < 4) {
    $("#rating-4").click();
  }else {
    $("#rating-5").click();
  }
}

//Speichert das Gericht in das LocalStorage
function saveGericht() {
  localStorage.setItem("gericht", JSON.stringify(gericht));
}

//Speichert das Gericht (entsprechend dem Modus entweder einfügen oder editieren.)
function submitGericht() {
  let file = mode == "add" ? "addgericht.php" : "editgericht.php";
  let method = mode == "add" ? "POST" : "PUT";
  makeRequest(method, file, {"meal": JSON.stringify(gericht), "user_meal_id" : user_meal_id}, function(data) {
    location.href = "index.html";
  });
}
