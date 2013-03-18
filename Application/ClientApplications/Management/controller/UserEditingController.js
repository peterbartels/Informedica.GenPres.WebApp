Ext.define('Management.controller.UserEditingController', {
    extend: 'Ext.app.Controller',


    init: function() {
        this.control({
            'button[action=new]': {
                click: this.newUser
            },
            'button[action=cancel]': {
                click: this.closeWindow
            },
            'button[action=edit]': {
                click: this.saveUsers
            },
            'grid': {
                canceledit: this.cancelEdit,
                edit:this.commitRecord
            }
        });
    },
    
    newUser: function() {
        
        var rowEditing = this.getUserGrid().plugins[0];
        
        rowEditing.cancelEdit();

        // Create a model instance
        var r = Ext.create('GenPres.model.UserModel', {
            username: '',
            password: ''
        });

        this.getUserGrid().store.insert(0, r);
        rowEditing.startEdit(0, 0);
        
    },
    
    saveUsers: function() {
        var store = this.getUserGrid().store;
    },
    
    cancelEdit: function (editor, e, opts) {    
        if (e.record.data.username == '' || e.record.data.password == '') {
            e.store.remove(e.record);
        }   
    },
    
    commitRecord: function (editor, e) {
        Management.SaveUser(e.record.data, function(result) {
           // e.store.reload();
        });
    },
    
    showWindow: function(){
        this.window = Ext.create('Ext.window.Window', {
            title: 'Edit User',
            height: 400,
            width: 400,
            layout: 'fit',
            items: Ext.create('GenPres.view.UserForm')
        }).show();
    },
    
    closeWindow:function() {
        this.window.close();
    }
});
