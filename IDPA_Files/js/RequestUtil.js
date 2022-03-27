function makeRequest(method, url, data, onSuccess, onFail) {
   $.ajax({
     method:method,
     url: url,
     data: data
   }).done(function(data) {
     if(onSuccess != undefined) {
      onSuccess(data);
     }
   }).fail(function(data) {
     console.log(data)
     if(data.status == 403) {
       console.log("test");
       location.href = "login.html";
     }else {
       if(onFail != undefined) {
        onFail(JSON.parse(data.responseText), data.status);
       }
     }
   });
}
