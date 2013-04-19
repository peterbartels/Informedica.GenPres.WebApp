
Ext.require('Ext.*');

Ext.Loader.setConfig({
    enabled: true,

    paths: {
        Shared: './Frontend/Shared',
        GenPres: './Frontend/GenPres'
    }
});

Ext.application({
	
	autoCreateViewport:false,
	
    name: 'GenPres',

    models:[
    ],
	
	paths : {
	    Shared: './Frontend/Shared',
	    GenPres: './Frontend/GenPres'
	},

	requires: [
		'Ext.grid.plugin.BufferedRendererTreeView', 
		'Shared.util.StoreManager', 
		'Shared.util.ModelLoader', 
		'Shared.util.Process', 
		'Ext.data.proxy.Direct', 
		'GenPres.view.login.LoginWindow',
		'GenPres.controller.login.Login'
	],
	
	appFolder : './Frontend/GenPres',

    views: [
    ],

    stores: [
    ],

    controllers: [
        'GenPres.controller.login.Login', 'GenPres.controller.patient.Patient'
    ],
	
	getViewPort: function(){
		this.viewport = Ext.create('Ext.Viewport', {
            layout: {
                type: 'border',
                padding: 1
            },
            defaults: {
                split: true
            },
            items: [
				Ext.create('GenPres.view.main.MainViewLeft'),
				Ext.create('GenPres.view.main.MainViewCenter')
			]
        });
		return this.viewport;
	},
	
    launch: function() {
        
		var me = this;
        GenPres.application = me;
        me.setDefaults();
		var getParams = document.URL.split("?");
		var params = Ext.urlDecode(getParams[getParams.length - 1]);
		if(typeof(params.test) != "undefined" && params.test != ""){
			me.runTests(params.test);
		}else{
			me.showLoginWindow();
		}
    },

	runTests: function(testRunnerType){
		var me = this;
		
		if(testRunnerType == "usecase"){
			me.showLoginWindow();
			
			//TODO: move to seperate test runner class (file)
			var loginTest = Ext.create('GenPres.test.usecase.LoginTest');
			describe(loginTest.describe, loginTest.tests);
		}
		if(testRunnerType == "integration"){
			
		}
		jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.Queue(jasmine.getEnv());
        jasmine.getEnv().execute();
	},
	
    showLoginWindow: function () {
        var me = this, window;
        window = me.getLoginWindow().show();
    },

    getLoginWindow: function () {
        var me = this;
        return me.getController('GenPres.controller.login.Login').getLoginWindow();
    },

    setDefaults : function(){
        Ext.override(Ext.form.field.ComboBox, {
            displayField: 'Value',
            typeAhead: true,
            queryMode: 'local',
            width: 140,
            typeAheadDelay:0,
            queryDelay:0,
            validateOnBlur:false,
            validationDelay : 0,
            forceSelection: true,
            triggerAction: 'all',
            labelAlign:'top',
            selectOnFocus: true
        });
    }
});		