Ext.Loader.setConfig({
    enabled: true,
    disableCaching: true
});

Ext.require([
    'Ext.direct.*',
    'Ext.container.Viewport',
    'Ext.grid.plugin.RowEditing',
    'Ext.form.FieldSet',
    'Ext.tab.Panel',
    'Ext.form.field.HtmlEditor'
]);

globalvars = {};

var createBindFunction = function (func, scope, args, gobalvarname, waitcount) {
    //var bindFunc = Ext.Function.bind(func, scope, args);
    var fn = Ext.Function.bind(func, scope, args);
    var deferFunc = function () {
        if (waitcount > 0) {
            setTimeout(fn, waitcount);
        } else {
            fn();
        }
        return globalvars[gobalvarname];
    }
    return deferFunc;
}

Ext.application({

    name: 'GenPres',

    models: [
    ],

    paths: {
        Shared: '../ClientApplications/Shared',
        GenPres: '../ClientApplications/GenPres'
    },

    requires: ['Ext.grid.plugin.BufferedRendererTreeView', 'Shared.util.StoreManager', 'Shared.util.ModelLoader', 'Shared.util.Process', 'Ext.data.proxy.Direct', 'GenPres.controller.login.Login'],

    appFolder: '../ClientApplications/GenPres',


    launch: function () {
        var me = this;
        GenPres.application = me;

        this.viewport = Ext.create('Ext.Viewport', {
            layout: {
                type: 'border',
                padding: 1
            },
            defaults: {
                split: true
            },
            items: [/*{
                region: 'west',
                collapsible: true,
                title: 'Starts at width 30%',
                split: true,
                width: '30%',
                minWidth: 100,
                minHeight: 140,
                html: 'west<br>I am floatable'
            },*/{
                region: 'center',
                html: '',
                title: '',
                minHeight: 80
            }/*,{
                region: 'south',
                height: 100,
                split: true,
                collapsible: true,
                title: 'Splitter above me',
                minHeight: 60,
                html: 'center south',
                weight: -100
            }*/]
        });

        me.showLoginWindow();
/*
        advancedLoginTest = Ext.create('GenPres.test.usecase.AdvancedLoginTest');
        describe(advancedLoginTest.describe, advancedLoginTest.tests);
  */      
        loginTest = Ext.create('GenPres.test.usecase.LoginTest');
        describe(loginTest.describe, loginTest.tests);
/*
        selectPatientTest = Ext.create('GenPres.test.usecase.SelectPatientTest');
        describe(selectPatientTest.describe, selectPatientTest.tests);

        drugCompositionTest = Ext.create('GenPres.test.usecase.DrugCompositionTest');
        describe(drugCompositionTest.describe, drugCompositionTest.tests);

        var PrescriptionPatientTest = Ext.create('GenPres.test.usecase.PrescriptionPatientTest');
        describe(PrescriptionPatientTest.describe, PrescriptionPatientTest.tests);

        //prescriptionTest = Ext.create('GenPres.test.usecase.PrescriptionTest');
        //describe(prescriptionTest.describe, prescriptionTest.tests);
        */


        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.Queue(jasmine.getEnv());
        jasmine.getEnv().execute();

    },

    showLoginWindow: function () {
        var me = this, window;
        
        window = me.getLoginWindow().show();
        //me.getController('user.Login').setDefaultDatabase(window);
    },

    getLoginWindow: function () {
        var me = this;
        return me.getController('login.Login').getLoginWindow();
    }
});