using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class LoginController : DirectController
    {
        public ActionResult Authenticate(string username, string password)
        {
            return Json(new {success = true});
        }

        public ActionResult  GetLogicalUnits()
        {
            var array = new ArrayList();
            array.Add(new
                {
                    id = 1,
                    text = "Department 1"
                });

            array.Add(new 
                {
                    id = 2,
                    text = "Department 2"
                });

            array.Add(new
            {
                id = 3,
                text = "Department 3"
            });

            array.Add(new
            {
                id = 4,
                text = "Department 4"
            });

            array.Add(new
            {
                id = 5,
                text = "Department 5"
            });

            return Json(array);
        }
    }
}
