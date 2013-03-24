using Ext.Direct.Mvc;
using System.Web.Mvc;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class PrescriptionController : DirectController
    {
        public ActionResult GetGenerics()
        {
            return Json(new {success = true});
        }

        public ActionResult GetShapes()
        {
            return Json(new { success = true });
        }

        public ActionResult GetRoutes()
        {
            return Json(new { success = true });
        }

    }
}
