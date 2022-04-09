$(document).ready(function() {
   makeRequest("GET", "https://klimateller.eliaschenker.com/api/gettimeline.php?page=1&page_size=10", "", function(data) {
       let entries = data["result"];
       for(let i = 0;i<entries.length;i++) {
         $("#timelineEntries").append("<div class=\"wrap2\"><h1>" + entries[i]["user_meal_date"] + "</h1><br></div><div class=\"wrap2\"><h1>" + entries[i]["user_meal_name"] + "</h1><br></div>");
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
