using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Data.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection RegisterDataService(
            this IServiceCollection service,
            IConfiguration configuration
            )
        {
            service.AddDbContext<RepositoryContext>(options => {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            service.AddScoped<IRoleManager, RoleManager>();
            service.AddScoped<ISessionManager, SessionsManager>();
            service.AddScoped<IFormManager, FormManager>();
            service.AddScoped<IParticipantsManager, ParticiapantsManager>();

            return service;
        }
    }
}
