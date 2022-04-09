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
     if(data.status == 403) {
       location.href = "login.html";
     }else {
       if(onFail != undefined) {
        onFail(JSON.parse(data.responseText), data.status);
       }
     }
   });
}
