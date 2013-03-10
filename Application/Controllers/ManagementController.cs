using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class ManagementController : DirectController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetUsers()
        {
            return Json(new ArrayList()
            {
                new
                    {
                        username = "peter",
                        password = "test",
                        id = "test"
                    }
            });
        }

        public ActionResult SaveUser(UserDto user)
        {
            return Json(new {success = user.username});
        }
    }

    public class UserDto
    {
        public string username { get; set; }
        public string password { get; set; }
    }
}
