using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IRoleManager
    {
        int GetRoleId(string role);
        public string GetRoleType(int roleId);
    }
}
