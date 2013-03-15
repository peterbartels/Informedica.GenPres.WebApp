Ext.define('GenPres.store.patient.LogicalUnitStore', {

    extend: 'Ext.data.Store',

    storeId: 'logicalUnitStore',

    alias: 'widget.logicalunitstore',

    reader: {
        type: 'json',
        root: 'users'
    },

    autoLoad: true,

    model:'GenPres.model.patient.LogicalUnitModel'
});