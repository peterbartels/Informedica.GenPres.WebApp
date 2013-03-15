/*
 * File: app/view/Viewport.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('GenPres.view.Viewport', {

    extend: 'Ext.Viewport',

    
    layout: 'fit',
    
    items: [
    {
        margins: '20 20 20 20',
        tbar:
        [
            { html: '<img src="../Client/GenPres/style/images/logo.png" />', height: 180, xtype: 'box' },
            {
                text: 'Users',
                scale: 'large',
                handler: Ext.bind(function(a, b, c, d) {
                    debugger;
                }, this)
            }, {
                text: 'Logical units',
                scale: 'large'
            }, {
                text: 'Patients',
                scale: 'large'
            }
        ],
    }, {    
    }
    ],
    
    renderTo: Ext.getBody()
});