
Ext.define('Management.view.Viewport', {

    extend: 'Ext.Viewport',

    layout: 'fit',
    
    items: [
    {
        margins: '20 20 20 20',
        tbar:
        [
            { html: '<img src="../ClientApplications/Styles/GenPres/images/logo.png" />', xtype: 'box', width:200 },
            {
                text: 'Users',
                scale: 'large',
                handler: Ext.bind(function(a, b, c, d) {
                    
                }, this)
            }, {
                text: 'Logical units',
                scale: 'large'
            }, {
                text: 'Patients',
                scale: 'large'
            }
        ]
    }],
    
    renderTo: Ext.getBody()
});