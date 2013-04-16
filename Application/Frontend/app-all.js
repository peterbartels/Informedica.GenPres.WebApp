Ext.define('GenPres.controller.Main', {
    extend:  Ext.app.Controller 
});
Ext.define('GenPres.session.PatientSession', {

    currentLogicalUnitId:0,

    currentLogicalUnitName:'',

    singleton: true,

    patient : {
        PID:""
    },

    setLogicalUnit : function(id, name){
        this.currentLogicalUnitId = id;
        this.currentLogicalUnitName = name;
    },

    getLogicalUnitId : function(){
        return this.currentLogicalUnitId;
    },
    
    getLogicalUnitName : function(){
        return this.currentLogicalUnitName;
    },

    setPatient : function(record){
        this.patient.PID = record.data.PID;
    }
})
Ext.define('GenPres.view.main.MainViewLeft', {
    extend:  Ext.Panel ,
    layout:'vbox',
    region: 'west',
    xtype: 'panel',
    border:false,

    autoScroll:true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    width: 300,
    split: true,
    margins: '0 0 0 0',

    initComponent : function(){
        var me = this;
        me.items = [
            {
                xtype:'box',
                border:false,
                html: '<div style="text-align:center"><img src="ClientApplications/Styles/GenPres/images/logo.png" style="margin-top:22px;" /></div>',
                height: 82
            },
            Ext.create('GenPres.view.main.PatientTree', {
                name:'mainPatientTree'
            })	
        ];
        me.callParent();
    }
});
Ext.define('GenPres.controller.patient.Patient', {    
	extend:  Ext.app.Controller ,
	alias: 'widget.patientcontroller',
	
	                                                                               
	
    views: [
        'login.LoginWindow'
    ],

    logicalUnitId: null,

    init: function() {
        this.control({
            'treepanel': {
                beforeitemclick: this.checkRootNode,
                itemclick: this.loadPatientData
            },
            'patientlist': {
                select: this.loadPatientData,
                render: this.loadPatientList/*,
                itemmouseenter: this.hoverItem,
                itemmouseleave: this.unhoverItem*/
            }
        });
    },

    hoverItem : function(view, record, item, index, e, eOpts){
        extItem = Ext.get(item);
        extItem.animate({ easing: 'easeIn', duration: 50, to: { backgroundColor: '#fff', color: '#3892D3' } });
    },

    unhoverItem: function (view, record, item, index, e, eOpts) {
        extItem = Ext.get(item);
        extItem.animate({ easing: 'easeIn', duration: 1, to: { backgroundColor: '#3892D3', color: '#fff' } });
    },

    loadPatientList: function (view) {
        
        view.store.proxy.extraParams.logicalUnit = this.logicalUnitId;
        view.store.reload();
    },

    checkRootNode : function(tree, record, htmlitem, index, event, options){
        if(index==0){
            var infoStore = this.getPatientPatientInfoStoreStore();
            var treePanel = this.getTreePanel();
            if(typeof(infoStore.getAt(0)) != "undefined"){
                treePanel.selModel.select(infoStore.getAt(0));
            }
            return false;
        }
    },
    loadPatientData : function(tree, record, htmlitem, index, event, options){

        /*(var me =this,
            infoStore = this.getPatientPatientInfoStoreStore();

        infoStore.loadRecords([record], {addRecords: false});
        GenPres.session.PatientSession.setPatient(record);

        var gridPanel = this.getGridPanel();
        gridPanel.store.proxy.extraParams.PID = GenPres.session.PatientSession.patient.PID;
        gridPanel.store.load();
        
        Patient.SelectPatient(GenPres.session.PatientSession.patient.PID, function(patientDto){
            var prescriptionController = GenPres.application.getController('prescription.PrescriptionController');
            prescriptionController.loadPrescriptionForm();
            prescriptionController.clearPrescription();
            me.setPatientWeight(patientDto.Weight);
            me.setPatientLength(patientDto.Height);
            prescriptionController.updatePrescription();
        });*/
        var prescriptionController = GenPres.application.getController('prescription.PrescriptionController');
        prescriptionController.loadPrescriptionForm();
    },

    setPatientWeight : function(weight){
        var prescriptionPatientComp = this.getPrescriptionPatientComponent();
        prescriptionPatientComp.down('unitvaluefield[name=patientWeight]').setValue(weight);
    },

    setPatientLength : function(height, unit){
        var prescriptionPatientComp = this.getPrescriptionPatientComponent();
        prescriptionPatientComp.down('unitvaluefield[name=patientLength]').setValue(height);
    },

    getPrescriptionPatientComponent : function(){
        return GenPres.application.MainCenter.query('prescriptionpatient')[0];
    },

    getGridPanel : function(){
        return GenPres.application.MainCenter.query('.prescriptiongrid')[0];
    },

    setLogicalUnitId : function(logicalUnitId){
        var me = this;
        me.logicalUnitId = logicalUnitId;
    },

    getLogicalUnitId: function () {
        var me = this;
        return me.logicalUnitId;
    },
    
    getTreePanel : function(){
        return GenPres.application.viewport.query('.patienttree')[0];
    }

});
Ext.define('GenPres.controller.login.Login', {
    extend:  Ext.app.Controller ,
    alias: 'widget.logincontroller',
	
	                                                                                   
	
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
            //var mainViewLeft = Ext.create('GenPres.view.main.MainViewLeft');
            //var mainViewCenter = Ext.create('GenPres.view.main.MainViewCenter');
            //GenPres.application.viewport.removeAll();
            //GenPres.application.viewport.add(mainViewLeft);
            //GenPres.application.viewport.add(mainViewCenter);
            //GenPres.application.viewport.doLayout();
			GenPres.application.getViewPort();
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
Ext.define('GenPres.test.TestList', {
    tests: [
        'GenPres.test.extjs.ClassTests',
        'GenPres.test.extjs.ComponentQueryTests',
        'GenPres.test.extjs.LoaderTests',
        'GenPres.test.controller.LoginControllerTests'/*,
        'GenPres.test.model.LoginModelTests',
        'GenPres.test.view.SaveCancelWindowTests',
        'GenPres.test.view.DatabaseRegistrationWindowTests',
        'GenPres.test.view.DrugCompositionTest',
        'GenPres.test.store.SubstanceUnit',
        'GenPres.test.view.PrescriptionFormTest',
        'GenPres.test.control.UnitValueFieldTest',
        'GenPres.test.view.PrescriptionPatientTest',
        'GenPres.test.view.PrescriptionVisibilityTest',
        'GenPres.test.util.ASyncEventManagerTest' */
    ]
});
Ext.define('GenPres.test.TestLoader', {

   loadTests: function (testList) {
        var test;
        for (var i = 0; i < testList.tests.length; i++) {
            test = Ext.create(testList.tests[i]);
            describe(test.describe, test.tests);
        }
   }
});
Ext.define('GenPres.test.control.UnitValueFieldTest', {

    describe: 'GenPres.control.UnitValueField',

    tests: function () {
        var me = this, instance, win;

        me.getViewForControl = function (config) {
            if (!instance) {
                var store = Ext.create('Ext.data.ArrayStore', {
                    autoDestroy: true,
                    fields: ['Value'],
                    data : [['g'],['mg'],['microg']]
                });
                instance = Ext.create('GenPres.control.UnitValueField', {
                    fieldLabel: 'Test',
                    labelAlign:'left',
                    unitStore:store,
                    name:'test'
                })
            }
            return instance;
        };

        me.createTestWindow = function(){
            win = Ext.create('Ext.Window', {
                items:me.getViewForControl(),
                padding:'50 50 50 50',
                border:0,
                height:520,
                width:900
            });
            win.show();
            return win;
        };
        it('can be created', function () {
            expect(me.getViewForControl()).toBeDefined();
        });

        it('can be rendered', function () {
            expect(me.createTestWindow()).toBeDefined();
        });
        it('has a setValue function', function () {
            expect(typeof(me.getViewForControl().setValue) == "function").toBeTruthy();
        })
        it('has a getValue function', function () {
            expect(typeof(me.getViewForControl().getValue) == "function").toBeTruthy();
        })
        it('can set a and get value', function () {
            me.getViewForControl().setValue({
                value:200,
                unit:'mg'
            });
            var value = me.getViewForControl().getValue();
            expect(value.value == 200 && value.unit == "mg").toBeTruthy();
        });
        it('has a setState function', function () {
            expect(typeof(me.getViewForControl().setState) == "function").toBeTruthy();
        })
        it('can set state to user', function () {
            me.getViewForControl().setState(GenPres.control.states.calculated);
            var value = me.getViewForControl().getValue();
            expect(me.getViewForControl().state == GenPres.control.states.calculated).toBeTruthy();
        });
        it('has a getInputEl function', function () {
            expect(typeof(me.getViewForControl().getInputEl) == "function").toBeTruthy();
        })
        it('has a setInputColor function', function () {
            expect(me.getViewForControl().setInputColor).toBeDefined();
        })
        it('can set input color to orange', function () {
             me.getViewForControl().setInputColor("orange");
            expect(me.getViewForControl().getInputEl().style.borderColor == "orange").toBeTruthy();
        });
        it('can set state to user', function () {
            me.getViewForControl().setState(GenPres.control.states.user);
            expect(me.getViewForControl().getInputEl().style.borderColor == "lime").toBeTruthy();
        });
        it('has a setHidden function', function () {
            expect(me.getViewForControl().setHidden).toBeDefined();
        })
        it('can be set hidden', function () {
            me.getViewForControl().setHidden(true);
        });
        it('can be set hidden', function () {
            me.getViewForControl().setHidden(true);
            expect(me.getViewForControl().getEl().dom.style.visibility == "hidden").toBeTruthy();
        });
        it('can be set visible', function () {
            me.getViewForControl().setHidden(false);
            expect(me.getViewForControl().getEl().dom.style.visibility == "").toBeTruthy();
        });
        it('can be destroyed', function () {
            me.getViewForControl().destroy();
            expect(me.getViewForControl().isDestroyed).toBeTruthy();
            win.close();
        });

    }
});
Ext.define('GenPres.test.controller.LoginControllerTests', {

    describe: 'Login controller should',

    tests: function () {

        it('Controller validateLogin should call validateLoginForm', function () {
            var controller = GenPres.application.getController("GenPres.controller.login.Login");
            spyOn(controller, 'validateLoginForm');
            controller.validateLogin({ username: "", password: "" });
            expect(controller.validateLoginForm).toHaveBeenCalled();
        });
        
        it('Controller validateLogin should call a backend login function', function () {
            var controller = GenPres.application.getController("GenPres.controller.login.Login");
            spyOn(controller, 'loginCallBackFunction');

            GenPres.session.PatientSession.setLogicalUnit(1, "test")

            controller.validateLogin({ username: "blah", password: "blah" });

            waitsFor(function () {
                return controller.loginCallBackFunction.wasCalled;
            }, 'waiting for loginCallBackFunction call', 3000);
        });

        it('Controller validateLogin throws an error when no username and password is chosen', function () {
            var controller = GenPres.application.getController("GenPres.controller.login.Login");
            GenPres.session.PatientSession.setLogicalUnit(1, "test");
            var validated = controller.validateLoginForm({ username: "", password: "" });
            expect(validated).toBe(false);
        });

        it('Controller validateLogin throws an error when no password is chosen', function () {
            var controller = GenPres.application.getController("GenPres.controller.login.Login");
            GenPres.session.PatientSession.setLogicalUnit(1, "test");
            var validated = controller.validateLoginForm({ username: "test", password: "" });
            expect(validated).toBe(false);
        });

        it('Controller validateLogin throws an error when no username is chosen', function () {
            var controller = GenPres.application.getController("GenPres.controller.login.Login");
            GenPres.session.PatientSession.setLogicalUnit(1, "test");
            var validated = controller.validateLoginForm({ username: "", password: "test" });
            expect(validated).toBe(false);
        });

        it('Controller validateLogin throws an error when no logicalUnit is chosen', function () {
            var controller = GenPres.application.getController("GenPres.controller.login.Login");
            GenPres.session.PatientSession.setLogicalUnit(0, "");
            var validated = controller.validateLoginForm({ username: "test", password: "test" });
            if (Ext.ComponentQuery.query('window').length == 1) {
                Ext.ComponentQuery.query('window')[0].close();
            }
            expect(validated).toBe(false);
        });
    }
});
Ext.define('GenPres.test.extjs.ClassTests', {
    describe:'Ext.Class',

    tests: function () {
        var instance, getInstance;

        Ext.define('Tests.BaseClass', {
            config: {
                name: 'baseClass'
            },

            constructor: function (config) {
                var me = this;
                console.log('Base Class gets constructed');
                me.initConfig(config);

                return me;
            }

        });

        Ext.define('Tests.MyCoolMixin', {
           someUseFullFunction: function () {
               console.log('I can do something usefull');
           }
        });

        Ext.define('Tests.MyClass', {
            extend:  Tests.BaseClass ,

            testProperty: 'test property',

            mixins: {
                somethingUseFull:  Tests.MyCoolMixin 
            },

            config: {
                name: 'name of the instance',
                someOtherProp: 'some other prop'
            },

            constructor: function (config) {
                var me = this;
                console.log('MyClass gets constructed');
                me = me.initConfig(config);

                me.callParent();
                return me;
            },

            // Gets called before setName method
            applyName: function (name) {
            var me = this;
            if (!Ext.isString(name) || name.length === 0) {
               me.throwError();
            }
            // need to return name otherwise name does not get set!!
            else {
               return name;
            }
             },

            throwError: function () {
                throw new Error('['+ Ext.getDisplayName(arguments.callee) +'] cannot have an empty string as a name');
            }
        });

        getInstance = function (config) {
            if (!instance) {
                return Ext.create('Tests.MyClass', config);
            }
        };

        it('can create an instance of Tests.MyClass', function () {
           expect(getInstance({name: 'test'})).toBeDefined();
        });

        it('an instance of Tests.MyClass should have a getter and setter method for name', function () {
            var instance = getInstance({name: 'test'});

            expect(instance.getName).toBeDefined();
            expect(instance.setName).toBeDefined();
        });


        it('Tests.MyClass should not accept an empty string for name', function () {
            var instance = getInstance({name: 'test'});

            spyOn(instance, 'throwError');
            instance.setName('');

            expect(instance.throwError).toHaveBeenCalled();
        });

        it('a valid name can be set', function () {
            var instance = getInstance({}), name = 'test';

            instance.setName(name);

            expect(instance.getName()).toBe(name);
        });

        it('the name property can be reset', function () {
            var name = 'instance',
                instance = getInstance({name: name});

            expect(instance.getName()).toBe(name);

            // This does not work! resetName is undefined?
            // instance.resetName();
            // expect(instance.getName() === name).toBeFalsy();
        });

        it('the test class should contain the method from the mixin', function () {
            var instance = getInstance({});

            expect(instance.someUseFullFunction).toBeDefined();

            spyOn(instance, 'someUseFullFunction');
            instance.someUseFullFunction();

            expect(instance.someUseFullFunction).toHaveBeenCalled();

        });

        it('the test class should have a testProperty', function () {
            expect(getInstance().testProperty).toBeDefined();
        });

    }
});
Ext.define('GenPres.test.extjs.ComponentQueryTests', {
    describe: 'Ext.ComponentQuery',
    tests: function () {
        var createTestForm;

        createTestForm = function () {
            return Ext.create('Ext.form.Panel', {
                id: 'testform',
                title: 'test',
                items: [
                    { xtype: 'textfield', name: 'test'}
                ]
            });
        };

        it('a test form should be created', function () {
           expect(createTestForm()).toBeDefined();
        });

        it('component query finds the panel', function () {
           expect(Ext.ComponentQuery.query('#testform').length).toBe(1);
        });

        it('should be able to get the testform using the title', function () {
           expect(Ext.ComponentQuery.query('panel[title="test"]').length).toBe(1);
        });

        it('if you go down from testform you get a textfield', function () {
            expect(createTestForm().down('textfield').name).toBe('test');
        });
    }
});
Ext.define('GenPres.test.extjs.LoaderTests', {
    describe: 'Ext.Loader',

    tests: function () {
        var me = this;

        it('should be enabled', function () {
            expect(Ext.Loader.config.enabled).toBe(true);
        });

        it('should have a GenPres path', function () {
            expect(Ext.Loader.config.paths.GenPres).toBeDefined();
        });
    }
});
Ext.define('GenPres.test.extjs.ModelTests', {
    describe: 'Ext.data.Model',

    tests: function () {
        //noinspection MagicNumberJS
        var me = this, instance, waitingTime = 200;
        /*
        Ext.define('Test.modeltests.TestModel', {
            extend: 'Ext.data.Model',

            fields: [
                {name: 'Id', type: 'integer', mapping: 'ProductId'},
                {name: 'Test', type: 'string', mapping: 'ProductName'}
            ],

            proxy: {
                type: 'direct',
                paramsAsHash: true,
                // If I omit the below line, store test throws an error, but not model tests
                directFn: Product.GetProduct,
                api: {
                    read: Product.GetProduct,
                    submit: Product.SaveProduct
                }
            },
            reader: {
                type: 'direct',
                root: 'data',
                idProperty: 'ProductId'
            }
        });

        Ext.define('Test.modeltests.ModelWithoutStore', {
           extend: 'Ext.data.Model',

            fields: [
                {name: 'Id', type: 'Integer'},
                {name: 'Test', type: 'string'}
            ]
        });

        me.createTestModelInstance = function () {
            if (!instance) instance = Ext.create('Test.modeltests.TestModel');
            return instance;
        };

        me.getTestModel = function () {
            return Ext.ModelManager.getModel('Test.modeltests.TestModel');
        };*/

        it('a test model should be created', function () {
           expect(window).toBeDefined();
        });
/*
        it('a test model should be created', function () {
           expect(me.createTestModelInstance()).toBeDefined();
        });

        it('test model should have a Test field', function () {
            expect(me.createTestModelInstance().data.Test).toBeDefined();
        });

        it('test model should have a proxy', function () {
            var model = me.createTestModelInstance();
            expect(model.getProxy()).toBeDefined();

            model = me.getTestModel();
            expect(model.getProxy()).toBeDefined();
        });

        it('test model can be loaded using a direct proxy', function () {
            var record, model = me.getTestModel();

            model.load('123456', {
                callback: function (result) {
                    record = result;
                }
            });

            waitsFor(function () {
                return record ? true: false;
            }, 'waiting for Product.GetProduct', waitingTime);
        });

        it('testing the model with a store', function () {
            var result,
                store = Ext.create('Ext.data.DirectStore', {
                model: 'Test.modeltests.TestModel'
            });

            store.setProxy(me.getTestModel().getProxy());

            // Note, do not pass a selection string like in model.load!!
            store.load({
                callback: function (record) {
                    result = record;
                }
            });

            waitsFor(function () {
                return result ? true: false;
            }, 'waiting for loading of store', waitingTime)
        });*/
    }
});
Ext.define('GenPres.test.extjs.StoreTests', {

    describe: 'Ext.data.Store',

    tests: function () {
        var me = this, waitingTime = 200, modelName = 'Test.storetests.TestModel',
            isCalledBack = false;

        // Set up test fixture
        Ext.define(modelName, {
            extend: 'Ext.data.Model',

            fields: [
                {name: 'id', type: 'integer', mapping: 'ProductId'},
                {name: 'Test', type: 'string', mapping: 'ProductName'}
            ],

            // I can mover proxy and reader over to store and it keeps working
            // however I cannot alter the config of proxy and/or reader??
            proxy: {
                type: 'direct',
                paramsAsHash: true,
                // If I omit the below line, store test throws an error, but not model tests
                directFn: Product.GetProduct,
                api: {
                    read: Product.GetProduct,
                    submit: Product.SaveProduct
                }
            },
            reader: {
                type: 'direct',
                root: 'data',
                idProperty: 'ProductId'
            }
        });

        Ext.define('Test.storetests.TestStore', {
            extend:  Ext.data.Store ,
            storeId: 'teststore',
            model: modelName,

            autoLoad: false
        });

        me.createTestStore = function () {
            return Ext.create('Test.storetests.TestStore');
        };

        it('a test model is defined', function () {
            expect(Ext.ModelManager.getModel(modelName)).toBeDefined();
        });

        it('teststore is created', function () {
            expect(me.createTestStore()).toBeDefined();
        });

        it('teststore can be loaded', function () {
            //noinspection JSUnusedLocalSymbols
            me.createTestStore().load({
                callback: function (records, operation, success) {
                    isCalledBack = true;
                }
            });

            waitsFor(function () {
                return isCalledBack;
            }, 'waiting for loading of teststore', waitingTime)

        });
    }
});

Ext.define('GenPres.test.model.LoginModelTests', {

    describe: 'GenPres.model.user.Login',

    tests: function () {
        var getLoginModel, model, createLoginModel, setValidationRules, applyValidationRules;

        createLoginModel = function () {
            return Ext.create('GenPres.model.user.Login');
        }

        getLoginModel = function () {
            if (!Ext.ModelManager.getModel('GenPres.model.user.Login')) {
                createLoginModel();
            }
            return Ext.ModelManager.getModel('GenPres.model.user.Login');
        }


        it('UserLoginModel should be registered', function () {
            expect(getLoginModel()).toBeDefined();
        });

    /*  ToDo: Does not pass, returns: this.persistanceProperty is undefined in Ext 26557
        it('After load an instance of LoginModel should be created', function () {
            getLoginModel().load('', {
                callback: function (result) {
                    model = result || {};
                }
            });

            waitsFor(function () {
                return model;
            }, 'creation of LoginModel by loading', 1000);
        });
    */

        it('LoginModel should be instantiated by Ext.create', function () {
            model = createLoginModel();

            expect(model).toBeDefined();
            model = null;
        });


    /*  ToDo: Does not pass, returns: this.persistanceProperty is undefined in Ext 26557
        it('An empty instance of LoginModel should be invalid', function () {
            model = createLoginModel();

            if (model.validations.length === 0) setValidationRules(model);
            model.validate();

            expect(model.isValid()).toBe(false);

            model.validations = null;
            model = null;
        });
    */

    /*  ToDo: Does not pass, returns: this.persistanceProperty is undefined in Ext 26557
        it('After login attempt LoginModel should be returned with validation rules', function () {
            getLoginModel().load('', {
                callback: function (result) {
                    model = result || {};
                }
            })

            waitsFor(function () {
                var isRule = false;
                if (model) {
                    model.validationRules().each(function (rule) {
                        console.log(rule);
                        isRule = true;
                    })
                }

                return isRule;
            }, 'Validation rules', 1000);
        });
    */



    /*  ToDo: Does not pass, returns: this.persistanceProperty is undefined in Ext 26557
        it('After login attempt LoginModel should be updated with server side supplied validations', function () {
            model = null;
            getLoginModel().load('', {
                callback: function (result) {
                    model = result;
                    model.validations = [];
                    applyValidationRules(model);
                }
            });

            waitsFor(function () {
                if (model) {
                    if (model.validations) {
                        if (model.validations.length === 2) return true;
                    }
                }
                return false;
            }, 'waiting for server supplied values', 1000);

        });
    */

    }
});
Ext.define('GenPres.test.store.ProductSubstanceStoreTests', {

    describe: 'GenPres.store.product.ProductSubstance',

    tests: function () {
        var createProductSubstanceStore, getProductSubstanceStore;

        createProductSubstanceStore = function () {
            return Ext.create('GenPres.store.product.ProductSubstance');
        };

        getProductSubstanceStore = function () {
            return Ext.getStore('productsubstancestore');
        };

        it('GenPres.store.product.ProductSubstanceStore should be created', function () {
            expect(createProductSubstanceStore()).toBeDefined();
        });

        it('GenPres.store.product.ProductSubstanceStore should be defined', function () {
            expect(getProductSubstanceStore()).toBeDefined();
        });

    }
});
Ext.define('GenPres.test.store.SubstanceUnit', {

    describe: 'GenPres.store.prescription.SubstanceUnit',

    tests: function () {
        var me = this;

        me.createSubstanceUnitStore = function () {
            return Ext.create('GenPres.store.prescription.SubstanceUnit');
        };

        me.getSubstanceUnitStore = function () {
            return Ext.getStore('substanceunit');
        };

        it('GenPres.store.prescription.SubstanceUnit can be created', function () {
            expect(me.createSubstanceUnitStore()).toBeDefined();
        });

        it('substanceunit alias can be called', function () {
            expect(me.getSubstanceUnitStore()).toBeDefined();
        });

        it('GenPres.store.prescription.SubstanceUnit contains extraparam generic', function () {
            expect(me.getSubstanceUnitStore().proxy.extraParams.generic).toBeDefined();
        });
        it('GenPres.store.prescription.SubstanceUnit contains extraparam route', function () {
            expect(me.getSubstanceUnitStore().proxy.extraParams.route).toBeDefined();
        });
        it('GenPres.store.prescription.SubstanceUnit contains extraparam shape', function () {
            expect(me.getSubstanceUnitStore().proxy.extraParams.shape).toBeDefined();
        });
        
    }
});
Ext.define('GenPres.test.usecase.AdvancedLoginTest', {
    describe: 'Advanced login tests that:',

    tests: function () {
        var me = this,
            queryHelper = Ext.create('GenPres.lib.util.QueryHelper'),
            messageChecker = Ext.create('GenPres.lib.util.MessageChecker'),
            databaseName = 'TestDatabase',
            machine = 'development-p',
            windowName = 'window[title=Registreer Database]',
            genpresconnection = 'Data Source=localhost;Initial Catalog=GenPres;User ID=sa;Password=838839713',
            pdmsconnection = 'Data Source=localhost;Initial Catalog=MVTest;User ID=sa;Password=838839713',
            genformwebservice = 'http://localhost/GenForm/Products.asmx',
            message = '',
            waitingTime = 500;

        me.getAdvancedLogin = function () {
            return Ext.ComponentQuery.query('userlogin fieldset')[0];
        };

        me.toggleAdvancedLogin = function () {
            me.getAdvancedLogin().toggle();
        };

        me.getSelectDatabaseCombo = function () {
            return queryHelper.getFormComboBox('userlogin', 'database');
        };

        me.clickNewDatabase = function () {
            queryHelper.clickButton(queryHelper.getButton('window', 'Registreer Database'));
        };

        me.getRegisterDatabaseWindow = function () {
            return queryHelper.getWindow('window[title=Registreer Database]');
        };

        me.getDatabaseNameField = function () {
            return queryHelper.getFormTextField(windowName, 'databasename');
        };

        me.getMachineNameField = function () {
            return queryHelper.getFormTextField(windowName, 'machinename');
        };

        me.getGenPresConnectionField = function () {
            return queryHelper.getFormTextField(windowName, 'genpresconnectionstring');
        };
        
        me.getPdmsConnectionField = function () {
            return queryHelper.getFormTextField(windowName, 'patientdbconnectionstring');
        };

        me.getGenFormWebserviceField = function () {
            return queryHelper.getFormTextField(windowName, 'genformwebservice');
        };

        me.clickRegisterDatabaseButton = function () {
            queryHelper.clickButton(me.getRegisterDatabaseButton());
        };

        me.getRegisterDatabaseButton = function () {
            return queryHelper.getButton('window', 'Opslaan');
        };

        me.checkMessage = function () {
            if (messageChecker.checkMessage(message)) {
                message = "";
                return true;
            } else {
                return false;
            }

        };

        it('The user can select an advanced login option', function () {
            me.toggleAdvancedLogin();
            expect(me.getAdvancedLogin().collapsed).toBeFalsy();
        });

        it('Advance login has a combobox to select a database', function () {
            expect(me.getSelectDatabaseCombo()).toBeDefined();
        });

        it('A default database is selected', function () {
            var database = 'Default Database',
                comboBox = me.getSelectDatabaseCombo();

            expect(comboBox.getValue()).toBe(database);
        });

        it('The user can select a database to login', function () {
            var database = 'TestDatabase Indurain',
                comboBox = me.getSelectDatabaseCombo();
            
            queryHelper.setFormField(comboBox, database);
            expect(comboBox.getValue()).toBe(database);
        });

        it('The user can open up a window to register a new database', function () {
            me.clickNewDatabase();
            expect(me.getRegisterDatabaseWindow()).toBeDefined();
        });

        it('User can enter a database name', function () {
            queryHelper.setFormField(me.getDatabaseNameField(), databaseName);
            expect(me.getDatabaseNameField().value).toBe(databaseName);
        });

        it('User can enter the machine name', function () {
            queryHelper.setFormField(me.getMachineNameField(), machine);
            expect(me.getMachineNameField().value).toBe(machine);
        });

        it('User can enter a GenPres Connectionstring', function () {
            queryHelper.setFormField(me.getGenPresConnectionField(), genpresconnection);
            expect(me.getGenPresConnectionField().value).toBe(genpresconnection);
        });

        it('User can enter a PDMS Connectionstring', function () {
            queryHelper.setFormField(me.getPdmsConnectionField(), pdmsconnection);
            expect(me.getPdmsConnectionField().value).toBe(pdmsconnection);
        });

        it('User can enter a GenForm Webservice', function () {
            queryHelper.setFormField(me.getGenFormWebserviceField(), genformwebservice);
            expect(me.getGenFormWebserviceField().value).toBe(genformwebservice);
        });
        
        it('A database can be registered', function () {
            message = databaseName;
            me.clickRegisterDatabaseButton();

            waitsFor(me.checkMessage, 'response of save', waitingTime);
        });
    }
});



Ext.define('GenPres.test.usecase.DrugCompositionTest', {
    describe: 'DrugComposition tests that',

    tests: function () {
        var me = this;
        me.getDrugCompositionController = function () {
            return GenPres.application.getController('prescription.DrugComposition');
        };

        me.getPrescriptionController = function () {
            return GenPres.application.getController('prescription.PrescriptionController');
        };
        me.getComboBox = function(action){
            return  Ext.ComponentQuery.query('combobox[action='+action+']')[0];
        }
        it('There should be a prescription controller', function () {
            expect(me.getPrescriptionController()).toBeDefined();
        });

        it('There should be a drug composition controller', function () {
            expect(me.getDrugCompositionController()).toBeDefined();
        });

        it('There should be a generic combobox', function () {
            expect(me.getComboBox('generic').inputEl.dom).toBeDefined();
        });

        it('There should be a route combobox', function () {
            expect(me.getComboBox('route').inputEl.dom).toBeDefined();
        });


        me.comboIsSet = function(component, globalvarname){
            if(component.store.getCount() > 0 && !component.store.loading){
                component.select(component.store.getAt(0).data.Value);
                globalvars[globalvarname] = (component.getValue() != "");
            }
        }

        it('There should be a shape combobox', function () {
            expect(me.getComboBox('shape').inputEl.dom).toBeDefined();
        });
        
        it('A generic can be set', function () {
            var component = me.getComboBox('generic');
            globalvars["checkGenericSet"]=false;
            waitsFor(createBindFunction(me.comboIsSet, me, [component, "checkGenericSet"], "checkGenericSet", 200), 'waiting for generic to be selected', 3000);
        });

        it('A route can be set', function () {
            var component = me.getComboBox('route');
            globalvars["checkRouteSet"]=false;
            waitsFor(createBindFunction(me.comboIsSet, me, [component, "checkRouteSet"], "checkRouteSet", 200), 'waiting for route to be selected', 3000);
        });

        it('A shape can be set', function () {
            component = me.getComboBox('shape');
            globalvars["checkShapeSet"]=false;
            waitsFor(createBindFunction(me.comboIsSet, me, [component, "checkShapeSet"], "checkShapeSet", 500), 'waiting for shape to be selected', 3000);
        });
        
        //prescriptionTest = Ext.create('GenPres.test.usecase.PrescriptionTest');
        //describe(prescriptionTest.describe, prescriptionTest.tests);
        //jasmine.getEnv().execute();
    }
});
Ext.define('GenPres.test.usecase.LoginTest', {
    describe: 'Login tests that',

    tests: function () {
        var me = this,
            loginMessage = "",
            refusalMessage = "Login geweigerd",
            successMessage = "Login succesvol",
            errorMessage = "GenPres 2011 Login Error",
            waitingTime = 5000;

        me.getLoginController = function () {
            return GenPres.application.getController('login.Login');
        };

        me.getLoginWindow = function () {
            return Ext.ComponentQuery.query('window[title="GenPres Login"]')[0];
        };

        me.getLoginButton = function () {
            return Ext.ComponentQuery.query('toolbar button[action=login]')[0];
        };

        me.getFormField = function (fieldname) {
            return Ext.ComponentQuery.query('textfield[name=' + fieldname + ']')[0];
        };

        me.getPatientInfoView = function (fieldname) {
            return Ext.ComponentQuery.query('dataview[name=' + fieldname + ']')[0];
        };

        me.setFormField = function (textfield, value) {
            textfield.inputEl.dom.value = value;
            textfield.value = value;
            return true;
        };

        me.clickButton = function (button) {
            button.btnEl.dom.click();
        };

        me.checkLoginMessage = function () {
            var results = Ext.ComponentQuery.query('messagebox');
            if (results.length > 0)
            {

                if (results[0].cfg) {
                    if (results[0].cfg.msg === loginMessage || results[0].cfg.title == loginMessage)
                    {
                        Ext.ComponentQuery.query('button[text=OK]')[0].btnEl.dom.click();
                        return true;
                    }
                }
            }
            return false;
        };


        it('There should be a login controller', function () {
            expect(me.getLoginController()).toBeDefined();
        });

        it('The user should see a login window at start up with title GenPres Login', function () {
            var window = me.getLoginWindow();
            expect(window).toBeDefined();
        });

        it('This window should not be closable', function () {
            var window = me.getLoginWindow();
            expect(window.closable === false).toBeTruthy();
        });

        it('User must select a username, password and department', function () {
            var button = me.getLoginButton();
            loginMessage = errorMessage;
            waitsFor(me.checkLoginMessage, 'waiting for an error message', waitingTime);
            me.clickButton(button);
        });

        it('User can set username and password', function () {
            var userField = me.getFormField('username'),
                passwField = me.getFormField('password');

            me.setFormField(userField, "Invalid");
            me.setFormField(passwField, "Invalid");

            expect(userField.value).toBe("Invalid");
            expect(passwField.value).toBe("Invalid");
        });

        it('User can select a departement', function () {
            var departmentDataView = me.getPatientInfoView('loginLogicalUnitSelector');
            waitsFor(function () {
                if(departmentDataView.store.getCount()>0){
                    departmentDataView.el.dom.childNodes[0].childNodes[0].click();
                    return departmentDataView.selModel.getSelection().length == 1;
                }
                return false;
            }, 'logicalUnitSelector to be rendered', 2000);
        });

        it('If Username or password is invalid, user still cannot login', function () {
            var button = me.getLoginButton();

            me.clickButton(button);
            loginMessage = refusalMessage;
            waitsFor(me.checkLoginMessage, 'waiting for refusal message', waitingTime)
        });

        it('User can login using a valid name and password', function () {
            var button = me.getLoginButton(),
                userField = me.getFormField('username'),
                passwField = me.getFormField('password');

            me.setFormField(userField, "peter");
            me.setFormField(passwField, "test");
			
			var controller = me.getLoginController();
			
			spyOn(controller, 'processAuthentication').andCallThrough();
			
            me.clickButton(button);
			
            waitsFor(function(){
				var results = Ext.ComponentQuery.query('patientlist');
				if (results.length > 0)
				{
					expect(controller.processAuthentication).toHaveBeenCalledWith(true);
					return true;
				}
				return false;
			}, "waiting for successfull login", waitingTime);
			
        });
    }
});
Ext.define('GenPres.test.usecase.PrescriptionPatientTest', {
    describe: 'Prescription tests that',

    tests: function () {
        var me = this;

        me.getGridCount = function(){
            return me.getGrid().store.getCount();
        }

        me.getGrid = function(){
            var prescriptiongrid = GenPres.application.MainCenter.query('prescriptiongrid')[0];
            return prescriptiongrid;
        }
        me.getPatientComponent = function(name){
            var prescriptiongpatientview = GenPres.application.MainCenter.query('prescriptionpatient')[0];
            var patientcomp = prescriptiongpatientview.down('unitvaluefield[name='+name+']');
            return patientcomp;
        }
        me.checkGridCount = function(oldCount){
            if(me.getGridCount() == oldCount + 1){
                globalvars["checkGridCount"]=true;
            }
        }
        it('Patient weight can be set', function () {
            var prController = GenPres.application.getController('patient.Patient');
            prController.setPatientWeight(10000, 'gram');
            var weightComponent = me.getPatientComponent('patientWeight');
            expect(weightComponent.getValue().value).toBe(10000);
            expect(weightComponent.getValue().unit).toBe("gram");
        });
        it('Patient length can be set', function () {
            var prController = GenPres.application.getController('patient.Patient');
            prController.setPatientLength(120, 'cm');
            var weightComponent = me.getPatientComponent('patientHeight');
            expect(weightComponent.getValue().value).toBe(120);
            expect(weightComponent.getValue().unit).toBe("cm");
        });
    }
});
Ext.define('GenPres.test.usecase.PrescriptionTest', {
    describe: 'Prescription tests that',

    tests: function () {
        var me = this;

        me.getGridCount = function(){
            return me.getGrid().store.getCount();
        }

        me.getGrid = function(){
            var prescriptiongrid = GenPres.application.MainCenter.query('prescriptiongrid')[0];
            return prescriptiongrid;
        }

        me.checkGridCount = function(oldCount){
            if(me.getGridCount() == oldCount + 1){
                globalvars["checkGridCount"]=true;
            }
        }

        me.checkPrescriptionIsSet = function(){
            var prController = GenPres.application.getController('prescription.PrescriptionController');
            var values = prController.getValues();
            if(values.generic !="" && values.route != "" && values.shape != ""){
                globalvars["checkPrescriptionIsSet"]=true;
            }
        }

        me.checkPrescriptionIsClear = function(){
            var prController = GenPres.application.getController('prescription.PrescriptionController');
            var values = prController.getValues();
            
            if(values.generic =="" && values.route == "" && values.shape == ""){
                globalvars["checkPrescriptionIsClear"]=true;
            }
        }
        /*
        it('A prescription can be saved', function () {
            var currentCount = me.getGridCount();
            var savebutton =  Ext.ComponentQuery.query("button[action=save]")[0];
            savebutton.getActionEl().dom.click();
            globalvars["checkGridCount"]=false;
            waitsFor(createBindFunction(me.checkGridCount, me, [currentCount], "checkGridCount", 200), "grid to have a new prescription", 3000);
        });

        it('A prescription can be cleared', function () {
            var grid = me.getGrid();
            var newbutton =  Ext.ComponentQuery.query("button[action=new]")[0];
            newbutton.getActionEl().dom.click();
            globalvars["checkPrescriptionIsClear"]=false;
            waitsFor(createBindFunction(me.checkPrescriptionIsClear, me, [], "checkPrescriptionIsClear", 200), "prescription to be cleared", 3000);
        });
*/
        /*
        it('The grid nodes count is the same as the store count', function () {
            var grid = me.getGrid();
            var count = me.getGridCount();
            var nodes = Ext.DomQuery.select(".x-grid-row", grid.el.dom);
            expect(count == nodex.length).toBeTruthy();
        });
        
        it('A prescription can be opened from the grid', function () {
            var grid = me.getGrid();
            var nodes = Ext.DomQuery.select(".x-grid-row", grid.el.dom);
            nodes[nodes.length - 1].click();
            globalvars["checkPrescriptionIsSet"]=false;
            waitsFor(createBindFunction(me.checkPrescriptionIsSet, me, [], "checkPrescriptionIsSet", 200), "prescription to be opened", 3000);
        });
        */

        it('After a patient selection a prescription is cleared', function () {
            

        });
        
    }
});
Ext.define('GenPres.test.usecase.SelectPatientTest', {
    describe: 'Select Patient tests that',

    tests: function () {
        var me = this,
        treeClicked = false;

        me.getPatientController = function () {
            return GenPres.application.getController('patient.Patient');
        };

        me.getTreeComp = function () {
            return Ext.ComponentQuery.query('treepanel')[0];
        };

        me.getPatientInfoView = function () {
            return Ext.ComponentQuery.query('patientinfo')[0];
        };

        me.checkDataViewHasItems = function (){
            var el = me.getFirstNodeEl();
            if(me.getPatientInfoView().store.data.items.length == 1){
                return true;
            }
            return false;
        };

        me.getFirstNodeEl = function () {
            treeComp = me.getTreeComp();
            if(typeof(treeComp.el.dom) != "undefined"){
                var el = Ext.DomQuery.select('.x-grid-cell', treeComp.el.dom)[1];
                if(typeof(el) != "undefined"){
                    if(treeClicked == false){
                        Ext.Function.defer(function(){
                            el.click();
                            treeClicked=true;
                        }, 500);
                    }
                }
            } 
        };

        it('There should be a patient controller', function () {
            expect(me.getPatientController()).toBeDefined();
        });

        it('User can select a patient and a dataview is loaded with the patient', function () {
            waitsFor(me.checkDataViewHasItems, 'waiting for patient to be selected', 3000);
        });
    }
});

Ext.define('GenPres.test.util.ASyncEventManagerTest', {

    describe: 'GenPres.lib.util.ASyncEventManagerTest',

    tests: function() {

        var ASyncEventManager;
        var func = function(data){
            console.log("result=" + data);
        };
        var _store;

        var getStore = function(){
            if(typeof(_store) == "undefined"){
                _store = Ext.create('Ext.data.Store', {
                    autoLoad:false,
                    fields: [
                        { name: 'test', type: 'string' }
                    ],
                    proxy : {
                        type:'direct',
                        directFn : Tests.GetTestStoreData,
                        extraParams:{
                            contents: "qq"
                        },
                        paramOrder : ['contents']
                    }
                });
            }
            return _store;
        }

        Ext.require('GenPres.lib.util.ASyncEventManager');

        it('ASyncEventManager be initialized', function () {
            waitsFor(function() {
			    return typeof(GenPres.lib.util) != "undefined";
		    }, "waiting for loading ASyncEventMan.", 200);

		    runs(function() {
			    ASyncEventManager = GenPres.lib.util.ASyncEventManager;
                expect(ASyncEventManager).toBeDefined();
            });
        });

        it('ASyncEventManager can registor store event', function () {
            getStore().proxy.extraParams['contents'] = "qq2";
            getStore().on("load", function(store,items){
                console.log(getStore().data.items[0].data);
            });
            ASyncEventManager.registerEventListener(getStore(),"load",[]);
            expect(ASyncEventManager.queue.length == 1).toBeTruthy();
            expect(ASyncEventManager.queue[0].length == 1).toBeTruthy();
            ASyncEventManager.execute();

            var q = function(){
                
                ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 1",func]);
                ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 2",func]);
                ASyncEventManager.execute();
            };

            var d = Ext.Function.defer(q, 5000);
        });
/*
        it('ASyncEventManager can register async events1', function () {
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 1",func]);
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 2",func]);
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 3",func]);
            ASyncEventManager.execute();
        });

        it('ASyncEventManager can execute sync after async events2', function () {
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 4", func]);
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 5",func]);
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list1 6",func]);
            ASyncEventManager.execute();
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list2 1",func]);
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list2 2",func]);
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list2 3",func]);
            ASyncEventManager.execute();

            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list3 1",func]);
            ASyncEventManager.registerDirectEvent(Tests.GetTestData, ["list3 2",func]);
            ASyncEventManager.execute();


        });*/
        
    }
});
Ext.define('GenPres.test.util.Query', {

    singleton: true,

    getParentViewQuery: function(parentView){
        if(typeof(parentView) == "undefined"){
            return Ext.ComponentQuery;
        }
        return parentView;
    },

    GetControl : function(name, parentView){
        var result = this.getParentViewQuery(parentView).query('panel[name='+name+']');
        if(result.length == 0){
            result = this.getParentViewQuery().query('field[name='+name+']');
        }
        return result[0];
    },
    SelectFirstComboboxValue : function(name, parentView){
        var combo = this.getParentViewQuery(parentView).query('combobox[name='+name+']')[0];
        combo.select(combo.store.getAt(0).data.Value);
    },
    controlStoreIsLoaded : function(control){
        if(!this.isDefined(control)) return false;
        if(!this.isDefined(control.store)) return false;
        return control.store.getCount() > 0;
    },
    isDefined : function(name){
        return typeof(name) != "undefined";
    }


})
Ext.define('GenPres.test.view.DatabaseRegistrationWindowTests', {
    describe: 'DatabaseRegistrationWindowShould',

    tests: function () {
        var me = this, databaseregistrationWindow = Ext.create('GenPres.view.database.RegisterDatabaseWindow');

        me.getDatabaseNameField = function () {
            return databaseregistrationWindow.getDatabaseNameField();
        };

        me.setDatbaseNameField = function (name) {
            me.getDatabaseNameField().value = name;
        };

        me.getMachineNameField = function () {
            return databaseregistrationWindow.getMachineNameField();
        };

        me.setMachineNameField = function (name) {
            me.getMachineNameField().value = name;
        };

        me.getGenPresConnectionStringField = function () {
            return databaseregistrationWindow.getGenPresConnectionStringField();
        };

        me.getPdmsConnectionStringField = function () {
            return databaseregistrationWindow.getPDMSConnectionStringField();
        };
        
        me.getGenFormField = function () {
            return databaseregistrationWindow.getGenFormWebserviceField();
        };

        me.setGenPresConnectionStringField = function (genpresConn) {
            me.getGenPresConnectionStringField().value = genpresConn;
        };

        me.setPdmsConnectionStringField = function (pdmsConn) {
            me.getPdmsConnectionStringField().value = pdmsConn;
        };

        me.setGenFormField = function (genFormWS) {
            me.getGenFormField().value = genFormWS;
        };

        it('Be defined', function () {
            expect(databaseregistrationWindow).toBeDefined();
        });

        it('Have a field for the database name', function () {
            expect(databaseregistrationWindow.getDatabaseName).toBeDefined();
        });
        
        it('Have a field for the machine name', function () {
            expect(databaseregistrationWindow.getMachineName).toBeDefined();
        });

        it('Have a field for the GenPres connection string', function () {
            expect(databaseregistrationWindow.getGenPresConnectionString).toBeDefined();
        });

        it('Have a field for the PDMS connection string', function () {
            expect(databaseregistrationWindow.getPDMSConnectionString).toBeDefined();
        });
        
        it('Have a field for the GenForm webservice', function () {
            expect(databaseregistrationWindow.getGenFormWebservice).toBeDefined();
        });

        it('Be able to set the database name field', function () {
            me.setDatbaseNameField('test');
            expect(me.getDatabaseNameField().value).toBe('test');
        });

        it('Be able to set the machine name field', function () {
            me.setMachineNameField('test');
            expect(me.getMachineNameField().value).toBe('test');
        });

        it('Be able to set the genpres connection string field', function () {
            me.setGenPresConnectionStringField('test1');
            expect(me.getGenPresConnectionStringField().value).toBe('test1');
        });

        it('Be able to set the pdms connection string field', function () {
            me.setPdmsConnectionStringField('test1');
            expect(me.getPdmsConnectionStringField().value).toBe('test1');
        });

        it('Be able to set the GenFormWebservice field', function () {
            me.setGenFormField('test1');
            expect(me.getGenFormField().value).toBe('test1');
        });
    }

});
Ext.define('GenPres.test.view.DrugCompositionTest', {

    describe: 'GenPres.view.Prescription.DrugComposition',

    tests: function () {
        var me = this, instance, win, queryUtil = GenPres.test.util.Query;

        me.getPrescriptionView = function (config) {
            if (!instance) {
                instance = Ext.create('GenPres.view.prescription.DrugComposition', config)
            }
            return instance;
        };

        me.createFormWindow = function(){
            win = Ext.create('Ext.Window', {
                items:me.getPrescriptionView(),
                height:500,
                width:1000
            });
            win.show();
            return win;
        }

        me.getSelect = function(name){
            return Ext.ComponentQuery.query('window combobox[action='+name+']')[0];
        }

        me.getUnitValueField = function(name){
            return Ext.ComponentQuery.query('window unitvaluefield[name='+name+']')[0];
        }

        me.hasSaveCancelToolbar = function (window) {
            return Ext.ComponentQuery.query('window[title=' + window.title + '] toolbar')[0];
        };

        it('can be created', function () {
            expect(me.getPrescriptionView()).toBeDefined();
        });

        it('can be rendered', function () {
            expect(me.createFormWindow()).toBeDefined();
        });

        it('contains a generic field', function () {
            expect(me.getSelect("generic")).toBeDefined();
        });

        it('contains a route field', function () {
            expect(me.getSelect("route")).toBeDefined();
        });

        it('contains a shape field', function () {
            expect(me.getSelect("shape")).toBeDefined();
        });

        it('contains a substance quantity field', function () {
            expect(me.getUnitValueField("substanceQuantity")).toBeDefined();
        });

        it('Substance quantity field has a unit combobox', function () {
            expect(me.getUnitValueField("substanceQuantity").getUnitCombo()).toBeDefined();
        });

        it('When nothing is chosen drugIsChosen returns false ', function () {
            var drugCompController = GenPres.application.getController('prescription.DrugComposition')
            expect(!drugCompController.drugIsChosen()).toBeTruthy();
        });

        it('when generic, route and shape is chosen drugIsChosen returns true', function () {
            waitsFor(function () {

                var genericCombo = queryUtil.GetControl('drugGeneric');
                var routeCombo = queryUtil.GetControl('drugRoute');
                var shapeCombo = queryUtil.GetControl('drugShape');

                if(queryUtil.controlStoreIsLoaded(shapeCombo)){
                    var substanceQuantity = queryUtil.GetControl('substanceQuantity', me.getPrescriptionView());
                    queryUtil.SelectFirstComboboxValue('drugGeneric');
                    queryUtil.SelectFirstComboboxValue('drugRoute');
                    queryUtil.SelectFirstComboboxValue('drugShape');

                    var drugCompController = GenPres.application.getController('prescription.DrugComposition')
                    return (drugCompController.drugIsChosen());
                }
                return false;
            }, 'comboboxes to be rendered', 2000);
        });

        it('View can be destroyed', function () {
            me.getPrescriptionView().destroy();
            expect(me.getPrescriptionView().isDestroyed).toBeTruthy();
            win.close();
        });
    }
});
Ext.define('GenPres.test.view.PrescriptionFormTest', {

    describe: 'GenPres.view.Prescription.PrescriptionForm',

    tests: function () {
        var me = this, instance, win;

        me.getPrescriptionView = function (config) {
            if (!instance) {
                instance = Ext.create('GenPres.view.prescription.PrescriptionForm', config)
            }
            return instance;
        };

        me.createFormWindow = function(){
            win = Ext.create('Ext.Window', {
                items:me.getPrescriptionView(),
                height:520,
                width:900
            });
            win.show();
            return win;
        };

        it('can be created', function () {
            expect(me.getPrescriptionView()).toBeDefined();
        });
        
        it('can be rendered', function () {
            expect(me.createFormWindow()).toBeDefined();
        });

        it('contains a drugcomposition view', function () {
            var form = Ext.ComponentQuery.query('window prescriptionform')[0];
            var drugCompositionView = form.query("drugcomposition")[0];
            expect(drugCompositionView).toBeDefined();
        });

        it('View can be destroyed', function () {
            //me.getPrescriptionView().destroy();
            //expect(me.getPrescriptionView().isDestroyed).toBeTruthy();
            //win.close();
        });
    }
});
Ext.define('GenPres.test.view.PrescriptionPatientTest', {

    describe: 'GenPres.view.Prescription.Patient',

    tests: function () {
        var me = this, instance, win;

        me.getPrescriptionPatientView = function (config) {
            if (!instance) {
                instance = Ext.create('GenPres.view.prescription.Patient', config)
            }
            return instance;
        };

        me.createWindow = function(){
            win = Ext.create('Ext.Window', {
                items:me.getPrescriptionPatientView(),
                height:520,
                width:900
            });
            win.show();
            return win;
        };

        it('can be created', function () {
            expect(me.getPrescriptionPatientView()).toBeDefined();
        });

        it('can be rendered', function () {
            expect(me.createWindow()).toBeDefined();
        });

        it('contains a weight component', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientWeight]")[0]
            expect(component).toBeDefined();
        });

        it('contains a height component', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientHeight]")[0]
            expect(component).toBeDefined();
        });

        it('contains a bsa component', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientBSA]")[0]
            expect(component).toBeDefined();
        });

        it('patient weight should have unit kg', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientWeight]")[0]
            expect(component.getValue().unit).toBe("kg");
        });

        it('patient weight should be 0', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientWeight]")[0]
            expect(component.getValue().value).toBe(0);
        });

        it('patient height should have unit cm', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientHeight]")[0]
            expect(component.getValue().unit).toBe("cm");
        });

        it('patient height should be 0', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientHeight]")[0]
            expect(component.getValue().value).toBe(0);
        });

        it('patient BSA should have unit m2', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientBSA]")[0]
            expect(component.getValue().unit).toBe("m2");
        });

        it('patient BSA should be 0', function () {
            var component = Ext.ComponentQuery.query("window prescriptionpatient unitvaluefield[name=patientBSA]")[0]
            expect(component.getValue().value).toBe(0);
        });
        
        it('View can be destroyed', function () {
            me.getPrescriptionPatientView().destroy();
            expect(me.getPrescriptionPatientView().isDestroyed).toBeTruthy();
            win.close();
        });
    }
});
Ext.define('GenPres.test.view.PrescriptionVisibilityTest', {

    describe: 'GenPres.view.Prescription.PrescriptionVisibility',

    tests: function () {
        var me = this, instance, win, queryUtil = GenPres.test.util.Query;

        GenPres.application.getController("prescription.PrescriptionController").views =[];

        me.getPrescriptionView = function (config) {
            if (!instance) {
                instance = Ext.create('GenPres.view.prescription.PrescriptionForm', config)
            }

            return instance;
        };

        me.createFormWindow = function(){
            win = Ext.create('Ext.Window', {
                items:me.getPrescriptionView(),
                height:520,
                width:900
            });
            win.show();
            return win;
        };

        it('can create a prescription form', function () {
            me.createFormWindow();
            expect(instance).toBeDefined();
        });

        var visibilityItems = ["prescriptionContinuous", "substanceQuantity"];
        for(var i=0;i<visibilityItems.length;i++){
            var visibilitySetHiddenCounter = 0;
            var visibilitySetVisibleCounter = 0;

            it(visibilityItems[i] + ' is default hidden', function () {
                var itemName = visibilityItems[visibilitySetHiddenCounter];
                visibilitySetHiddenCounter++;
                var item = GenPres.test.util.Query.GetControl(itemName, me.getPrescriptionView());
                expect(item.getVisibility()).toBeFalsy();
            });

            it(visibilityItems[i] + ' can be set to visible', function () {
                var itemName = visibilityItems[visibilitySetVisibleCounter];
                visibilitySetVisibleCounter++;
                var item = GenPres.test.util.Query.GetControl(itemName, me.getPrescriptionView());
                item.setVisibility(true);
                expect(item.getVisibility()).toBeTruthy();
            });
        }
/*
        it('when generic, route and shape is selected substance quantity should be visible', function () {

            var genericCombo = queryUtil.GetControl('drugGeneric');
            var routeCombo = queryUtil.GetControl('drugRoute');
            var shapeCombo = queryUtil.GetControl('drugShape');

            genericCombo.store.load();
            routeCombo.store.load();
            shapeCombo.store.load();

            waitsFor(function () {
                if(queryUtil.controlStoreIsLoaded(shapeCombo)){
                    var substanceQuantity = queryUtil.GetControl('substanceQuantity', me.getPrescriptionView());
                    queryUtil.SelectFirstComboboxValue('drugGeneric');
                    queryUtil.SelectFirstComboboxValue('drugRoute');
                    queryUtil.SelectFirstComboboxValue('drugShape');
                    return (!substanceQuantity.isHidden);
                }
                return false;
            }, 'comboboxes to be rendered', 2000);
        });*/
    }
});
Ext.define('GenPres.test.view.SaveCancelWindowTests', {

    describe: 'GenPres.lib.view.window.SaveCancelWindow',

    tests: function () {
        var me = this, instance;

        me.getSaveCancelWindow = function (config) {
            if (!instance) {
                instance = Ext.create('GenPres.lib.view.window.SaveCancelWindow', config)
            }
            return instance;
        };

        me.hasSaveCancelToolbar = function (window) {
            return Ext.ComponentQuery.query('window[title=' + window.title + '] toolbar')[0];
        };

        it('can be created', function () {
            expect(me.getSaveCancelWindow()).toBeDefined();
        });

        it('should extend an Ext.window.Window', function () {
           expect(me.getSaveCancelWindow().superclass.$className).toBe('Ext.window.Window');
        });

        it('should have a savecancel toolbar', function () {
            expect(me.hasSaveCancelToolbar(me.getSaveCancelWindow())).toBeDefined();
        });
    }
});
Ext.define("GenPres.view.Main", {
    extend:  Ext.Component ,
	                                                 
    html: 'Hello, World!!'
});
Ext.define('GenPres.view.login.LogicalUnitSelector', {
    extend:  Ext.view.View ,

    alias: 'widget.logicalunitselector',

    margin:'20 0 0 16',

    itemSelector: 'div.LogicalUnitDataViewItem',

    emptyText: 'No logical units found',

    singleSelect: true,

    autoScroll: true,

    store: Shared.util.StoreManager.GetStore('LogicalUnitDto', Login.GetLogicalUnits, {}, { autoLoad:true, sorters: [{ property: 'Name', direction: 'ASC' }] }),
    
    tpl: new Ext.XTemplate(
            '<tpl for="."><div class="LogicalUnitDataView">',
                '<div class="LogicalUnitDataViewItem">',
                    '{Name}',
                '</div>',
            '</div></tpl>'),

    initComponent : function(){
        var me = this;
        me.callParent();
    }
});
Ext.define('GenPres.view.login.LoginWindow', {
    extend:  Ext.Window ,
    alias: 'widget.userlogin',

    bodyPadding: 5,

    closable: false,

                                      
    
    title: 'GenPres Login',

    defaultDatabase: 'Default Database',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            mixins: {
                process: 'Shared.util.Process'
            }
        });

        me.dockedItems = me.createDockedItems();
        me.items = this.createItems();
        me.callParent(arguments);
    },

    Processes : {
        'Login' : [
            {component:'form', text:'Dit formulier kan gebruikt worden om in te loggen.'},
            {component:'form textfield[name=username]', text:'Vul uw gebruikersnaam in.'},
            {component:'form textfield[name=password]', text:'Vul uw wachtwoord in.'},
            {component:'toolbar button[action=login]', text:'Klik op de login button om de applicatie te starten.'}
        ]
    },

    getLoginButton: function () {
        return Ext.ComponentQuery.query('toolbar button[action=login]');
    },

    createDockedItems: function () {
        return [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['->', { text: 'Login', action: 'login'}]
            }
        ];
    },

    createItems: function () {
        var me = this;
        
        return [
            me.getHtmlImage(),
            me.getLoginForm2()
        ];
    },

    afterRender: function () {
        this.callParent(arguments);
        //Ext.Function.defer(this.doProcess, 500, this, ['Login']);
    },

    getImagePath: function () {
        return "/GenPres/ClientApplications/Styles/GenPres/Images/MedicalBanner.jpg";
    },

    getHtmlImage: function () {
        var me = this, imagePath = me.getImagePath();
        return { html: '<img src=' + imagePath + ' />', height: 180, xtype: 'box' }
    },


    getLoginForm2: function () {
        var me = this;
        //noinspection JSUnusedGlobalSymbols
        return {
            xtype:'form',
            border: false,
            bodyPadding: 15,
            width: 541,
            defaults: {
                allowBlank: false
            },
            items:[
                { xtype: 'textfield', fieldLabel: 'Gebruikersnaam', name:'username', margin: '10 0 10 10', value: 'peter' },
                { xtype: 'textfield', inputType: 'password', fieldLabel: 'Wachtwoord', name: 'password', margin: '0 0 10 10',  value: 'test' },
                Ext.create('GenPres.view.login.LogicalUnitSelector',{name:'loginLogicalUnitSelector'})
            ]
        };
    },

    advancedLoginFieldSet: function () {
        var me = this;
        return {
            xtype: 'fieldset',
            layout: 'hbox',
            collapsible: true,
            collapsed: true,
            margin:'65 0 0 0',
            items: [
                me.createDatabaseCombo(),
                me.createRegisterDatabaseButton()
            ]
        };
    },

    createDatabaseCombo: function () {
        var me = this;
        return {xtype: 'combo', name: 'database', fieldLabel: 'Database', displayField: 'DatabaseName', store: me.getDatabaseStore()};
    },

    getDatabaseStore: function () {
        return '';//Ext.create('GenPres.store.database.Database');
    },

    createRegisterDatabaseButton: function () {
        return {xtype: 'button', text: 'Registreer Database', action: 'registerdatabase'};
    }

});
Ext.define('GenPres.view.main.MainView', {

    extend:  Ext.Panel ,

    layout: 'fit',
    
    border:false,

    constructor : function(){
        var me = this;
        me.callParent(arguments);
    },

    initComponent : function(){
        var me = this;
        
        me.items = [
            /*Ext.create('GenPres.view.main.MainViewLeft'),
            Ext.create('GenPres.view.main.MainViewCenter')*/
        ];
        me.callParent();
        
        return me;
    }
});
Ext.define('GenPres.view.main.MainViewCenter', {

    extend:  Ext.Panel ,
    region: 'center',
    xtype: 'panel',

    border:false,

    layout: 'border',

    initComponent : function(){
        var me = this;
        
        me.items = [
            Ext.create('GenPres.view.main.MainViewCenterContainer'),
            Ext.create('GenPres.view.prescription.PrescriptionTabs')
        ];
        GenPres.application.MainCenter = this;
        me.callParent();
    },

    height: 100,
    split: true
})
Ext.define('GenPres.view.main.MainViewCenterContainer', {

    extend:  Ext.Panel ,
    region: 'center',
    xtype: 'panel',

    activeItem: 0,

    border:false,

    layout: 'card',
	
    initComponent : function(){
        var me = this;
		
        me.items = [
            {
                id: 'card-0',
                xtype:'box',
                html:'<br /><br /><h1>&nbsp;&nbsp;&nbsp;Welkom bij GenPres - Development version</h1>',
                border:false
            }
        ];
		
		
        me.dockedItems = Ext.create('GenPres.view.main.TopToolbar');
        GenPres.application.MainCenterContainer = this;
		
		me.callParent();
    },

    height: 100,
    split: false,
    margins: '0 0 0 0'
})
Ext.define('GenPres.view.main.PatientInfo', {

    extend:  Ext.view.View ,

    colspan:4,

    alias : 'widget.patientinfo',

    itemSelector : 'patientInfo',

    tpl: new Ext.XTemplate('<tpl for=".">',
            '<div class="patientIcon"><div class="PatientInfoPid">{PID}</div></div>' +
                '<div class="patientNameInfo">',
                    '<b><span style="font-size:12px;">{LastName}, {FirstName}</span></b><br />',
                    '<div class="patientInfoValue">',
                        '<div class="patientInfoHeader"><b>Afdeling/bed:</b> {Unit} - {Bed}</div><br />',
                        '<div class="patientInfoHeader"><b>Opname: {RegisterDate}</b></div><br />',
                        '<div class="patientInfoHeader"><b>Ligdag: {Days}</b></div>',
                    '</div>',
                '</div>',
            '</tpl>'),

    store : 'patient.PatientInfoStore',

    initComponent : function(){
        var me=this;
        me.callParent();
    }
});


