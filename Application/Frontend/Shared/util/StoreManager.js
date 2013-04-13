Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

Ext.define('Shared.util.StoreManager', {

    singleton: true,

    stores: {},
    
    GetStore: function (name, directFn, extraParams, applyConfig) {

        if (typeof (this.stores[name]) == "undefined") {

            var model = Ext.create(name);

            var paramOrder = [];

            for (var param in extraParams) {
                paramOrder.push(param);
            }

            var config = {

                model: name,

                proxy: Ext.create('Ext.data.proxy.Direct',{
                    type: 'direct',
                    directFn: directFn,
                    paramsAsHash: false,
                    paramOrder: paramOrder,
                    extraParams:extraParams
                })
            };

            Ext.applyIf(config, applyConfig);
            
            //Ext.define('GenPres.store.' + name, config);
            this.stores[name] = Ext.create('Ext.data.Store', config);
 
        }
        return this.stores[name];
    }
});