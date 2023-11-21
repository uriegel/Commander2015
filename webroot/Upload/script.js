
// <editor-fold defaultstate="collapsed" desc=" Event Handlers ">
$(document).ready(function ()
{
    $('input[type=file]').before('<button id="button-file">Datei Upload</button>');
    $('input[type=file]').hide();
    $('body').on('click', '#button-file', function () 
    { 
        $('input[type=file]').trigger('click');    
    });
});

// </editor-fold>
 
// <editor-fold defaultstate="collapsed" desc=" Methods ">

function login()
{
    var parameter = {user: "Kärl Ötto"};
    $.getJSON("http://localhost/Upload/login", parameter, function (json)
    {
        sessionID = json.sessionID;
        $("#eingeloggt").append(json.name);
        $("#session").append(json.sessionID);
        $("#loggedOff").hide("slow");
        $("#table").show("slow");
    });
    
//    var request = new XMLHttpRequest();
//    request.open("GET", "http://localhost/Upload/login?user=kärl ötto");
//    request.onreadystatechange = function()
//    {
//        if (request.readyState == 4 && request.status == 200)
//        {
//            updateSales(request.responseText);
//        }
//    };
//    request.send();
}

function LoadeUp(file)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost/Upload/UploadMyImage?sessionID=" + sessionID, true);
    xhr.setRequestHeader('X-File-Name', file.name);
    xhr.setRequestHeader('X-File-Size', file.size);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.onreadystatechange = function ()
    {
        if (xhr.status != 200)
        {
            alert(xhr.statusText);
        }
    };
    xhr.send(file);    
}

function startRead(evt)
{
    var file = document.getElementById("fileChooser").files[0];
    if (file)
    {
        //  getAsText(file);
        // alert("Name: " + file.name + "\n" + "Last Modified Date :" + file.lastModifiedDate);
        LoadeUp(file);
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" Fields ">

var sessionID;

// </editor-fold>