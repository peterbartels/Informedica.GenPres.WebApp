﻿
Ext.define('GenPres.view.main.PatientTree', {
    extend: 'Ext.view.View',

    alias: 'widget.patientlist',

    margin: '0 0 0 0',

    itemSelector: 'div.PatientViewItem',

    emptyText: 'No logical units found',

    singleSelect: true,

    autoScroll: true,

    padding:'4 4 4 4',

    store: Shared.util.StoreManager.GetStore('PatientDto', Patient.GetPatientsByLogicalUnit, { logicalUnit: "26240f04-310b-4e1a-be77-7986dea8aff3" }, {autoLoad:false}),

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