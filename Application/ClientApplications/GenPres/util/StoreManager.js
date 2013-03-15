Ext.define('GenPres.util.StoreManager', {

    singleton: true,

    stores: {},
    
    GetStore : function(name, modelName, directFn){
        if (typeof(stores[name]) == "undefined") {
            stores[name] = Ext.create('Ext.data.Store', {
                model: 'User',
                proxy: {
                    type: 'direct',
                    directFn: Management.GetUsers()
                },
                autoLoad: true
            });
        }
    }
});