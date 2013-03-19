Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

Ext.define('Shared.util.StoreManager', {

    singleton: true,

    stores: {},
    
    GetStore : function(name, directFn, sorters){

        if (typeof (this.stores[name]) == "undefined") {

            var model = Ext.create(name);
            
            this.stores[name] = Ext.create('Ext.data.Store', {

                model: name,

                autoLoad: true,

                proxy: {
                    type: 'direct',
                    directFn: directFn,
                    reader: {
                        type: 'json'
                    }
                },

                sorters: sorters
            });
            
            
        }
        return this.stores[name];
    }
});