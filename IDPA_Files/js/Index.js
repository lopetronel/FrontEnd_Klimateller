$(document).ready(function() {
   makeRequest("GET", "https://klimateller.eliaschenker.com/api/gettimeline.php?page=1&page_size=10", "", function(data) {
       let entries = data["result"];
       for(let i = 0;i<entries.length;i++) {
         const indexCopy = i;

         $("#timelineentries").append("<div class=\"wrap2\"><h1>" +
         entries[i]["user_meal_date"] + "</h1><br></div>" +
         "<div class=\"wrap2\">" +
         "<h1>" + entries[i]["user_meal_name"] + "</h1><a class=\"button-63\">Editieren</a><a class=\"button-62\"><ion-icon size=\"large\" name=\"trash-outline\"></ion-icon></a>" +
         "</div><hr class=\"accessory\">");
         $(".button-63").eq(indexCopy).click(function() {
           editGericht(entries[i]["user_meal_id"]);
         });
         $(".button-62").eq(indexCopy).click(function() {
           deleteGericht(entries[i]["user_meal_id"]);
         });
       }
   });

   makeRequest("GET", "https://klimateller.eliaschenker.com/api/getco2overview.php", "", function(data) {
     let progress = $(".progress-done");
     let co2_goal = data["result"]["co2_goal"];
     let co2_emissions = data["result"]["co2_emissions"];
     let co2_percentage = 100 / co2_goal * co2_emissions;

     progress.html(co2_percentage + '%');
     progress.attr("data-done", co2_percentage);
     progress.css("width", co2_percentage + '%');
     progress.css("opacity", 1);

     $("#co2_goal").text("von " + co2_goal + " Gramm");
   });
});

function editGericht(id) {
  console.log("Editing");
}

function deleteGericht(id) {
  console.log("Deleting");
}
