using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
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

            string @namespace = "";

            var types = userDto.GetType().Assembly.GetTypes()
                .Where(t => t.IsClass)
                .ToList();

            var result = new ArrayList();
            foreach (var type in types)
            {
                var properties = new ArrayList();

                foreach (var property in type.GetProperties())
                {
                    properties.Add(new {
                        name = property.Name,
                        type = property.PropertyType.Name
                        }
                    );
                }

                result.Add(new
                {
                    name = type.Name,
                    properties = properties 
                });
            }
            
            


            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}
