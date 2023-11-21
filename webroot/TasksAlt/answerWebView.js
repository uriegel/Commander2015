$(document).ready(function ()
{
    var url = document.URL;
    var urlparam = url.substr(url.indexOf('#') + 1);
    var answers = urlparam.split('&');
    var accessToken = answers[0];
    var refreshToken=answers[1];

    if (accessToken)
        localStorage.setItem("accessToken", accessToken);
    if (refreshToken)
        localStorage.setItem("refreshToken", refreshToken);
    window.location.href = "index.html";
});

