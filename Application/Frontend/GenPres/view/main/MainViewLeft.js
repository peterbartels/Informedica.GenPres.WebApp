Ext.define('GenPres.view.main.MainViewLeft', {
    extend: 'Ext.Panel',
    layout:'vbox',
    region: 'west',
    xtype: 'panel',
    border:false,

    autoScroll:true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    width: 300,
    split: true,
    margins: '0 0 0 0',

    initComponent : function(){
        var me = this;
        me.items = [
            {
                xtype:'box',
                border:false,
                html: '<div style="text-align:center"><img src="ClientApplications/Styles/GenPres/images/logo.png" style="margin-top:22px;" /></div>',
                height: 82
            },
            Ext.create('GenPres.view.main.PatientTree', {
                name:'mainPatientTree'
            })	
        ];
        me.callParent();
    }
});