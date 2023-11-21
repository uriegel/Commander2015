
function CommanderView(id, tableView) {
    this.tableView = tableView;
    this.tableView.columnsControl.setColumnClass(2, "size");
    this.directoryHeight = 20;
    this.$restrict = null;
    $("#" + id + " .restrict").hide();
    
    var self = this;
    this.tableView.onItemsChangedCallback = function(directory) {
        self.onItemsChangedCallback(directory);
    };
    this.id = id;
    this.$commanderView = $("#" + id);
    this.$directory = $("#" + id + " .directory");
    this.$directory.change(function() {
        self.tableView.clearItems();
        self.tableView.itemsCollection.getItems($(this).val(), true);
    });
    this.tableView.onKeydown = function(e) {
        switch (e.which) {
            case 27:
                self.closeRestrict();
                break;
            default:
                if (e.char) {
                    var restrict = e.char.toLowerCase();
                    if (self.$restrict != null)
                        restrict = self.$restrict.val() + restrict;
                    if (self.tableView.itemsCollection.restrict(restrict))
                        self.checkRestrict(restrict);
                }
        }
    };
}

CommanderView.prototype.checkRestrict = function(restrict) {
    if (this.$restrict == null) {
        this.$restrict = $("#" + this.id + " .restrict");
        this.$restrict.css("top", this.height - 25 - 18);
        this.$restrict.show("slide");
    }
    this.$restrict.val(restrict);
};

CommanderView.prototype.closeRestrict = function() {
    if (this.$restrict != null) {
        this.$restrict.hide("slide");
        this.$restrict = null;
        this.tableView.itemsCollection.closeRestrict();
    }
};

CommanderView.prototype.offset = function(offset) {
    this.$commanderView.offset(offset);
    var viewOffset = { left: offset.left, top: offset.top + this.directoryHeight};
    this.tableView.offset(viewOffset);
    
};

CommanderView.prototype.resize = function(width, height) {
    this.height = height;
    this.$directory.width(width - 3);
    this.tableView.resize(width, height - this.directoryHeight);
    if (this.restrict)
        this.restrict.offset({top: height - 25});
};

CommanderView.prototype.onItemsChangedCallback = function(directory) {
    this.$directory.val(directory);
    this.closeRestrict();
};

