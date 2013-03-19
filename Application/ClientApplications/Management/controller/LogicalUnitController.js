Ext.define('Management.controller.LogicalUnitController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'LogicalUnitGrid',
            selector: 'grid'
        }
    ],

    init: function() {
        this.control({
            'logicalunitgrid button[action=new]': {
                click: this.newLogicalUnit
            },
            'logicalunitgrid button[text=Delete]': {
                click: this.deleteLogicalUnit
            },
            'logicalunitgrid': {
                canceledit: this.cancelEdit,
                edit:this.commitRecord
            }
        });
    },
    
    deleteLogicalUnit: function () {
        var grid = this.getLogicalUnitGrid();
        var record = grid.selModel.getSelection()[0];
        
        Management.DeleteLogicalUnit(record.data, function (result) {
            grid.store.reload();
        });
    },

    newLogicalUnit: function () {
        
        var rowEditing = this.getLogicalUnitGrid().plugins[0];
        
        rowEditing.cancelEdit();
        
        var r = Ext.create('LogicalUnitDto', {
            Name: ''
        });

        this.getLogicalUnitGrid().store.insert(0, r);
        rowEditing.startEdit(0, 0);
    },
    
    cancelEdit: function (editor, e, opts) {    
        if (e.record.data.Name == '') {
            e.store.remove(e.record);
        }   
    },
    
    commitRecord: function (editor, e) {
        var logicalUnitGrid = this.getLogicalUnitGrid();
        Management.SaveLogicalUnit(e.record.data, function (result) {
            logicalUnitGrid.store.reload();
        });
    }
});
