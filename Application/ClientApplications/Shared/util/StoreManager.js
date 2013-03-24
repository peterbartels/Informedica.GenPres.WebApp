Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

Ext.define('Shared.util.StoreManager', {

    singleton: true,

    stores: {},
    
    GetStore : function(name, directFn, applyConfig){

        if (typeof (this.stores[name]) == "undefined") {

            var model = Ext.create(name);

            var config = {

                model: name,

                autoLoad: true,

                proxy: Ext.create('Ext.data.proxy.Direct',{
                    type: 'direct',
                    directFn:directFn,
                    extraParams:{
                        test:'test'
                    },
                })
            };

            //Ext.applyIf(config, applyConfig);
            //Ext.define('GenPres.store.' + name, config);
            this.stores[name] = Ext.create('Ext.data.Store', config);
 
        }
        return this.stores[name];
    }
});