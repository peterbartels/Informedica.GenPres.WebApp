using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class PatientController : DirectController
    {
        //
        // GET: /Patient/

        public ActionResult GetPatientsByLogicalUnit(string logicalUnitId)
        {
            return Json(false);
        }
    }
}
