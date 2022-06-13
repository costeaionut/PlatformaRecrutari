using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options;
using PlatformaRecrutari.Dto.Sessions;
using PlatformaRecrutari.Dto.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Web.Controllers
{
    [ApiController]
    [Authorize(Roles = RoleType.ProjectManager)]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IFormManager _formManager;
        private readonly ISessionManager _sessionManager;

        public SessionController(
            ISessionManager sessionsManager,
            IMapper mapper,
            IFormManager formManager)
        {
            _sessionManager = sessionsManager;
            _formManager = formManager;
            _mapper = mapper;
        }

        [HttpPost("CreateSession")]
        public async Task<IActionResult> CreateSession([FromBody] RecruitmentSessionDto newSession)
        {
            if (newSession == null || !ModelState.IsValid)
                return BadRequest("Session's data is not valid.");

            if (_sessionManager.GetUsersSessions(newSession.CreatorId).Count != 0)
                return BadRequest("This user has already created a session.");

            var session = _mapper.Map<RecruitmentSession>(newSession);
            var createdSession = await _sessionManager.CreateSession(session);

            var form = _mapper.Map<Form>(newSession.Form);
            form.SessionId = createdSession.Id;
            var createdForm = await _formManager.createForm(form);

            foreach (var item in newSession.Form.ShortQuestions)
            {
                var newShortQuestion = _mapper.Map<BaseQuestion>(item);
                newShortQuestion.FormId = createdForm.Id;
                await _formManager.addSimpleQuestionToForm(newShortQuestion);
            }

            foreach (var item in newSession.Form.MultipleQuestions)
            {
                var newMultipleQuestion = _mapper.Map<BaseQuestion>(item);
                newMultipleQuestion.FormId = createdForm.Id;
                var createdQuestion =
                     await _formManager.addSimpleQuestionToForm(newMultipleQuestion);

                for (int i = 0; i < item.Options.Count; i++)
                {
                    InputsOption newInputOption = new InputsOption();
                    newInputOption.Id = 0;
                    newInputOption.Position = i;
                    newInputOption.Type = InputTypes.Option;
                    newInputOption.Content = item.Options[i];
                    newInputOption.QuestionId = createdQuestion.Id;

                    await _formManager.addOptionsToQuestion(newInputOption);

                }

            }

            foreach (var item in newSession.Form.SelectBoxesQuestions)
            {
                var newSelectBoxes = _mapper.Map<BaseQuestion>(item);
                newSelectBoxes.FormId = createdForm.Id;
                var createdQuestion =
                    await _formManager.addSimpleQuestionToForm(newSelectBoxes);

                for (int i = 0; i < item.Options.Count; i++)
                {
                    InputsOption newInputOption = new InputsOption();
                    newInputOption.Id = 0;
                    newInputOption.Position = i;
                    newInputOption.Type = InputTypes.Option;
                    newInputOption.Content = item.Options[i];
                    newInputOption.QuestionId = createdQuestion.Id;

                    await _formManager.addOptionsToQuestion(newInputOption);

                }
            }

            foreach (var item in newSession.Form.GridMultipleQuestions)
            {
                var newGridMultiplQuestion = _mapper.Map<GridQuestion>(item);
                newGridMultiplQuestion.FormId = createdForm.Id;
                var createdQuestion =
                    await _formManager.addGridQuestionToForm(newGridMultiplQuestion);

                for (int i = 0; i < item.Rows.Count; i++)
                {
                    InputsOption newInputOption = new InputsOption();
                    newInputOption.Id = 0;
                    newInputOption.Position = i;
                    newInputOption.Type = InputTypes.Row;
                    newInputOption.Content = item.Rows[i];
                    newInputOption.QuestionId = createdQuestion.Id;

                    await _formManager.addOptionsToQuestion(newInputOption);

                }

                for (int i = 0; i < item.Columns.Count; i++)
                {
                    InputsOption newInputOption = new InputsOption();
                    newInputOption.Id = 0;
                    newInputOption.Position = i;
                    newInputOption.Type = InputTypes.Column;
                    newInputOption.Content = item.Columns[i];
                    newInputOption.QuestionId = createdQuestion.Id;

                    await _formManager.addOptionsToQuestion(newInputOption);

                }

            }

            foreach (var item in newSession.Form.GridSelectBoxesQuestions)
            {
                var newGridSelectBoxesQuestion = _mapper.Map<GridQuestion>(item);
                newGridSelectBoxesQuestion.FormId = createdForm.Id;
                var createdQuestion =
                    await _formManager.addGridQuestionToForm(newGridSelectBoxesQuestion);

                for (int i = 0; i < item.Rows.Count; i++)
                {
                    InputsOption newInputOption = new InputsOption();
                    newInputOption.Id = 0;
                    newInputOption.Position = i;
                    newInputOption.Type = InputTypes.Row;
                    newInputOption.Content = item.Rows[i];
                    newInputOption.QuestionId = createdQuestion.Id;

                    await _formManager.addOptionsToQuestion(newInputOption);

                }

                for (int i = 0; i < item.Columns.Count; i++)
                {
                    InputsOption newInputOption = new InputsOption();
                    newInputOption.Id = 0;
                    newInputOption.Position = i;
                    newInputOption.Type = InputTypes.Column;
                    newInputOption.Content = item.Columns[i];
                    newInputOption.QuestionId = createdQuestion.Id;

                    await _formManager.addOptionsToQuestion(newInputOption);

                }

            }

            return createdSession != null ? Ok(session) : BadRequest();
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

        [HttpGet("RecruitmentSessions")]
        public ActionResult<List<RecruitmentSessionDto>> getAllSessions()
        {
            return Ok(this._sessionManager.GetAllSessions());
        }

        [HttpGet("{id:int}")]
        public ActionResult<RecruitmentSessionDto> getSessionById(int id) =>
            this._mapper.Map<RecruitmentSessionDto>(this._sessionManager.GetSessionById(id));
        
        [HttpPost("DeleteSession/{sessionId:int}")]
        public IActionResult deleteSession([FromBody] UserDto requester, int sessionId) {
            if (requester == null || sessionId == null)
                return BadRequest("NullData");

            RecruitmentSession session = this._sessionManager.GetSessionById(sessionId);

            if (sessionId != session.Id)
                return Unauthorized("Current user is not the creator");

            this._sessionManager.DeleteSession(session);

            return Ok();
        } 
    }
}
