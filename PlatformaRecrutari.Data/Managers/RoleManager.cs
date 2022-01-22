using PlatformaRecrutari.Core.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    public class RoleManager : IRoleManager
    {
        private readonly RepositoryContext _context;

        public RoleManager(RepositoryContext context)
        {
            _context = context;
        }

        public string GetRoleType(int roleId) 
            => _context.Roles.FirstOrDefault(r => r.Id == roleId).Type;
        
    }
}
