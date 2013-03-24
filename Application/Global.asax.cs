using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using Autofac.Configuration;
using Autofac.Integration.Mvc;
using Informedica.GenPres.Application.IoC.Modules;
using Informedica.Service.Presentation;

namespace Informedica.GenPres.WebApp
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            AuthConfig.RegisterAuth();

            var builder = GenPres.Application.IoC.MvcApplication.BuildIoC();
            builder.RegisterModule(new DatabaseAcceptanceContextModule("http://localhost:8080", "GenPres"));
            
            builder.RegisterType<ManagementService>().As<IMangementService>().InstancePerHttpRequest();

            builder.RegisterControllers(typeof(MvcApplication).Assembly);
            //builder.RegisterModule(new ConfigurationSettingsReader());

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}