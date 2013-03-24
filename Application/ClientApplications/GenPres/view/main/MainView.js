Ext.define('GenPres.view.main.MainView', {

    extend: 'Ext.Panel',

    layout: 'fit',
    
    border:false,

    constructor : function(){
        var me = this;
        me.callParent(arguments);
    },

    initComponent : function(){
        var me = this;
        
        me.items = [
            /*Ext.create('GenPres.view.main.MainViewLeft'),
            Ext.create('GenPres.view.main.MainViewCenter')*/
            
            

        ];
        me.callParent();
        
        return me;
    }
});