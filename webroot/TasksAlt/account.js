$(document).ready(function ()
{
    account();
});

function account() {
    var webView = window.location.href.lastIndexOf("#webview") != -1;
    var redirect = webView ? redirectUriAndroid : redirectUri;
    var url = oAuthUrl + 'access_type=offline' + 
            '&scope=' + scope + 
            '&client_id=' + clientID + 
            '&redirect_uri=' + redirect + 
            '&response_type=' + 'code';
    window.location.href = url;
}
