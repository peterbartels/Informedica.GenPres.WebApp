
var rowRenderer = function (val) {
    
};

Ext.define('Management.view.PatientGrid', {
    extend: 'Management.view.EditableModelGrid',

    title: 'Patients',

    alias: ['widget.patientgrid'],

    store: Shared.util.StoreManager.GetStore('PatientDto', Management.GetPatients, null, {autoLoad:true}),
    
    initComponent: function() {
        var me = this;

        var store = Shared.util.StoreManager.GetStore('LogicalUnitDto', Management.GetLogicalUnits);
        store.reload();

        Ext.applyIf(me, {
            region: 'center',
            columns: [
                {
                    xtype: 'gridcolumn',
                    width: 400,
                    dataIndex: 'FirstName',
                    text: 'First Name',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    xtype: 'gridcolumn',
                    width: 400,
                    dataIndex: 'LastName',
                    text: 'Last Name',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    xtype: 'gridcolumn',
                    width: 400,
                    dataIndex: 'LogicalUnitId',
                    
                    text: 'Logical Unit',
                    
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        
                        var editor = metaData.column.getEditor(),
                            selectedRecord = editor.findRecord(editor.valueField, value);

                        return selectedRecord ? selectedRecord.get(editor.displayField) : value;
                    },

                    editor: {
                        typeAhead: true,
                        xtype: 'combobox',
                        forceSelection: true,
						typeAhead:true,
						queryMode : 'local',
                        displayField: 'Name',
                        valueField: 'Id',
                        allowBlank: false,
                        store: store
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});