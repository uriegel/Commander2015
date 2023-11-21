
$(document).ready(function() {
    var commanderCollection = new CommanderCollection("#templates .item");
    var tableView = new TableView("tabelle", commanderCollection);
    tableView.setColumns(["Name", "Erw.", "Größe", "Datum", "Version"]);
    commanderCollection.getItems("drives");
    
    var footerHeight = $("footer").outerHeight();
    $(window).resize(function() {
        tableView.resize($(window).width(), $(window).height() - footerHeight);
    });
    
     tableView.onSelected(function(itemIndex) {
        commanderCollection.processItem(itemIndex);
    });
    
    tableView.resize($(window).width(), $(window).height() - footerHeight);
});

