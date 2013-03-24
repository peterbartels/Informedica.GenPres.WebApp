//@require @packageOverrides
Ext.require('*');

Ext.Loader.setConfig({
    enabled: true,

    paths: {
        Shared: './ClientApplications/Shared',
        GenPres: './ClientApplications/GenPres'
    }
});

Ext.application({

    name: 'GenPres',

    models:[
    ],
	
	paths : {
	    Shared: './ClientApplications/Shared',
	    GenPres: './ClientApplications/GenPres'
	},

	requires: ['Ext.grid.plugin.BufferedRendererTreeView', 'Shared.util.StoreManager', 'Shared.util.ModelLoader', 'Shared.util.Process', 'Ext.data.proxy.Direct', 'GenPres.controller.login.Login'],
	
	appFolder : './ClientApplications/GenPres',

    views: [
        'Main'
    ],

    stores: [
    ],

    controllers: [
        'GenPres.controller.login.Login'
    ],

    launch: function() {
        var me = this;
        GenPres.application = me;
        
        //GenPres.ASyncEventManager = GenPres.lib.util.ASyncEventManager;

        me.setDefaults();

        this.viewport = Ext.create('Ext.Viewport', {
            layout: {
                type: 'border',
                padding: 1
            },
            defaults: {
                split: true
            },
            items: [/*{
                region: 'west',
                collapsible: true,
                title: 'Starts at width 30%',
                split: true,
                width: '30%',
                minWidth: 100,
                minHeight: 140,
                html: 'west<br>I am floatable'
            },*/{
                region: 'center',
                html: '',
                title: '',
                minHeight: 80
            }/*,{
                region: 'south',
                height: 100,
                split: true,
                collapsible: true,
                title: 'Splitter above me',
                minHeight: 60,
                html: 'center south',
                weight: -100
            }*/]
        });

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