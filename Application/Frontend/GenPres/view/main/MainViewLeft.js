Ext.define('GenPres.view.main.MainViewLeft', {
    extend: 'Ext.Panel',
    layout:'vbox',
    region: 'west',
    xtype: 'panel',
    border:false,
	
	title: 'Patienten',
	
	collapsible:true,

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
            Ext.create('GenPres.view.main.PatientTree', {
                name:'mainPatientTree'
            })	
        ];
		var searchbox = Ext.create('Ext.form.ComboBox', {
			store: Shared.util.StoreManager.GetStore('PatientDto', Patient.GetPatientsByLogicalUnit, { logicalUnit: "26240f04-310b-4e1a-be77-7986dea8aff3" }, {autoLoad:false}),
			queryMode: 'local',
			displayField: 'LastName',
			tpl:'',
			displayTpl:'<tpl for=".">{FirstName} {LastName}</tpl>',
			emptyText:'Zoek patient',
			typeAhead:true,
			renderTo: Ext.getBody(),
			hideLabel: true,
            hideTrigger:true,
            anchor: '100%',
			
			forceSelection:false,
            listConfig: {
                loadingText: '',
                emptyText: '',
				maxHeight:0,
				itemTpl : '',
                getInnerTpl: function() {
                    return '';
                }
            },
			doQuery : function(queryString, forceAll) {
				var me = this;
				this.expand();
				this.store.clearFilter(!forceAll);
				if (!forceAll) {
					me.store.filterBy(function (record) //scope is optional so I dint use it.
					{ 	
						if(me.getRawValue() == "") return true;
						return (
							record.data.FirstName.toLowerCase().startsWith(me.getRawValue().toLowerCase()) || 
							record.data.LastName.toLowerCase().startsWith(me.getRawValue().toLowerCase()) ||
							(record.data.FirstName.toLowerCase() + " " + record.data.LastName.toLowerCase()).startsWith(me.getRawValue().toLowerCase())
						);
					});
				}
			}
		});
		me.dockedItems =  searchbox;
        me.callParent();
		searchbox.focus(true, 10);
		
	}
});