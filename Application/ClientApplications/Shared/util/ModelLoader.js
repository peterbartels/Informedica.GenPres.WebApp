Ext.define('Shared.util.ModelLoader', {

    singleton: true,

    Load: function (models) {
        for (var i = 0; i < models.length; i++) {
            if (models[i].Properties.length == 0) continue;

            var fields = [];
            for (var f = 0; f < models[i].Properties.length; f++) {
                fields.push({
                    name: models[i].Properties[f].Name,
                    type: models[i].Properties[f].Type.toLowerCase()
                });
            }
            
            Ext.define(models[i].Name, {
                extend: 'Ext.data.Model',
                clientIdProperty:'Id',
                fields: fields
            });
        }
    }
})