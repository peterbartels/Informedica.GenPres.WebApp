
Ext.define('GenPres.view.main.ToolbarButton', {
    extend:'Ext.button.Button',
    text: '',
    scale:'large',
    location: 'Client/GenPres/style/images/TopToolbar/',
    iconAlign:'top',
    disabled: false,
    width:60,
    initComponent:function(){
        var me = this;
        me.icon = me.location + me.icon;
        me.callParent();
    }
});

Ext.define('GenPres.view.main.TopToolbar', {
    extend:'Ext.container.ButtonGroup',
    dock: 'top',

    initComponent : function(){
        var me = this;
        me.items = [
            {
                xtype: 'buttongroup',
                columns: 5,
                height:114,
                title: 'Algemeen',
                items : [
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'Home_32.png', text:'Home', width:80, action:'home'}),
                    {xtype: 'tbseparator',height:20},
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'Prescription_32.png', text:'Voorschrijven', width:130}),
                    {xtype: 'tbseparator',height:20},
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'TPN_32.png', text:'TPN', width:70})
                ]
            },
            {xtype: 'tbseparator',height:20},
            {
                xtype: 'buttongroup',
                columns: 3,
                height:114,
                title: 'Opties',
                items : [
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'Template_32.png', text:'Sjablonen', width:100}),
                    {xtype: 'tbseparator',height:20},
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'NewMedicine_32.png', text:'Nieuw medicament', width:175})
                ]
            },
            {
                xtype: 'buttongroup',
                columns: 1,
                title: 'Patient informatie',
                id:'PatientInfoView',
                width:350,
                height:114,
                items : Ext.create('GenPres.view.main.PatientInfo')
            },
            {
                xtype: 'buttongroup',
                columns: 1,
                height:114,
                title: 'Medewerker',
                items : [
                    {html:' ', height:57, width:200}
                ]
            }
        ]
        me.callParent();
    }
});