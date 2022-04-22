$("#passwordResetForm").submit(function(e) {
  e.preventDefault();
  let data = $("#passwordResetForm").serialize();

  makeRequest("POST", "https://klimateller.eliaschenker.com/api/sendforgotpasswordrequest.php", data , function() {
    alert("Email wurde erfolgreich versendet. Überprüfen Sie Ihren Spam-Ordner.");
    location.href = "./login.html";
  }, function(data) {
    $("#formError").text(data["result"]);
  });
});
