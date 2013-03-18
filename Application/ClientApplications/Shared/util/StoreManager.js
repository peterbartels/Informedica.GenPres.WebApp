Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

Ext.define('Shared.util.StoreManager', {

    singleton: true,

    stores: {},
    
    GetStore : function(name, modelName, directFn){

        if (typeof (this.stores[name]) == "undefined") {

            var model = Ext.create(modelName);
            
            this.stores[name] = Ext.create('Ext.data.Store', {

                model: modelName,

                autoLoad: true,

                proxy: {
                    type: 'direct',
                    directFn: Management.GetUsers,
                    reader: {
                        type: 'json'
                    }
                }
            });
        }
        return this.stores[name];
    }
});