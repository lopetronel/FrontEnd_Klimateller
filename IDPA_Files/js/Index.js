$(document).ready(function() {
   checkScrollAndDownload(true);

   makeRequest("GET", "https://klimateller.eliaschenker.com/api/getco2overview.php", "", function(data) {
     let progress = $(".progress-done");
     let co2_goal = parseInt(data["result"]["co2_goal"]) / 1000;
     let co2_emissions = data["result"]["total_co2_emissions"];
     let co2_percentage = 100 / co2_goal * co2_emissions;
     let display_percentage = co2_percentage > 100 ? 100 : co2_percentage;
     progress.html(round(co2_percentage, 2) + '%');
     progress.attr("data-done", display_percentage);
     progress.css("width", display_percentage + '%');
     progress.css("opacity", 1);

     let co2_goal_days = data["result"]["co2_goal_days"];

     $("#co2_goal").text(round(co2_emissions, 2) + " von " + round(co2_goal, 2) + " kg CO2-Äquivalenz");
     if(co2_goal_days == 1) {
       $("#co2_goaltext").text("Ihr CO2 Ziel von heute:");
     }else {
       $("#co2_goaltext").text("Ihr CO2 Ziel über die letzten " + co2_goal_days + " Tage:");
     }
   });
});

$(window).scroll(function(){
    checkScrollAndDownload();
 });

let blockEntriesLoading = false;
let page = 1;

function checkScrollAndDownload(override=false) {
  var s = $(window).scrollTop(),
     d = $(document).height(),
     c = $(window).height();

   var scrollPercent = (s / (d - c)) * 100;

   if((scrollPercent > 99 || override) && !blockEntriesLoading) {
     blockEntriesLoading = true;
     makeRequest("GET", "https://klimateller.eliaschenker.com/api/gettimeline.php?page=" + page + "&page_size=10", "", function(data) {
         let entries = data["result"];
         for(let i = 0;i<entries.length;i++) {
           const indexCopy = (page - 1) * 10 + i;
           //Custom format american date to german date
           let date = entries[i]["user_meal_date"].split(" ")[0].split("-");
           let day = date[2];
           let month = date[1];
           let year = date[0];
           let dateString = day + "." + month + "." + year;

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
         if(entries.length != 0) {
           blockEntriesLoading = false;
           page++;
         }else {
            $("#timelineentries").append("<h3 style=\"color:black;margin-bottom:25%;text-align:center;\">" + (page == 1 ? "" : "Es wurden keine zusätzlichen Gerichte gefunden.") + "</h3>")
         }
     });
   }
}

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
  makeRequest("DELETE", "https://klimateller.eliaschenker.com/api/deletegericht.php?meal_id=" + id, "", function(data) {
    location.reload();
  }, function() {
    location.reload();
  });
}
