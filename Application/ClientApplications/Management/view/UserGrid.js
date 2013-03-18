Ext.define('Management.view.UserGrid', {
    extend: 'Ext.grid.Panel',

    title: 'Users',

    store: Shared.util.StoreManager.GetStore('UserDto', 'UserDto'),
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            region: 'center',
            columns: [
                {
                    xtype: 'gridcolumn',
                    width: 197,
                    dataIndex: 'Username',
                    text: 'Username',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    xtype: 'gridcolumn',
                    width: 211,
                    dataIndex: 'Password',
                    text: 'Password',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                 }
            ],
            selType: 'rowmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToEdit: 2,
                    errorSummary: false
                })
            ],
            viewConfig: {

            },
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