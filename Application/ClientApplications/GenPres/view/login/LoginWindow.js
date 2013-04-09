Ext.define('GenPres.view.login.LoginWindow', {
    extend: 'Ext.Window',
    alias: 'widget.userlogin',

    bodyPadding: 5,

    closable: false,

    requires: ['Shared.util.Process'],
    
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