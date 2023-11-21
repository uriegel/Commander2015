$(document).ready(function () {
    var url = document.URL;
    var urlparam = url.substr(url.indexOf('#') + 1);
    var code = urlparam.substr(urlparam.indexOf('=') + 1);
    
    var param = {
        code: code,
        redirect_uri: redirectUri,
        scope: scope,
        grant_type: 'authorization_code',
        client_id: clientID,
        client_secret: clientSecret
    };

    $.post(tokenLocalUrl, param, function(response) {
        if (response.access_token)
            localStorage.setItem("accessToken", response.access_token);
        if (response.refresh_token)
            localStorage.setItem("refreshToken", response.refresh_token);
        window.location.href = "index.html";
    });       
});

