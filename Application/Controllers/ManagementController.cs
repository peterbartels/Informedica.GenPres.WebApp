using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using Informedica.Service.Presentation;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class ManagementController : DirectController
    {
        public IUserManagement UserManagementService { get; set; }

        public ManagementController(IUserManagement userManagement)
        {
            UserManagementService = userManagement;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetUsers()
        {
            return Json(UserManagementService.GetUsers())   ;
        }

        public ActionResult SaveUser(UserDto user)
        {
            UserManagementService.AddUser(user);
            return Json(new {success = user.Username});
        }
    }
}   
