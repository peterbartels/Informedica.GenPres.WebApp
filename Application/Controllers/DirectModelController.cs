using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Ext.Direct.Mvc;
using Informedica.Service.Presentation;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class DirectModelController : Controller
    {
        [AcceptVerbs("GET")]
        public ActionResult Index()
        {
            var userDto = new Informedica.Service.Presentation.UserDto();

            var types = userDto.GetType().Assembly.GetTypes()
                .Where(t => t.IsClass)
                .ToList();

            var result = new ModelCollection();
            foreach (var type in types)
            {
                var model = new Model() {Name = type.Name};

                foreach (var property in type.GetProperties())
                {
                    model.Properties.Add(new Property(){
                        Name = property.Name,
                        Type = property.PropertyType.Name
                        }
                    );
                }
                result.Models.Add(model);
            }
            
            return JavaScript("Ext.ns(\"Ext.app\");\nExt.app.REMOTE_MODELS = " + new JavaScriptSerializer().Serialize(Json(result.Models, JsonRequestBehavior.AllowGet).Data));
        }

    }

    public class ModelCollection
    {
        public ModelCollection()
        {
            Models = new List<Model>();
        }
        public List<Model> Models { get; set; } 
    }

    public class Model
    {
        public Model() 
        {
            Properties = new List<Property>();
        }

        public string Name;
        public List<Property> Properties { get; set; } 
    }

    public class Property
    {
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
