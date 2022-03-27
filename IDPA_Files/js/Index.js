$(document).ready(function() {
  /*makeRequest("GET", "https://klimateller.eliaschenker.com/api/getco2overview.php","", function(data) {
    const progress = document.querySelector('.progress-done');

    progress.style.width = (100 / co2_emissions_total * co2_goal) + '%';
    progress.style.opacity = 1;
  });*/
  makeRequest("GET", "https://klimateller.eliaschenker.com/api/gettimeline.php?page=1&page_size=10", "", function(data) {
      let entries = data["result"];
      for(let i = 0;i<entries.length;i++) {
        $("#timelineEntries").append("<div class=\"wrap2\"><h1>" + entries[i]["user_meal_date"] + "</h1><br></div><div class=\"wrap2\"><h1>" + entries[i]["co2_emissions"] + "kg Co2</h1><br></div>");
      }
  });
});
