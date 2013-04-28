Ext.define('Management.controller.PatientController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'PatientGrid',
            selector: 'grid'
        }
    ],

    init: function() {
        this.control({
            'patientgrid button[action=new]': {
                click: this.newPatient
            },
            'patientgrid button[text=Delete]': {
                click: this.deletePatient
            },
            'patientgrid': {
                canceledit: this.cancelEdit,
                edit:this.commitRecord
            }
        });
    },
    
    deletePatient: function () {
        var grid = this.getPatientGrid();
        var record = grid.selModel.getSelection()[0];
        
        Management.DeletePatient(record.data, function (result) {
            grid.store.reload();
        });
    },

    newPatient: function () {
        
        var rowEditing = this.getPatientGrid().plugins[0];
        
        rowEditing.cancelEdit();
        
        var r = Ext.create('PatientDto', {
            Name: ''
        });

        this.getPatientGrid().store.insert(0, r);
        rowEditing.startEdit(0, 0);
    },
    
    cancelEdit: function (editor, e, opts) {    
        if (e.record.data.Name == '') {
            e.store.remove(e.record);
        }   
    },
    
    commitRecord: function (editor, e) {
        var patientGrid = this.getPatientGrid();
        Management.SavePatient(e.record.data, function (result) {
            patientGrid.store.reload();
        });
    }
});
