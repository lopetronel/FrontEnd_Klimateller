$(document).ready(function() {
  loadZutaten();
  loadGericht();
});

let gericht;
let addedIngredient;

function loadGericht() {
  let data = localStorage.getItem("gericht");
  if(data != undefined) {
    gericht = JSON.parse(gericht);
  }else {
    gericht = {name:"Test Gericht", portions:2, ingredients:[{product_amount:200, product_name:"Lauch", selected_type: 1, types:[{"product_emissions_name": "Frisch", "product_emissions_id" : 1}, {"product_emissions_name" : "Nicht Frisch", "product:emissions_id":2}]}]}
  }

  $("#gname").val(gericht.name);
  let counter = 1;
  $(".toggle-buttons").children('input').each(function() {
    if(counter == gericht.portions) {
       $(this).prop("checked", true);
    }else {
       $(this).prop("checked", false);
    }

    counter += 1;
  });

  //Add the ingredient inputs

  $("#ingredientsDiv").html("");

  for(let i = 0;i<gericht.ingredients.length;i++) {
    let title = "<h3>" + gericht.ingredients[i].product_name + "</h3>";

    let selection = "<select name='frisch' id='frisch-select'>";
    for(let j = 0;j<gericht.ingredients[i].types.length;j++) {
      selection += "<option>" + gericht.ingredients[i].types[j].product_emissions_name + "</option>";
    }
    selection += "</select>&nbsp;&nbsp;";

    let grammInput = "<input type='number' id='grammid' value=" + gericht.ingredients[i].product_amount + "><h2>&nbsp;g</h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    let deleteButton = "<div class='deletebutton'><h1 id='deleteButton' class='button primary small'>X&nbsp;&nbsp;&nbsp;</h1></div></div>";

    let divider = "<hr class='accessory'>";

    $("#ingredientsDiv").append("<div class='wrap'>" +  title + selection + grammInput + deleteButton + "</div>" +  divider);

    const indexCopy = i;

    addedIngredient = $("#ingredientsDiv").children().eq(-2);
    let select = addedIngredient.find("#frisch-select");
    console.log(select);
    select.prop('selectedIndex', gericht.ingredients[i].selected_type);
    select.change(function() {
       gericht.ingredients[indexCopy].selected_type = this.selectedIndex;
       updatePreview();
    });

    addedIngredient.find("#grammInput").change(function() {
       gericht.ingredients[indexCopy].product_amount = this.val();
       updatePreview();
    });

    addedIngredient.find("#deletebutton").click(function() {
       gericht.ingredients.splice(indexCopy);
       saveGericht();
       loadGericht();
    });


  }
}

function loadZutaten() {
  makeRequest("GET", "https://klimateller.eliaschenker.com/api/getzutaten.php", "", function(data) {
    localStorage.setItem("zutaten", JSON.stringify(data["result"]));
  });
}

function updatePreview() {

}

function saveGericht() {
  localStorage.setItem("gericht", JSON.stringify(gericht));
}
