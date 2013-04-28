Ext.define('Management.view.EditableModelGrid', {

    extend: 'Ext.grid.Panel',

    alias: ['widget.editablemodelgrid'],

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            
            selType: 'rowmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToEdit: 2,
                    errorSummary: false
                })
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            action:'new',
                            text: 'New'
                        },
                        {
                            xtype: 'button',
                            action: 'remove ',
                            text: 'Delete'
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }

});