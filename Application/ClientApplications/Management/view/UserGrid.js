Ext.define('Management.view.UserGrid', {
    extend: 'Management.view.EditableModelGrid',

    title: 'Users',

    alias: ['widget.usergrid'],

    store: Shared.util.StoreManager.GetStore('UserDto', Management.GetUsers),
    
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
            ]
        });

        me.callParent(arguments);
    }

});