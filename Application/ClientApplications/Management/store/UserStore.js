Ext.define('Management.store.UserStore', {
    extend: 'Ext.data.Store',

    requires: [
        'Management.model.UserModel'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({

            storeId: 'UserStore',

            autoLoad: true,

            model: 'Management.model.UserModel',
            
            proxy: {
                type: 'direct',
                directFn: Management.GetUsers,
                reader: {
                    type: 'json'
                }
            }
            
        }, cfg)]);
    }
});