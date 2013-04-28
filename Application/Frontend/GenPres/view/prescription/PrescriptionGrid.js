
Ext.define('GenPres.view.prescription.PrescriptionGrid', {

    extend:'Ext.grid.Panel',

    border:false,
	bodyStyle: {
		background: '#f0f0f0',
	},
	
	margins:'10 10 10 10',
		
    alias: 'widget.prescriptiongrid',

/*    store: 'prescription.Prescription',*/

    title:'Voorschriften',

    columns: [
        {header: 'StartDate',  dataIndex: 'StartDate'},
        {header: 'Generiek',  dataIndex: 'drugGeneric'}
    ],
    
    initComponent : function(){
        var me = this;
        me.callParent();
    }
});
