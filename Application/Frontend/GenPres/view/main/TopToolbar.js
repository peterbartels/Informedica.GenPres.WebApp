
Ext.define('GenPres.view.main.ToolbarButton', {
    extend:'Ext.button.Button',
    text: '',
    scale:'small',
    location: 'Frontend/Styles/GenPres/images/TopToolbar/',
    iconAlign:'left',
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
                columns: 3,
                title: 'Algemeen',
				height: 96,
                items : [
                    Ext.create('GenPres.view.main.ToolbarButton', {icon: 'Home_32.png', text: 'Home', width: 80, action: 'home', rowspan:2, scale:'large', iconAlign:'top' }),
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'Prescription_32.png', text:'Voorschrijven', width:130}),
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'TPN_32.png', text:'TPN', width:70}),
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'TPN_32.png', text:'Aanpassen', width:130})
                ]
            },
            {xtype: 'tbseparator',height:20},
            {
                xtype: 'buttongroup',
                columns: 3,
                title: 'Opties',
				height: 96,
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
                height:96,
                width:350,
                items : Ext.create('GenPres.view.main.PatientInfo')
            },
            {
                xtype: 'buttongroup',
                columns: 1,
                height: 96,
                html: 'medewerker info',
                width:200,
                title: 'Medewerker'
            }
        ]
        me.callParent();
    }
});
