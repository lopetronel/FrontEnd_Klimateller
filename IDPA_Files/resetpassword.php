<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Setzen Sie Ihr Passwort zurück</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  </head>
  <body>
    <?php
      if(!isset($_GET["token"])) {
        echo "<h2>Token Paramter fehlt</h2>";
        exit();
      }
     ?>
    <form id="resetForm">
      <h2>Setzen Sie Ihr Passwort zurück</h2>
      <label>
        Passwort:
        <input type="password" name="password" id="password">
      </label><br><br>
      <label>
        Passwort wiederholen:
        <input type="password" name="repeat_password" id="repeat_password">
      </label>
      <input type="hidden" name="token" value="<?php echo $_GET["token"]; ?>">
      <p style="color:red;" id="formError"></p>
      <input type="submit" value="Zurücksetzen">
    </form>
    <script src="js/RequestUtil.js"></script>
    <script>
      $("#resetForm").submit(function(e) {
        e.preventDefault();
        let data = $("#resetForm").serialize();

        $("#formError").css("color", "red");
        if($("#password").val() == $("#repeat_password").val()) {
          makeRequest("POST", "https://klimateller.eliaschenker.com/api/resetpassword.php", data , function() {
            $("#formError").css("color", "black");
            $("#formError").text("Passwort wurde erfolgreich geändert.")
          }, function(data) {
            $("#formError").text(data["result"]);
          });
        }else {
          $("#formError").text("Passwörter stimmen nicht überein.");
        }
      });
    </script>
  </body>
</html>
