//@require @pext.ackageOverrides
Ext.require('Ext.*');

Ext.Loader.setConfig({
    enabled: true,

    paths: {
        Shared: './Frontend/Shared',
        GenPres: './Frontend/GenPres'
    }
});

Ext.application({
	
	autoCreateViewport:false,
	
    name: 'GenPres',

    models:[
    ],
	
	paths : {
	    Shared: './Frontend/Shared',
	    GenPres: './Frontend/GenPres'
	},

	requires: ['Ext.grid.plugin.BufferedRendererTreeView', 'Shared.util.StoreManager', 'Shared.util.ModelLoader', 'Shared.util.Process', 'Ext.data.proxy.Direct', 'GenPres.controller.login.Login'],
	
	appFolder : './Frontend/GenPres',

    views: [
        
    ],

    stores: [
    ],

    controllers: [
        'GenPres.controller.login.Login', 'GenPres.controller.patient.Patient'
    ],
	
	getViewPort: function(){
		this.viewport = Ext.create('Ext.Viewport', {
            layout: {
                type: 'border',
                padding: 1
            },
            defaults: {
                split: true
            },
            items: [
				Ext.create('GenPres.view.main.MainViewLeft'),
				Ext.create('GenPres.view.main.MainViewCenter')
			]
        });
		return this.viewport;
	},
	
    launch: function() {
        var me = this;
        GenPres.application = me;
		
		//me.getViewPort();
        //GenPres.ASyncEventManager = GenPres.lib.util.ASyncEventManager;

        me.setDefaults();
		
        me.showLoginWindow();
    },

    showLoginWindow: function () {
        var me = this, window;
        
        window = me.getLoginWindow().show();
        //me.getController('user.Login').setDefaultDatabase(window);
    },

    getLoginWindow: function () {
        var me = this;
        return me.getController('GenPres.controller.login.Login').getLoginWindow();
    },

    setDefaults : function(){
        Ext.override(Ext.form.field.ComboBox, {
            displayField: 'Value',
            typeAhead: true,
            queryMode: 'local',
            width: 140,
            typeAheadDelay:0,
            queryDelay:0,
            validateOnBlur:false,
            validationDelay : 0,
            forceSelection: true,
            triggerAction: 'all',
            labelAlign:'top',
            selectOnFocus: true
        });
    }
});		