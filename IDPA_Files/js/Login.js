$("#loginForm").submit(function(e) {
  e.preventDefault();
  makeRequest("POST", "https://klimateller.eliaschenker.com/api/login.php", $("#loginForm").serialize(), function() {
    location.href = "./index.html";
  }, function(data) {
    $("#formError").text(data["result"]);
  });
});
