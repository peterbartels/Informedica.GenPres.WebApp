/**
 * Created by JetBrains WebStorm.
 * User: halcwb
 * Date: 6/25/11
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: true,
    paths : {
        Ext: '.',
        GenPres : './Client/GenPres/app/'
    }
});

Ext.require([
    'Ext.direct.*'
]);

Ext.onReady(function () {
    Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

    //Ext.app.config.appFolder = './Client/GenPres/app';
    Ext.application({
        requires : 'GenPres.view.user.LoginWindow',
        name: 'test',
        launch: function() {
            var loginWindow = Ext.create('GenPres.view.user.LoginWindow');
            loginWindow.show();
        }
    });
});
