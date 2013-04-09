Ext.define('GenPres.controller.login.Login', {
    extend: 'Ext.app.Controller',
    alias: 'widget.logincontroller',
	
	requires: ['GenPres.session.PatientSession'],
	
    views: [
        'login.LoginWindow'
    ],

    loggedIn: false,
    loginWindow: null,

    init: function() {
        var me = this;

        this.control({
            'window button[text=Login]': {
                click: me.onClickValidateLogin
            },
            'button[action=registerdatabase]': {
                click: me.showRegisterDatabaseWindow
            },
            'window[title="Registreer Database"] button[action=save]': {
                click: me.onClickSaveDatabaseRegistration
            },
            'dataview' : {
                itemclick: function (view, record, item, index, event) {
                    var patientController = me.getController('GenPres.controller.patient.Patient');
                    patientController.setLogicalUnitId(record.data.Id);
                }
            }
        });
    },

    getLoginWindow: function () {
        var me = this, window;
        window = me.getLoginLoginWindowView().create();
        return window;
    },

    setDefaultDatabase: function (window) {
        var combo, queryHelper = Ext.create('GenPres.lib.util.QueryHelper');
        combo = Ext.ComponentQuery.query('window[title=' + window.title + '] combobox[name=database]')[0];
        //var fieldset = combo.up('fieldset');
        //fieldset.expand();
        //queryHelper.setFormField(combo, 'Default Database');
        //fieldset.collapse();
    },

    onClickValidateLogin: function (button) {
        var win, form, vals;
        win = button.up('window');
        this.loginWindow = win;
        form = win.down('form');
        vals = form.getValues();
        this.validateLogin(vals);
    },

    validateLogin: function(vals) {
        if (this.validateLoginForm(vals)) {
            Login.Authenticate(vals.username, vals.password, this.loginCallBackFunction, this);
        }
    },

    validateLoginForm : function(vals){
        var error = '';

        if(vals.username == ''){
            error += 'Selecteer aub een gebruikersnaam<br />';
        }

        if(vals.password == ''){
            error += 'Selecteer aub een wachtwoord<br />';
        }

        var patientController = this.getController('GenPres.controller.patient.Patient');
        
        if(
            patientController.getLogicalUnitId() == null
        ){
            error += 'Selecteer aub een afdeling\n';
        }
        if(error != ''){
            Ext.MessageBox.alert('GenPres 2011 Login Error', error);
        }

        return error == '';
    },

    loginCallBackFunction: function (result) {
        var me = this;
        me.processAuthentication (result.success);
    },
	
	processAuthentication: function (isAuthenticated) {
        var me = this;
		me.loggedIn = isAuthenticated;
        if (isAuthenticated) {
            me.closeLoginWindow();
            var mainViewLeft = Ext.create('GenPres.view.main.MainViewLeft');
            var mainViewCenter = Ext.create('GenPres.view.main.MainViewCenter');
            GenPres.application.viewport.removeAll();
            GenPres.application.viewport.add(mainViewLeft);
            GenPres.application.viewport.add(mainViewCenter);
            GenPres.application.viewport.doLayout();
        }else{
            Ext.MessageBox.alert('GenPres 2011 Login', 'Login geweigerd');
        }
    },

    closeLoginWindow: function () {
        var me = this;
        me.loginWindow.close();
    },

    showRegisterDatabaseWindow: function () {
        var me = this;
        me.createRegisterDatabaseWindow().show();
    },

    createRegisterDatabaseWindow: function () {
        var me = this;
        return me.getDatabaseRegisterDatabaseWindowView().create();
    },

    onClickSaveDatabaseRegistration: function (button) {
        var me = this;
        Database.SaveDatabaseRegistration(me.getWindowFromButton(button).getDatabaseName(),
                                          me.getWindowFromButton(button).getMachineName(),
                                          me.getWindowFromButton(button).getGenPresConnectionString(),
                                          me.getWindowFromButton(button).getPDMSConnectionString(),
                                          me.getWindowFromButton(button).getGenFormWebservice(),
                                          me.onDatabaseRegistrationSaved);
        me.getWindowFromButton(button).close();
    },

    getWindowFromButton: function (button) {
        return button.up().up();
    },

    onDatabaseRegistrationSaved: function (result) {
        var me = this;

        if (result.success) {
            Ext.MessageBox.alert('Database Registration', result.databaseName);
        } else {
            Ext.MessageBox.alert('Database Regstration', 'Database could not be registered');
        }
    }
});