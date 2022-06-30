﻿using AutoMapper;
using DAW.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Dto.Responses;
using PlatformaRecrutari.Dto.User;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;
        private readonly IRoleManager _roleManager;

        public AccountsController(UserManager<User> userManager, IMapper mapper, 
                                  JwtHandler jwtHandler, IRoleManager roleManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
            _roleManager = roleManager;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDto userForRegistration)
        {
            if (userForRegistration == null || !ModelState.IsValid)
                return BadRequest();

            var user = _mapper.Map<User>(userForRegistration);

            var result = await _userManager.CreateAsync(user, userForRegistration.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);

                return BadRequest(new RegistrationResponseDto { Errors = errors });
            }

            return StatusCode(201);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserForLoginDto userForAuthentication)
        {
            var user = await _userManager.FindByEmailAsync(userForAuthentication.Email);
            if(user.ScheduledForDeletion == true)
            {
                user.ScheduledForDeletion = false;
                user.DeletionDate = DateTime.MinValue;
                await _userManager.UpdateAsync(user);
            }

            var users = _userManager.Users.ToList();
            foreach (var u in users)
            {
                if (u.ScheduledForDeletion == true && u.DeletionDate < DateTime.Now) await _userManager.DeleteAsync(u);
            }

            if (user == null || !await _userManager.CheckPasswordAsync(user, userForAuthentication.Password))
                return Unauthorized(new LoginResponseDto { ErrorMessage = "Invalid Authentication" });
            
            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            
            return Ok(new LoginResponseDto { IsAuthSuccessful = true, Token = token });
        }

        [HttpPost("Update")]
        public async Task<ActionResult<UserDto>> Update([FromBody] UserDto newUserInfo)
        {
            var user = await _userManager.FindByIdAsync(newUserInfo.Id);
            user.RoleId = _roleManager.GetRoleId(newUserInfo.Role);
            user.FirstName = newUserInfo.FirstName;
            user.LastName = newUserInfo.LastName;
            user.Email = newUserInfo.Email;
            user.Facebook = newUserInfo.Facebook;
            user.PhoneNumber = newUserInfo.PhoneNumber;
            user.Profile = newUserInfo.Profile;
            user.Class = newUserInfo.Class;
            var res = await _userManager.UpdateAsync(user);

            if(res.Succeeded) return newUserInfo;
            return StatusCode(500);
        }

        [HttpGet("GetCurrentUser"), Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;

            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (email == null)
                return BadRequest("There is no user logged in");

            User user = await _userManager.FindByEmailAsync(email);

            return Ok(new
            {
                id = user.Id,
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                role = _roleManager.GetRoleType(user.RoleId)
            });
        }
    
        [HttpGet("GetUserById/{id}"), Authorize]
        public async Task<IActionResult> GetUserById(string id) {

            if (id == null)
                return BadRequest("IdNotSent");

            User user = await this._userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound();

            UserDto userInfo = this._mapper.Map<UserDto>(user);
            userInfo.Role = _roleManager.GetRoleType(user.RoleId);

            return Ok(userInfo);
        }
    }
}
