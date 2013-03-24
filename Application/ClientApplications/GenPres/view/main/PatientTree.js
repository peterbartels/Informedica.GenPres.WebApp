
Ext.define('GenPres.view.main.PatientTree', {
    extend: 'Ext.view.View',

    alias: 'widget.logicalunitselector',

    margin: '0 0 0 0',

    itemSelector: 'div.PatientViewItem',

    emptyText: 'No logical units found',

    singleSelect: true,

    autoScroll: true,

    store: Shared.util.StoreManager.GetStore('PatientDto', Patient.GetPatientsByLogicalUnit),

    tpl: new Ext.XTemplate(
            '<tpl for="."><div class="PatientView">',
                '<div class="PatientViewItem">',
                    '{FirstName}&nbsp;{LastName}',
                '</div>',
            '</div></tpl>'),

    initComponent: function () {
        var me = this;
        me.callParent();
        
    }
});