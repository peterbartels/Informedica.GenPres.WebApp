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
    public class LoginController : DirectController
    {
        public ILoginService LoginService { get; set; }

        public LoginController(ILoginService loginService)
        {
            this.LoginService = loginService;
        }
        
        public ActionResult Authenticate(string username, string password)
        {
            return Json(new {success = LoginService.AuthenticateUser(username, password)});
        }

        public ActionResult  GetLogicalUnits()
        {
            return Json(LoginService.GetLogicalUnits());
        }
    }
}