Ext.define('GenPres.view.main.PatientTree', {
    extend:  Ext.view.View ,

    alias: 'widget.patientlist',

    margin: '0 0 0 0',

    itemSelector: 'div.PatientViewItem',

    emptyText: 'No logical units found',

    singleSelect: true,

    autoScroll: true,

    padding:'4 4 4 4',

    store: Shared.util.StoreManager.GetStore('PatientDto', Patient.GetPatientsByLogicalUnit, { logicalUnit: "26240f04-310b-4e1a-be77-7986dea8aff3" }, {autoLoad:false}),

    tpl: new Ext.XTemplate(
            '<tpl for="."><div class="PatientView">',
                '<div class="PatientViewItem">',
                    '{FirstName}&nbsp;{LastName}',
                '</div>',
            '</div></tpl>'),

    initComponent: function () {
        var me = this;
        me.callParent();
        
    }
});

Ext.define('GenPres.view.main.ToolbarButton', {
    extend: Ext.button.Button ,
    text: '',
    scale:'small',
    location: 'ClientApplications/Styles/GenPres/images/TopToolbar/',
    iconAlign:'left',
    disabled: false,
    width:60,
    initComponent:function(){
        var me = this;
        me.icon = me.location + me.icon;
        me.callParent();
    }
});

Ext.define('GenPres.view.main.TopToolbar', {
    extend: Ext.container.ButtonGroup ,
    dock: 'top',

    initComponent : function(){
        var me = this;
        me.items = [
            {
                xtype: 'buttongroup',
                columns: 5,
                title: 'Algemeen',
                items : [
                    Ext.create('GenPres.view.main.ToolbarButton', { icon: 'Home_32.png', text: 'Home', width: 80, action: 'home' }),
                    {xtype: 'tbseparator',height:20},
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'Prescription_32.png', text:'Voorschrijven', width:130}),
                    {xtype: 'tbseparator',height:20},
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'TPN_32.png', text:'TPN', width:70})
                ]
            },
            {xtype: 'tbseparator',height:20},
            {
                xtype: 'buttongroup',
                columns: 3,
                title: 'Opties',
                items : [
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'Template_32.png', text:'Sjablonen', width:100}),
                    {xtype: 'tbseparator',height:20},
                    Ext.create('GenPres.view.main.ToolbarButton', {icon:'NewMedicine_32.png', text:'Nieuw medicament', width:175})
                ]
            },
            {
                xtype: 'buttongroup',
                columns: 1,
                title: 'Patient informatie',
                height:81,
                width:350,
                items : Ext.create('GenPres.view.main.PatientInfo')
            },
            {
                xtype: 'buttongroup',
                columns: 1,
                height: 81,
                html: 'medewerker info',
                width:200,
                title: 'Medewerker'
            }
        ]
        me.callParent();
    }
});


Ext.define('GenPres.view.prescription.PrescriptionGrid', {

    extend: Ext.grid.Panel ,

    border:false,

    alias: 'widget.prescriptiongrid',

/*    store: 'prescription.Prescription',*/

    title:'voorscrhiften',

    columns: [
        {header: 'StartDate',  dataIndex: 'StartDate'},
        {header: 'Generiek',  dataIndex: 'drugGeneric'}
    ],
    
    initComponent : function(){
        var me = this;
        me.callParent();
    }
});

Ext.define('GenPres.view.prescription.PrescriptionTabs', {

    extend:  Ext.tab.Panel ,
    region: 'south',

    border:false,
    
    initComponent : function(){
        var me = this;

        me.items = [
            Ext.create('GenPres.view.prescription.PrescriptionGrid'),
            {
                title: 'Totalen',
                xtype:'box',
                html : 'Under construction'
            },
            {
                title: 'Overzicht',
                xtype:'box',
                html : 'Under construction'
            }
        ];

        me.callParent();
    },

    height: 200,
    split: true
})
