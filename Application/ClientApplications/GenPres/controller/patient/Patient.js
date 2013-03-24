Ext.define('GenPres.controller.patient.Patient', {    extend: 'Ext.app.Controller',

    views: [],

    logicalUnitId: null,

    init: function() {
        this.control({
            'treepanel': {
                beforeitemclick: this.checkRootNode,
                itemclick: this.loadPatientData
            },
            'patientlist': {
                select: this.loadPatientData,
                render: this.loadPatientList,
                itemmouseenter: this.hoverItem,
                itemmouseleave: this.unhoverItem
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