// Im JSON des Dialogs OriginalSelection durchreichen
// Erst Dienst nach allgemeinen Daten fragen (Kopieren, Verschieben von wo nach wo, geht das...
// Dann Dialogbox: Möchtest Du die ausgewählten Dateien von A nach B kopieren/verschieben?
// Dann Konfliktitems holen, dabei drehendes Zahnrad bringen, Aktion nach Timeout abbrechen
// Eventuell fragen, ob als Administrator, wenn keine Zugriffe auf Verzeichnisse gewährleistet werden können
// Dann ggf. KonflikItems untersuchen
// Dann kopieren/verschieben

// Fehler (Kein Zugriff) melden
// ExtendedInfos: DierctoryName überprüfen
// Löschen der nicht mehr benötigten ItemResults im HTTPServer nach gewisser Zeit (1 min), alle 10 min checken
// Suchen nach Elementen, Eingabe eines Zeichens füllt nur die Elemente, die mit dem Zeichen anfangen
// Sortierung nach Spalten
// Variable Spalten, auch mit Alignment pro Spalte 
// Css-Img der Scrollbar verhält sich beim Clicken schlecht

$(document).ready(function() {
    var json = localStorage["CommanderSettings"];
    var settings;
    if (json)
        settings = JSON.parse(json);
    else
        settings = {
            leftDirectory: "drives",
            rightDirectory: "drives"
        };
    
    var commanderCollectionLeft = new ItemsCollection("#templates .item");
    tableViewLeft = new TableView("tableViewLeft", commanderCollectionLeft);
    tableViewLeft.setColumns(["Name", "Erw.", "Größe", "Datum", "Version"]);
    
    commanderCollectionRight = new ItemsCollection("#templates .item");
    tableViewRight = new TableView("tableViewRight", commanderCollectionRight);
    tableViewRight.setColumns(["Name", "Erw.", "Größe", "Datum", "Version"]);

    commanderCollectionLeft.getItems(settings.leftDirectory, true);
    commanderCollectionRight.getItems(settings.rightDirectory, false);

    var viewLeft = new CommanderView("commanderLeft", tableViewLeft);
    var viewRight = new CommanderView("commanderRight", tableViewRight);
    var grid = new Grid("grid");
    grid.setLeft(viewLeft);
    grid.setRight(viewRight);
    
    var footerHeight = $("footer").outerHeight();
    grid.resize($(window).width(), $(window).height() - footerHeight);  
    
    if (settings.leftWidths)
        tableViewLeft.setWidths(settings.leftWidths);
    if (settings.rightWidths)
        tableViewRight.setWidths(settings.rightWidths);
    
    $(window).resize(function() {
        grid.resize($(window).width(), $(window).height() - footerHeight);
    });
    
    tableViewLeft.onSelected(function(itemIndex) {
        commanderCollectionLeft.processItem(itemIndex);
    });

    tableViewRight.onSelected(function(itemIndex) {
        commanderCollectionRight.processItem(itemIndex);
    });
    
    $(document).keydown(function(e) {
        switch(e.which) {
            case 9: 
                var iat = getInactiveTable();
                if (iat)
                    iat.focus();
                break;
            case 116:
                process($(e.target), getCopyOperationData, operateCopy);
                break;
            case 117:
                process($(e.target), getMoveOperationData, operateMove);
                break;
            case 46:
                process($(e.target), getDeleteOperationData, operateDelete);
                break;
            case 120:
                var at = getActiveTable();
                if (!at)
                    return;
                var iat = getInactiveTable();
                if (!iat)
                    return;
                var dir = at.itemsCollection.getCurrentDirectory();
                iat.clearItems();
                iat.itemsCollection.getItems(dir, false);
                break;
            default:
                return;
        }        
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    
    $(window).focusin(function() {
        var $active = $(document.activeElement);
        if ($active.length > 0)  {
            var $view = $($active.closest(".tableView")[0]);
            var id = $view.attr('id'); 
            if (id == "tableViewRight")
                tableViewFocusFallback = tableViewRight;
            else if (id == "tableViewLeft")
                tableViewFocusFallback = tableViewLeft;
        }
        else {
            if (tableViewFocusFallback)
                tableViewFocusFallback.focus();
        }
    });
    
    $(window).bind('unload', function() {
        localStorage["CommanderSettings"] = JSON.stringify({ 
            leftDirectory: tableViewLeft.itemsCollection.getCurrentDirectory(),
            rightDirectory: tableViewRight.itemsCollection.getCurrentDirectory(),
            leftWidths: tableViewLeft.columnsControl.getWidths(),
            rightWidths: tableViewRight.columnsControl.getWidths()
        });
    });
});

function getInactiveTable() {
    if (tableViewLeft.hasFocus())
        return tableViewRight;
    else if (tableViewRight.hasFocus())
        return tableViewLeft;
}

function getActiveTable() {
    if (tableViewLeft.hasFocus())
        return tableViewLeft;
    else if (tableViewRight.hasFocus())
        return tableViewRight;
}

function process($item, getOperationData, operate) {
    var $tableView = $item.closest(".tableView");
    var id = $tableView.attr("id");
    var views = getTableViews(id);
    var currentItem = views.active.getCurrentItemIndex();
    var selection = views.active.itemsCollection.getSelectedItems(currentItem);
    if (selection.length == 0)
        return;

    var waitingItem = new WaitingItem(5000, function(result) {
        if (result == "timeout") {
            $.post("/Commander/Cancel", null);
            var dialog = new Dialog(views.active);
            dialog.text = "Dauert zu lange";
            dialog.show();
            return;
        }
    });
    waitingItem.show();

    var operationData = getOperationData(views, selection);

    $.post("/Commander/CheckFileOperation", 
        JSON.stringify(operationData),
        function(json) {
            waitingItem.stop();
            var dialog = new Dialog(views.active, json);
            if (json.result == "cancelled") {
            }
            if (json.result == "identicalDirectories") {
                dialog.text = "Die Verzeichnisse sind identisch";
                dialog.show();
            }
            else if (json.result == "noSelection") {
                dialog.text = "Für diese Operation sind keine gültigen Elemente ausgewählt";
                dialog.show();
            }
            else if (json.result == "subordinateDirectory") {
                dialog.text = "Der Zielordner ist dem Quellordner untergeordnet";
                dialog.show();
            }
            else
                operate(json, dialog, views);
        }
    );
}

function getCopyOperationData(views, selection) {
    return {
        operation: "copy",
        sourceDir: views.active.itemsCollection.getCurrentDirectory(),
        targetDir: views.inactive.itemsCollection.getCurrentDirectory(),
        items: selection
    }; 
};

function getMoveOperationData(views, selection) {
    return {
        operation: "move",
        sourceDir: views.active.itemsCollection.getCurrentDirectory(),
        targetDir: views.inactive.itemsCollection.getCurrentDirectory(),
        items: selection
    }; 
};

function operateCopy(json, dialog, views) {
    operateFile(json, dialog, views, "Willst Du die ausgewählten Dateien kopieren?", false);
};

function operateMove(json, dialog, views) {
    operateFile(json, dialog, views, "Willst Du die ausgewählten Dateien verschieben?", true);
};

function operateFile(json, dialog, views, question, refreshTarget) {
    if (json.result == "incompatible") {
        dialog.text = "Du kannst die ausgewählten Elemente nicht in diesen Zielordner kopieren";
        dialog.show();
    }
    else if (json.conflictItems.length > 0) {
        dialog.text = "Folgende Dateien überschreiben?";
        dialog.columns = ["Name", "Größe", "Datum", "Version"];
        dialog.itemsCollection = new ConflictCollection("#templates .conflictitem", json);
        dialog.show(function(ignoreConflict) {
            $.post("/Commander/Operate", 
                JSON.stringify({
                        id: json.id,
                        conflictItems: json.conflictItems,
                        ignoreConflicts: ignoreConflict
                    }), function() {
                        views.inactive.refresh(false);
                            if (refreshTarget)
                                views.active.refresh(false);
                    });
        });
    }
    else {
        dialog.text = question;
        dialog.show(function(action) {
            if (action) {
                $.post("/Commander/Operate", 
                    JSON.stringify({
                            id: json.id
                        }), function() {
                            views.inactive.refresh(false);
                            if (refreshTarget)
                                views.active.refresh(false);
                        });
            }
        });
    }
};

function getDeleteOperationData(views, selection) {
    return {
        operation: "delete",
        sourceDir: views.active.itemsCollection.getCurrentDirectory(),
        items: selection
    }; 
};

function operateDelete(json, dialog, views) {
    dialog.text = "Willst Du die ausgewählten Dateien löschen?";
    dialog.show(function(action) {
        if (action) {
            $.post("/Commander/Operate", 
                JSON.stringify({
                        id: json.id
                    }), function() {
                        views.active.refresh(false);
                    });
        }
    });
};

function processResult(json) {
    var wahr = json;
};

function getTableViews(id) {
    if (id == "tableViewLeft") 
        return { 
            active: tableViewLeft,
            inactive:  tableViewRight
        };
    else if (id == "tableViewRight") 
        return { 
            active: tableViewRight,
            inactive:  tableViewLeft
        };
}

var tableViewLeft;
var tableViewRight;
var tableViewFocusFallback;

