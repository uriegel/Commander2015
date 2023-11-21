
function CommanderCollection(nodeFactoryId) {
    this.items;
    this.tableView;
    this.recentDirectories = new Array;
    this.extendedItemInfos = new Object;
    this.itemNodeFactory = $(nodeFactoryId)[0];
}

CommanderCollection.prototype.initialize = function(tableView) {
    this.tableView = tableView;
};

CommanderCollection.prototype.processItem = function(itemIndex) {
    var dir;
    var lastCurrentDir;
    switch (this.items.items[itemIndex].__type) {
        case "DriveItem:#":
            dir = this.items.items[itemIndex].name;
            this.recentDirectories.push(dir);
            break; 
        case "ParentItem:#":
            dir = this.items.items[itemIndex].parent;
            lastCurrentDir = this.recentDirectories.pop();
            break;
        case "DirectoryItem:#":
            dir = this.items.currentDirectory +'\\' + this.items.items[itemIndex].name;
            this.recentDirectories.push(this.items.items[itemIndex].name);
            break;
        default:
            return;
    }
    
    this.tableView.clearItems();
    this.getItems(dir, lastCurrentDir);
};


CommanderCollection.prototype.getItems = function(directory, lastCurrentDir) {
    var self = this;
    $.getJSON("/Commander/GetItems", {
            dir: directory
        },
        function(json) {
            $.getJSON("/Commander/GetItems", {
                    dir: directory,
                    complete: true
                },
                function(json) {
                    self.extendedItemInfos = new Object;
                    var refresh = false;
                    json.items.forEach(function(item) {
                        self.extendedItemInfos[item.name] = item; 
                        refresh = true;
                    });    
                    if (refresh)
                        self.tableView.refreshItems();
            });
            
            self.items = json;
            var lastCurrentIndex;
            for (var i = 0; i < self.items.items.length; i++) {
                var currentItem = self.items.items[i];
                if (currentItem.__type != "DriveItem:#" && currentItem.__type != "DirectoryItem:#")
                    continue;
                if (currentItem.name == lastCurrentDir) {
                    lastCurrentIndex = i;
                    break;
                }
            }
            self.tableView.onItemsChanged(lastCurrentIndex);
        }
    );
};

CommanderCollection.prototype.getItemsCount = function() {
    return this.items.items.length;
};

CommanderCollection.prototype.insertItem = function(itemIndex) {
    var item = this.items.items[itemIndex];
    switch (item.__type) {
        case "DriveItem:#":
            return this.insertDriveItem(item);
        case "ParentItem:#":
            return this.insertParentItem(item);
        case "DirectoryItem:#":
            return this.insertDirectoryItem(item);
        case "FileItem:#":
            return this.insertFileItem(item);
    }
};

CommanderCollection.prototype.insertDriveItem = function(drive) {
    var $node = $(this.itemNodeFactory.cloneNode(true));
    $node.find(".image").attr("src", drive.imageUrl);
    $node.find("#name").html(drive.name);
    return $node;
};

CommanderCollection.prototype.insertParentItem = function(directory) {
    var $node = $(this.itemNodeFactory.cloneNode(true));
    $node.find(".image").attr("src", directory.imageUrl);
    $node.find("#name").html(directory.name);
    return $node;
};

CommanderCollection.prototype.insertDirectoryItem = function(directory) {
    var $node = $(this.itemNodeFactory.cloneNode(true));
    $node.find(".image").attr("src", directory.imageUrl);
    $node.find("#name").html(directory.name);
    $node.find("#time").html(directory.dateTimeString);
    return $node;
};

CommanderCollection.prototype.insertFileItem = function(file) {
    var $node = $(this.itemNodeFactory.cloneNode(true));
    $node.find(".image").attr("src", file.imageUrl);
    $node.find("#name").html(file.name);
    $node.find("#extension").html(file.extension);
    $node.find("#size").html(this.numberFormat(file.fileSize));
    $node.find("#time").html(file.dateTimeString);
    this.insertExtendedInfos($node, file.name + file.extension);
    return $node;
};

CommanderCollection.prototype.refreshItem = function($item) {
    var name = $item.find("#name").text();
    name += $item.find("#extension").text();
    if (name) {
        this.insertExtendedInfos($item, name);
    }
};

CommanderCollection.prototype.insertExtendedInfos = function($item, name) {
    var extendedInfos = this.extendedItemInfos[name];
    if (extendedInfos) {
        if (extendedInfos.dateTimeString) {
            var $time = $item.find("#time");
            $time.html(extendedInfos.dateTimeString);
            $time.addClass("exif");
        }
        $item.find("#version").html(extendedInfos.version);
    }
};


CommanderCollection.prototype.numberFormat = function(number) {
    var strNumber = number+"";
    var thSep = '.';
    if(strNumber.length > 3) {
        var begriff = strNumber;
        strNumber = "";
        for(j = 3; j < begriff.length ; j+=3) {
            var extract = begriff.slice(begriff.length - j, begriff.length - j + 3);
            strNumber = thSep + extract +  strNumber + "";
        }
        var strfirst = begriff.substr(0, (begriff.length % 3 == 0) ? 3 : (begriff.length % 3));
        strNumber = strfirst + strNumber;
    }
    return strNumber;
};
