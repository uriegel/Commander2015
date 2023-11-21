$(document).ready(function() {
    var itemsCollection = new ItemsCollection("#templates .item");
    var tableView = new TableView("tabelle", itemsCollection);
    tableView.setColumns(["Erste Spalte", "Zweite Spalte", "Die 3."]);
    itemsCollection.fill(30);

    itemsCollection = new ItemsCollection("#templates .item");
    var tableViewRight = new TableView("tabelle2", itemsCollection);
    tableViewRight.setColumns(["1. Spalte", "2. Spalte", "3."]);
    itemsCollection.fill(35);
    
    var grid = new Grid("grid");
    grid.setLeft(tableView);
    grid.setRight(tableViewRight);
    
    
    grid.resize($(window).width(), $(window).height() - 15);    
    
    $(window).resize(function() {
        grid.resize($(window).width(), $(window).height() - 15);
    });
});

