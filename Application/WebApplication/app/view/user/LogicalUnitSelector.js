Ext.define('GenPres.view.user.LogicalUnitSelector', {
    extend: 'Ext.view.View',

    requires: ['GenPres.store.patient.LogicalUnitStore'],

    alias: 'widget.logicalunitselector',

    margin:'20 0 0 16',

    itemSelector: 'div.LogicalUnitDataViewItem',

    emptyText: 'No logical units found',

    singleSelect: true,

    autoScroll: true,

    store: Ext.create('GenPres.store.patient.LogicalUnitStore'),
    
    tpl: new Ext.XTemplate(
            '<tpl for="."><div class="LogicalUnitDataView">',
                '<div class="LogicalUnitDataViewItem">',
                    '{text}',
                '</div>',
            '</div></tpl>'),

    initComponent : function(){
        var me = this;
        me.callParent();
        qqq = me;
        
    }
});