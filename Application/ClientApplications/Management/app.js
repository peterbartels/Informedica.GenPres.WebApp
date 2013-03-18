
Ext.require('*');

Ext.Loader.setConfig({
    enabled: true,
	
	paths:{
	    Shared: '../ClientApplications/Shared',
	    Management: '../ClientApplications/Management'
	}
});

Ext.application({

    init: function () {

        this.control({
            'button[action=users]': {
                click: this.showUsers
            }
        });
    },

    refs: [
        {
            ref: 'viewport',
            selector: 'viewport'
        }
    ],

    name: 'Management',

    appFolder: '../ClientApplications/Management',
	
    requires: ['Ext.grid.plugin.BufferedRendererTreeView', 'Shared.util.StoreManager', 'Shared.util.ModelLoader', 'Ext.data.proxy.Direct'],
	
	autoCreateViewport: true,
	
    controllers: [
        'UserEditingController'
    ],

    showUsers: function () {
        this.getViewport().remove(1);
        this.getViewport().add(Ext.create('Management.view.UserGrid'));
    }
});