function PerformAdd()
{
    var affe = $("#DataEntry").serialize();
    $("#result").load("DoMath.php", affe);
}

