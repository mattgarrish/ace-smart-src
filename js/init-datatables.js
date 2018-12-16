
function DT() { }

DT.prototype.initialize = function(options) {
    this.searchable = options.searchable !== undefined ? Boolean(options.searchable) : true;
    this.setDefaultSort = options.setDefaultSort !== undefined ? Boolean(options.setDefaultSort) : true;
    this.changeDefaultSort = options.changeDefaultSort !== undefined ? Boolean(options.changeDefaultSort) : true;
    this.srchLabel = (options.srchLabel == undefined || options.srchLabel == null || options.srchLabel == '') ? 'Find evaluation ' : options.srchLabel;
    this.srchPlaceholder = (options.srchPlaceholder == undefined || options.srchLabel == null || options.srchPlaceholder == '') ? 'Enter a publication title' : options.srchPlaceholder;
    
    this.enhance();
}

DT.prototype.enhance = function() {
    var tables = document.getElementsByTagName('table');
    
    // add table ids to a non-dynamic list (datatables will grow the # of tables as they're made if you walk through and activate dynamically)
    var IDs = [];
    for (var i = 0; i < tables.length; i++) {
        var thisID = tables[i].id;
        if (typeof thisID !== undefined && thisID !== null && thisID != '') {
            IDs.push(thisID);
        }
    }
    
    // activate each of the tables
    for (var j = 0; j < IDs.length; j++) {
        this.makeDynamic(IDs[j]);
        if (this.changeDefaultSort) {
           this.changeSort(IDs[j]);
        }
    }
}

DT.prototype.makeDynamic = function(tblID) {

    var tblRef = '#'+tblID;
    
    var table = $(tblRef).DataTable({
            "paging": false,
            "info": false,
            "searching": this.searchable,
            "stateSave": true,
            "autoWidth": false,
            "aaSorting": this.setDefaultSort ? [0,'asc'] : [],
            "oLanguage": {
                "sSearch": this.srchLabel,
                "sSearchPlaceholder": this.srchPlaceholder,
				"sEmptyTable": "No evaluations initiated"
            }
        });
}

DT.prototype.changeSort = function(tblID) {
    var oTable = $('#'+tblID).dataTable();
    var oSettings = oTable.fnSettings();
    var iColumns = oSettings.aoColumns.length - 1;
    
    for (var i = 0; i <= iColumns; i++) {
        var colName = oSettings.aoColumns[i].sTitle.toLowerCase();
        if (colName != '#' && colName != 'name' && colName != 'at' && colName != 'description') {
            oSettings.aoColumns[i].asSorting = ['desc','asc'];
        }
    }
}
