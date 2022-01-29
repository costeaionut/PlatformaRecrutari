using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlatformaRecrutari.Core.BusinessObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public AdminController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [Authorize /*(Roles = RoleType.Admin)*/]
        [HttpGet("ListUsers")]
        public ActionResult<List<User>> GetUserList()
            => _userManager.Users.ToList();
    }
}
