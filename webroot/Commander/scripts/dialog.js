
function Dialog(elementToActivate, data) {
    this.text = null;
    this.data = data;
    this.elementToActivate = elementToActivate;
    this.tableView = null;
    this.itemsCollection = null;
    this.columns = null;
    this.cancelSelect = false;
};

Dialog.prototype.show = function(callback) {
    $("#shader").show();
    $("#shader").animate({opacity: 0.5}, 300);
    $("body").append("<div class='dialog'></div>");
    var $dialog = $("body .dialog");
    if (this.text)
        $dialog.append('<div id="text">' + this.text +'</div><p></p>');
    if (this.itemsCollection) {
        $dialog.append('<div id="tableView"></div>');
        $dialog.append('<div id="tableViewFlow"></div>');
        this.tableView = new TableView("tableView", this.itemsCollection);
        this.tableView.setColumns(this.columns);
        this.tableView.columnsControl.setColumnClass(1, "size");
        $dialog.append("<p></p><div id=buttonBar><input id='ok' type='button' value='Ja'><input id='cancel' type='button' value='Nein'></div>");
        $(".dialog #ok").css("margin-right", "20px");
        $(".dialog #cancel").css("width", "60px");
        $(".dialog #ok").keydown(function(e) {
            if (e.which == 9 || e.which == 39) {
                $(".dialog #cancel").focus();
                e.preventDefault();
            }
        });
        $(".dialog #cancel").keydown(function(e) {
            if (e.which == 9 || e.which == 37) {
                $(".dialog #ok").focus();
                e.preventDefault();
            }
        });
    }
    else
        $dialog.append("<p></p><div id=buttonBar><input id='ok' type='button' value='OK'></div>");
        $(".dialog").keydown(function(e) {
            if (e.which == 27) {
                self.close();
            }
        });
    $(".dialog #ok").css("width", "60px");
    $(".dialog #buttonBar").css("position", "relative");
    $(".dialog #buttonBar").css("padding-bottom", "10px");
    $(".dialog #buttonBar").css("text-align", "right");
    
    var self = this;
    $(".dialog #ok").click(function() {
        self.close();
        if (callback)
            callback(true);
    });
    $(".dialog #cancel").click(function() {
        self.close();
        if (callback)
            callback(false);
    });

    $(window).resize({self: this}, dialogResize);

    this.$focusButton = $(".dialog #ok");
    dialogResize({data: {self: self}});
    if (this.tableView) {
        this.tableView.itemsCollection.getItems();   
        if (this.tableView.itemsCollection.older)
            this.$focusButton = $(".dialog #cancel");
    }

    dialogResize({data: {self: self}});
    
    this.$focusButton.focus();
};

Dialog.prototype.close = function() {
    $("#shader").animate({opacity: 0}, 800, function() {
        $("#shader").hide();
    });

    var self = this;
    $(".dialog").animate({top: "100%"}, 150, function() {
        $(".dialog").remove();
        $(window).off("resize", dialogResize);
        self.elementToActivate.focus();
    });
};

function dialogResize(evt) {
    var self = evt.data.self;
    var $dialog = $(".dialog");
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var w = $dialog.outerWidth();
    var h = $dialog.outerHeight();
    var top = (windowHeight - h) / 2;
    var left = (windowWidth - w) / 2;
    if (self.tableView) {
        var $buttonBar = $(".dialog #buttonBar");
        var $tableViewFlow = $(".dialog #tableViewFlow");
        var buttonBarHeight = $buttonBar.height();
        var tableOffset = self.tableView.getOffset().top;
        var dialogOffset = $dialog.offset().top;
        if (!self.tableHeight)
            self.tableHeight = self.tableView.getMaxTableHeight();
        var height = self.tableHeight + tableOffset - dialogOffset + buttonBarHeight;
        if (!height)
            height = 200000;
        var newWidth = Math.min(windowWidth - 120, 600);
        var newHeight = Math.min(windowHeight - 120, height) + 3;
        self.tableView.resize(newWidth, newHeight - tableOffset + dialogOffset - buttonBarHeight);
        $tableViewFlow.width(newWidth);
        $tableViewFlow.height(newHeight - tableOffset + dialogOffset - buttonBarHeight);
        $dialog.width(newWidth);
        $dialog.height(newHeight);
        top = (windowHeight - newHeight - 40) / 2;
        left = (windowWidth - newWidth - 40) / 2;
    }
    $dialog.offset({left: left, top: top});
    if (self.$focusButton) {
        self.$focusButton.focus();    
        setTimeout(function() {
            self.$focusButton.focus();    
        }, 50);
    }
};
