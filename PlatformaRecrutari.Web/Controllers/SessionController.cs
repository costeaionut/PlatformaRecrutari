using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options;
using PlatformaRecrutari.Dto.Sessions;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Web.Controllers
{
    [ApiController]
    [Authorize(Roles = RoleType.ProjectManager)]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {

        private readonly ISessionManager _sessionManager;
        private readonly IMapper _mapper;
        private readonly IFormManager _formManager;

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

    }
}
