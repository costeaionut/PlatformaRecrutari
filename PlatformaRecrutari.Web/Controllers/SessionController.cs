using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Dto.Sessions;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {

        private readonly ISessionManager _sessionManager;
        private readonly IMapper _mapper;

        public SessionController(ISessionManager sessionsManager, IMapper mapper)
        {
            _sessionManager = sessionsManager;
            _mapper = mapper;
        }

        [HttpPost("CreateSession")]
        public async Task<IActionResult> CreateSession([FromBody] RecruitmentSessionDto newSession)
        {
            if (newSession == null || !ModelState.IsValid)
                return BadRequest("Session's data is not valid.");

            var session = _mapper.Map<RecruitmentSession>(newSession);
            var result = await _sessionManager.CreateSession(session);

            return result != null ? Ok(session) : BadRequest();
        }

        [HttpPost("ChangeSessionStatus")]
        public async Task<IActionResult> ChangeSessionStatus([FromBody] RecruitmentSessionDto sessionDto)
        {
            if (sessionDto == null || !ModelState.IsValid)
                return BadRequest("Session's data is not valid");

            var session = _mapper.Map<RecruitmentSession>(sessionDto);
            var result = await _sessionManager.ChangeSessionStatus(session);

            return result != null ? Ok(result) : BadRequest("Something went wrong!");
        }
        
        [HttpPost("UpdateSessionInfo")]
        public async Task<IActionResult> UpdateSessionInfo([FromBody] RecruitmentSessionDto newSessionInfo)
        {
            if (newSessionInfo == null || !ModelState.IsValid)
                return BadRequest("Session's data is not valid");

            var session = _mapper.Map<RecruitmentSession>(newSessionInfo);
            var result = await _sessionManager.UpdateSessionInfo(session);

            return result != null ? Ok(result) : BadRequest("Something went wrong!"); 
        }

    }
}
