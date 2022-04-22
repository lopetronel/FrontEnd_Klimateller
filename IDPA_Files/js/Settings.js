function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

$("#logoutbutton").click(function() {
  makeRequest("GET", "https://klimateller.eliaschenker.com/api/logout.php", {}, function() {
    localStorage.clear();
    deleteAllCookies();
    location.href = "login.html";
  });
});

$(document).ready(function() {
  makeRequest("GET", "https://klimateller.eliaschenker.com/api/getsettings.php", {}, function(data) {
    $("#co2_goal").val(data["result"][0]["co2_goal"]);
    $("#co2_goal_days").val(data["result"][0]["co2_goal_days"]);
    $("#username").text(data["result"][0]["user_name"]);
  });
});

function saveSettings() {
  makeRequest("POST", "https://klimateller.eliaschenker.com/api/editsettings.php",
  {"co2_goal": $("#co2_goal").val(),
   "co2_goal_days": $("#co2_goal_days").val()});
}
