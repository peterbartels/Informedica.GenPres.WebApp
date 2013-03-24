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

        public ActionResult GetPatientsByLogicalUnit()
        {
            return Json(PatientService.GetPatientsByLogicalUnitId("0f7eae8d-af5a-4e1d-874c-c1e44d7ab8e9"));
        }
    }
}
