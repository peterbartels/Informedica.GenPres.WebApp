Ext.define('GenPres.view.login.LogicalUnitSelector', {
    extend: 'Ext.view.View',

    alias: 'widget.logicalunitselector',

    margin:'20 0 0 16',

    itemSelector: 'div.LogicalUnitDataViewItem',

    emptyText: 'No logical units found',

    singleSelect: true,

    autoScroll: true,

    store: Shared.util.StoreManager.GetStore('LogicalUnitDto', Login.GetLogicalUnits, {}, { autoLoad:true, sorters: [{ property: 'Name', direction: 'ASC' }] }),
    
    tpl: new Ext.XTemplate(
            '<tpl for="."><div class="LogicalUnitDataView">',
                '<div class="LogicalUnitDataViewItem">',
                    '{Name}',
                '</div>',
            '</div></tpl>'),

    initComponent : function(){
        var me = this;
        me.callParent();
    }
});