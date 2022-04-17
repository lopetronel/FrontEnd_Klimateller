$(document).ready(function() {
   makeRequest("GET", "https://klimateller.eliaschenker.com/api/gettimeline.php?page=1&page_size=10", "", function(data) {
       let entries = data["result"];
       for(let i = 0;i<entries.length;i++) {
         const indexCopy = i;
         let date = new Date(entries[i]["user_meal_date"]);
         let dateString = date.toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
         $("#timelineentries").append("<div class=\"wrap2\"><h1>" +
         dateString + "</h1><br></div>" +
         "<div class=\"wrap2\">" +
         "<h1>" + entries[i]["user_meal_name"] + "</h1>" +
         "<div class=\"rightbut\"><a class=\"button-63\">Editieren</a></div>" +
         "<div class=\"rightbut\"><a class=\"button-62\"><ion-icon size=\"large\" name=\"trash-outline\"></ion-icon></a></div>" +
         "</div><hr class=\"accessory\">");
         $(".button-63").eq(indexCopy).click(function() {
           editGericht(entries[i]["user_meal_id"]);
         });
         $(".button-62").eq(indexCopy).click(function() {
           deleteGericht(entries[i]["user_meal_id"]);
         });
       }
   });

   makeRequest("GET", "https://klimateller.eliaschenker.com/api/getco2overview.php?days=10", "", function(data) {
     let progress = $(".progress-done");
     let co2_goal = parseInt(data["result"]["co2_goal"]) / 1000;
     let co2_emissions = data["result"]["total_co2_emissions"];
     let co2_percentage = 100 / co2_goal * co2_emissions;
     let display_percentage = co2_percentage > 100 ? 100 : co2_percentage;
     progress.html(co2_percentage + '%');
     progress.attr("data-done", display_percentage);
     progress.css("width", display_percentage + '%');
     progress.css("opacity", 1);

     $("#co2_goal").text(co2_emissions + "kg CO2-Äq. von " + co2_goal + "kg CO2-Äq.");
   });
});

function addGericht() {
    localStorage.removeItem("gericht");
    localStorage.setItem("mode", "add");
    location.href = 'add.html';
}

function editGericht(id) {
  makeRequest("GET", "https://klimateller.eliaschenker.com/api/getgericht.php?user_meal_id=" + id, "", function(data) {
    localStorage.setItem("gericht", JSON.stringify(data["message"]));
    localStorage.setItem("mode", "edit");
    localStorage.setItem("user_meal_id", id);
    location.href = 'add.html';
  });
}

function deleteGericht(id) {
  makeRequest("DELETE", "https://klimateller.eliaschenker.com/api/deletegericht.php?user_meal_id=" + id, "", function(data) {
    location.reload();
  }, function() {
    location.reload();
  });
}
