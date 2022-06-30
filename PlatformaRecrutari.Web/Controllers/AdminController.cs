using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Dto.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IRoleManager _roleManager;
        private readonly IMapper _mapper;

        public AdminController(UserManager<User> userManager, IMapper autoMapper, IRoleManager roleManager)
        {
            _userManager = userManager;
            _mapper = autoMapper;
            _roleManager = roleManager;
        }

        [HttpGet("Users")]
        [Authorize (Roles = RoleType.Admin)]
        public ActionResult<List<UserDto>> GetUserList()
        {
            var userDtoList = new List<UserDto>();
            foreach (var user in _userManager.Users.ToList())
            {
                var userDto = _mapper.Map<UserDto>(user);
                userDto.Role = _roleManager.GetRoleType(user.RoleId);
                userDtoList.Add(userDto);
            }
            return userDtoList;
        }
    
        [HttpPost("ScheduleDeletion")]
        [Authorize(Roles = RoleType.Admin)]
        public async Task<ActionResult> ScheduleForDeletionAsync([FromBody] UserDto userInfo) {
            if (userInfo == null)
                return BadRequest("MissingBodyUserInfo");
            var user = await _userManager.FindByIdAsync(userInfo.Id);
            
            if (user == null)
                return BadRequest("UserNotFound");
            if (user.ScheduledForDeletion == true)
                return BadRequest("AlreadyScheduledForDeletion");
            
            user.ScheduledForDeletion = true;
            user.DeletionDate = DateTime.Now + new TimeSpan(48, 0, 0);
            
            await _userManager.UpdateAsync(user);
            return Ok();
        }
    }
}
