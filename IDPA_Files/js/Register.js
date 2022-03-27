$("#registerForm").submit(function(e) {
  e.preventDefault();
  let data = $("#registerForm").serialize();
  console.log($("#password").val())
  console.log($("#repeat_password").val())
  if($("#password").val() == $("#repeat_password").val()) {
    makeRequest("POST", "https://klimateller.eliaschenker.com/api/register.php", data , function() {
      location.href = "./login.html";
    }, function(data) {
      $("#formError").text(data["result"]);
    });
  }else {
    $("#formError").text("Passwörter stimmen nicht überein.");
  }

});
