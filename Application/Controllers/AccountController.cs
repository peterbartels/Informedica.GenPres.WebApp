using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using Informedica.GenPres.WebApp.Filters;
using Informedica.GenPres.WebApp.Models;
using Ext.Direct.Mvc;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class AccountController : DirectController
    {
        //
        // GET: /Account/Login
        public ActionResult Login(string returnUrl, string test)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
    }
}
