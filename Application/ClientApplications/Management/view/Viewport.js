
Ext.define('Management.view.Viewport', {

    extend: 'Ext.Viewport',

    layout: 'border',
    
		
    items: [
	{	region:'north',
		height:50,
		tbar:
		[
			{html: '<img src="../ClientApplications/Styles/GenPres/images/logo.png" />', height:40, width:200, xtype:'box'},
			{
				text: 'Users',
				action:'users',
				scale: 'large'
			}, {
				text: 'Logical units',
				action: 'logical_units',
				scale: 'large'
			}, {
				text: 'Patients',
				action: 'patients',
				scale: 'large'
			}
		]
	},{	
		region:'center',
		layout: 'fit',
		margin:'20 20 20 20'
	}],
	
    renderTo: Ext.getBody()
});