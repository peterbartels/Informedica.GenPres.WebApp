Ext.Loader.setConfig({
    enabled: true,
	
	paths:{
		Shared: '../ClientApplications/Shared'
	}
});


Ext.application({
    name: 'Management',

    appFolder: '../ClientApplications/Management',
	
	requires:['Ext.rtl.AbstractComponent'],
	
	autoCreateViewport: true,
	
    requires: ['Shared.util.ModelLoader'],

    controllers: [
        'UserEditingController'
    ]
});