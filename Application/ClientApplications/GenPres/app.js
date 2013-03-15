//@require @packageOverrides

Ext.application({

    name: 'GenPres',

    models:[
    ],

appFolder : './ClientApplications/GenPres',

    views: [
        'Main',
        'Viewport'
    ],

    stores: [
    ],

    controllers: [
        'Main'
    ],

    launch: function() {
        var me = this;
        GenPres.application = me;
        
        //GenPres.ASyncEventManager = GenPres.lib.util.ASyncEventManager;

        me.setDefaults();

        this.viewport = Ext.create('Ext.container.Viewport', {
            layout: 'fit'
        });
        me.showLoginWindow();
    },

    showLoginWindow: function () {
        var me = this, window;
        window = me.getLoginWindow().show();
        me.getController('user.Login').setDefaultDatabase(window);
    },

    getLoginWindow: function () {
        var me = this;
        return me.getController('user.Login').getLoginWindow();
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