Ext.define('Management.controller.UserEditingController', {
    extend: 'Ext.app.Controller',

    models:['Management.model.UserModel'],

    refs: [
        {
            ref: 'UserGrid',
            selector: 'grid'
        }
    ],

    init: function() {
        this.control({
            'button[action=new]': {
                click: this.newUser
            },
            'button[text=Delete]': {
                click: this.deleteUser
            },
            'grid': {
                canceledit: this.cancelEdit,
                edit:this.commitRecord
            }
        });
    },
    
    deleteUser:function(){
        var userGrid = this.getUserGrid();
        var record = userGrid.selModel.getSelection()[0];
        
        Management.DeleteUser(record.data, function (result) {
            userGrid.store.reload();
        });
    },

    newUser: function() {
        
        var rowEditing = this.getUserGrid().plugins[0];
        
        rowEditing.cancelEdit();
        
        // Create a model instance
        var r = Ext.create('UserDto', {
            Username: '',
            Password: ''
        });

        this.getUserGrid().store.insert(0, r);
        rowEditing.startEdit(0, 0);
    },
    
    saveUser: function() {
        var store = this.getUserGrid().store;
    },
    
    cancelEdit: function (editor, e, opts) {    
        if (e.record.data.Username == '' || e.record.data.Password == '') {
            e.store.remove(e.record);
        }   
    },
    
    commitRecord: function (editor, e) {
        var userGrid = this.getUserGrid();
        Management.SaveUser(e.record.data, function (result) {
            userGrid.store.reload();
        });
    }
});
