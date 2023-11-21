

function ItemsCollection(nodeFactoryId) {
    this.items;
    this.tableView;
    this.itemNodeFactory = $(nodeFactoryId)[0];
}

ItemsCollection.prototype.initialize = function(tableView) {
    this.tableView = tableView;
};

ItemsCollection.prototype.getItemsCount = function() {
    return this.items.length;
};

ItemsCollection.prototype.fill = function(number) {
    this.items = new Array;
    for (var i = 0; i < number; i++) {
        this.items.push({ col1: "Eintrag " + i, col2: " ein Eintrag", col3: "Das allerletzte"});
    }
    this.tableView.onItemsChanged();
};

ItemsCollection.prototype.insertItem = function(itemIndex) {
    var $node = $(this.itemNodeFactory.cloneNode(true));
    $node.find("#size").html(this.items[itemIndex].col1);
    $node.find("#time").html(this.items[itemIndex].col2);
    $node.find("#version").html(this.items[itemIndex].col3);
    return $node;
};