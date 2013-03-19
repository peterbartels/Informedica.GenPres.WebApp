Ext.define('Management.view.LogicalUnitGrid', {
    extend: 'Management.view.EditableModelGrid',

    title: 'Logical units',

    alias: ['widget.logicalunitgrid'],

    store: Shared.util.StoreManager.GetStore('LogicalUnitDto', Management.GetLogicalUnits),
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            region: 'center',
            columns: [
                {
                    xtype: 'gridcolumn',
                    width: 400,
                    dataIndex: 'Name',
                    text: 'Name',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});