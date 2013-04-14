Ext.define('GenPres.view.main.MainViewCenterContainer', {

    extend: 'Ext.Panel',
    region: 'center',
    xtype: 'panel',

    activeItem: 0,

    border:false,

    layout: 'card',
	
    initComponent : function(){
        var me = this;
		debugger;
        me.items = [
            {
                id: 'card-0',
                xtype:'box',
                html:'<br /><br /><h1>&nbsp;&nbsp;&nbsp;Welkom bij GenPres - Development version</h1>',
                border:false
            }
        ];
		
		
        me.dockedItems = Ext.create('GenPres.view.main.TopToolbar');
        GenPres.application.MainCenterContainer = this;
		
		me.callParent();
    },

    height: 100,
    split: false,
    margins: '0 0 0 0'
})