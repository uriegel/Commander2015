var clientID = '12129845536-hqpjv9fhdatvhdklo009ah6hglh9bek1.apps.googleusercontent.com';
var clientSecret = 'xHrsXlyoEhbJTlQqy1pPTULV';
var tokenLocalUrl = '/tasksApi/token';
var redirectUri = 'http://localhost/tasks/answer.html';
var redirectUriAndroid = 'http://localhost:9865/tasks/answer.html';
var scope = 'https://www.googleapis.com/auth/tasks';
var oAuth2Url = 'https://accounts.google.com/o/oauth2/';
var oAuthUrl = oAuth2Url + 'auth?';
var tokenUrl = oAuth2Url + 'token';
var listsUrl = 'https://www.googleapis.com/tasks/v1/users/@me/lists';
var taskListUrl = 'https://www.googleapis.com/tasks/v1/lists/';
var accountUrl = "account.html";
var androidAccountUrl = "account.html#webview";
//var taskCompletedUrl 
//%s/tasks?showCompleted=true';               