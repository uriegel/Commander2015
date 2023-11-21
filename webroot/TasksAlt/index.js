$(document).ready(function ()
{
    if (window.location.href.lastIndexOf("#webview") != -1) {
        androidMode = true;
    }

    $("#new").click(function(){
        window.location.href = "new.html";
    });

    accessToken = localStorage.getItem("accessToken");
    if (accessToken == null) {
        if (androidMode) {
            window.MyHandler.startHttpServer();
        }

        account();
        return;
    }

    getTasks();
});

function getTasks() {
    getTaskListId(function (json) {
        taskListId = json.items[0].id;
        updateTasks();
    });
}
    
function account() {
    window.location.href = androidMode ? androidAccountUrl : accountUrl;
}

function updateTasks() {
    var p = {
        showCompleted: false
    };
    getJson(getTaskListUrl() + 'tasks', p, processTasks);
}

function onUpdatedAccessToken(accessToken) {
    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        this.accessToken = accessToken;
    }
    getTasks();
}

function processTasks(json) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var recentDate;
    var tasks = sortTasks(json.items);
    tasks.forEach(function(item) {
        if (item.due != undefined)
        {
            if (item.due != recentDate)
            {
                var d = new Date(item.due);
                recentDate = item.due;
                $("#list").append("<li class='date'>" + d.toLocaleDateString('de-DE', options) + "</li>");    
            }
        }
        
        var input = "<li>" + item.title;
        if (item.notes)
            input += "<div>" + item.notes + "</div>";
        input += "</li>";    
        insertItem(input, function() {
            alert($(this).html());
        });    
    });
    myScroll.refresh();
}

function sortTasks(tasks) {
    var undefinedTasks = [];
    var definedTasks = [];
    tasks.forEach(function(task) {
        if (task.due == undefined)
            undefinedTasks.push(task);
        else {
            definedTasks.push(task);
        }
    });
    definedTasks.sort(function(x, y) {
        if (x == y)
            return 0;
       return x.due < y.due ?  -1 : 1;
    });
    return definedTasks.concat(undefinedTasks);
}

function refreshToken() {
    if (androidMode) {
        refreshTokenWebView();
    } else {
        refreshTokenWeb();
    }
}

function refreshTokenWebView() {
    var refreshToken = localStorage.getItem("refreshToken");
    window.MyHandler.refreshToken(refreshToken);
    
    //localStorage.setItem("accessToken", response.access_token);
    //window.location.href = "index.html";
}

function refreshTokenWeb() {
    var refreshToken = localStorage.getItem("refreshToken");
    var param = {
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        client_id: clientID,
        client_secret: clientSecret
    };

    $.post(tokenLocalUrl, param, function(response) {
        localStorage.setItem("accessToken", response.access_token);
        window.location.href = "index.html";
    });       
}

function getTaskListId(func) {
    getJson(listsUrl, null, func);
}

function getTaskListUrl() {
    return taskListUrl + taskListId + '/'; 
}

function getJson(url, params, func) {
    request(url, 'GET', params, func);
}

function postJson(url, params, func) {
    request(url, 'POST', JSON.stringify(params), func);
}

function request(url, method, params, func) {
    $.ajax({url: url,
        type: method,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.setRequestHeader('CONTENT-TYPE', 'application/json; charset=UTF-8' + accessToken);
        },
        data: params,
        success: func,
        error: function(error) { 
            if (error.status == 401) {
                refreshToken();
            }
            else {
                alert("Einspruch:" + (error.responseText ? error.responseText : error.statusText));
            }
        },
    });
}

function getAccessUrl(url) {
    return url + '?access_token=' + accessToken;
}

function insertItem(input, tabAction) {
    var newItem = $(input).appendTo("#list"); 
    newItem.on("tap", tabAction);
    
    if (androidMode) {
        newItem.on("touchstart", function() {
            $(this).addClass("uactive");
        });
        newItem.on("touchmove", function() {
            $(this).removeClass("uactive");
        });
        newItem.on("touchend", function() {
            $(this).removeClass("uactive");
        });        
    }
    else {
        newItem.on("mousedown", function() {
            $(this).addClass("uactive");
        });
        newItem.on("mousemove", function() {
            $(this).removeClass("uactive");
        });
        newItem.on("mouseup", function() {
            $(this).removeClass("uactive");
        });        
    }
}

var accessToken;
var taskListId;
var myScroll;
var androidMode = false;