using System.Web.Mvc;
using Ext.Direct.Mvc;
using Informedica.Service.Presentation;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class PatientController : DirectController
    {
        public IPatientService PatientService { get; set; }

        public PatientController(IPatientService patientService)
        {
            PatientService = patientService;
        }

        public ActionResult GetPatientsByLogicalUnit(string logicalUnitId)
        {
            return Json(PatientService.GetPatientsByLogicalUnitId(logicalUnitId));
        }
    }
}
