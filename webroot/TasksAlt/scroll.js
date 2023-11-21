$(document).ready(function ()
{
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
});


