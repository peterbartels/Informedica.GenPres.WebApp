using System.Web.Mvc;
using Ext.Direct.Mvc;
using Informedica.Service.Presentation;

namespace Informedica.GenPres.WebApp.Controllers
{
    public class ManagementController : DirectController
    {
        public IMangementService ManagementService { get; set; }

        public ManagementController(IMangementService management)
        {
            ManagementService = management;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetUsers()
        {
            return Json(ManagementService.GetUsers());
        }

        public ActionResult DeleteUser(UserDto user)
        {
            ManagementService.DeleteUser(user);
            return Json(new { success = true });
        }

        public ActionResult SaveUser(UserDto user)
        {
            ManagementService.AddUser(user);
            return Json(new {success = true});
        }

        public ActionResult GetLogicalUnits()
        {
            return Json(ManagementService.GetLogicalUnits());
        }

        public ActionResult DeleteLogicalUnit(LogicalUnitDto logicalUnit)
        {
            ManagementService.DeleteLogicalUnit(logicalUnit);
            return Json(new { success = true });
        }

        public ActionResult SaveLogicalUnit(LogicalUnitDto logicalUnit)
        {
            ManagementService.SaveLogicalUnit(logicalUnit);
            return Json(new { success = true });
        }

        public ActionResult GetPatients()
        {
            return Json(ManagementService.GetPatients());
        }

        public ActionResult DeletePatient(PatientDto patientDto)
        {
            ManagementService.DeletePatient(patientDto);
            return Json(new { success = true });
        }

        public ActionResult SavePatient(PatientDto patientDto)
        {
            ManagementService.SavePatient(patientDto);
            return Json(new { success = true });
        }
    }
}   
