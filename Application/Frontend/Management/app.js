
Ext.require('*');

Ext.Loader.setConfig({
    enabled: true,
	
	paths:{
	    Shared: '../Frontend/Shared',
	    Management: '../Frontend/Management'
	}
});

Ext.application({

    init: function () {

        this.control({
            'button[action=users]': {
                click: this.showUsers
            },
            'button[action=logical_units]': {
                click: this.showLogicalUnits
            },
            'button[action=patients]': {
                click: this.showPatients
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

    appFolder: '../Frontend/Management',
	
    requires: ['Ext.grid.plugin.BufferedRendererTreeView', 'Shared.util.StoreManager', 'Shared.util.ModelLoader', 'Ext.data.proxy.Direct'],
	
	autoCreateViewport: true,
	
    controllers: [
        'UserEditingController', 'LogicalUnitController', 'PatientController'
    ],

    showUsers: function () {
        this.getViewport().remove(1);
        this.getViewport().add(Ext.create('Management.view.UserGrid'));
    },

    showLogicalUnits: function () {
        this.getViewport().remove(1);
        this.getViewport().add(Ext.create('Management.view.LogicalUnitGrid'));
    },

    showPatients: function () {
        this.getViewport().remove(1);
        this.getViewport().add(Ext.create('Management.view.PatientGrid'));
    }
});