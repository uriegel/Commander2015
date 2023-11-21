$(document).ready(function(){
    $("#newTask").click(function() {
       alert("Mist");
    });
    
    $("#back").click(function() {
       alert("Bäckmist");
    });

    myScroll = new IScroll('#wrapper', { 
        scrollbars: true,
        mouseWheel: true,
        tap: true,
        interactiveScrollbars: true,
        fadeScrollbars: true,
        shrinkScrollbars: 'scale',
        click: true
    });
    document.addEventListener('touchmove', function (e) { 
        e.preventDefault(); 
    }, false);    

    var li = $("#templates .item")[0];
    var di = $("#templates .date")[0];
    for  (var i = 0; i < 500; i++){
        if (i % 7 == 0) {
            var node = di.cloneNode(true);
            $(node).html("Überschrift " + (i + 1));
            $(node).appendTo("#list");
        }
        
        var node = li.cloneNode(true);
        node.id = "";
        $(node).find("#content").first().html("Titel " + (i + 1));
        var wasa = $(node).appendTo("#list");
    }
    
    myScroll.refresh();
});

var myScroll;