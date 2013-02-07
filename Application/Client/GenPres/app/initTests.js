Ext.Loader.setConfig({
    enabled: true,
    paths : {
        Ext: '.',
        GenPres : './Client/GenPres/app/'
    },
    disableCaching: true
});

Ext.require([
    'Ext.direct.*',
    'Ext.container.Viewport',
    'Ext.grid.plugin.RowEditing',
    'Ext.form.FieldSet',
    'Ext.form.field.ComboBox',
    'Ext.tab.Panel',
    'Ext.form.field.HtmlEditor'
]);


Ext.onReady(function () {
    Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

    //Ext.app.config.appFolder = './Client/GenPres/app';
    Ext.application({
        name: 'test',
        launch: function () {
            var me = this, test,
                testList = Ext.create('GenPres.test.TestList'),
                testLoader = Ext.create('GenPres.test.TestLoader');

            this.viewport = Ext.create('Ext.container.Viewport', {
                layout: 'fit'
            });

            testLoader.loadTests(testList);

            jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.Queue(jasmine.getEnv());
            jasmine.getEnv().execute();
        }
    });
});

/*
Ext.onReady(function () {

    Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

    Ext.application({
        launch : function() {
            var me = this, test,
                testList = Ext.create('GenPres.test.TestList'),
                testLoader = Ext.create('GenPres.test.TestLoader');

            //GenPres.application = me;

            //me.setDefaults();

            this.viewport = Ext.create('Ext.container.Viewport', {
                layout: 'fit'
            });
        
            testLoader.loadTests(testList);

            jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.Queue(jasmine.getEnv());
            jasmine.getEnv().execute();
            
        }  
    });

});
*/