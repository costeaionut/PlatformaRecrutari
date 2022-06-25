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
using System;
using PlatformaRecrutari.Dto.Sessions.FormQuesitons;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Workshops;

namespace PlatformaRecrutari.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SessionController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IFormManager _formManager;
        private readonly ISessionManager _sessionManager;
        private readonly IWorkshopManager _workshopManager;

        public SessionController(
            IMapper mapper,
            IFormManager formManager,
            ISessionManager sessionsManager,
            IWorkshopManager workshopManager
        )
        {
            _workshopManager = workshopManager;
            _sessionManager = sessionsManager;
            _formManager = formManager;
            _mapper = mapper;
        }

        [HttpPost("CreateSession")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public async Task<IActionResult> CreateSession([FromBody] RecruitmentSessionDto newSession)
        {
            if (newSession == null || !ModelState.IsValid)
                return BadRequest("Session's data is not valid.");

            var sessions = _sessionManager.GetUsersSessions(newSession.CreatorId);
            List<RecruitmentSession> active = new();
            foreach (var s in sessions)
            {
                if ((s.StartDate < DateTime.Now && DateTime.Now < s.EndDate) || DateTime.Now < s.StartDate)
                    active.Add(s);
            }

            if (active.Count != 0)
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

        [HttpGet("SessionForm/{id}")]
        public ActionResult<FormDto> GetSessionsForm(int id) {
            Form sessionForm = this._formManager.getFormBySessionId(id);
            if (sessionForm == null)
                return NotFound("NoFormFound");

            FormDto formInfo = this._mapper.Map<FormDto>(sessionForm);
            formInfo.ShortQuestions = new List<ShortQuestionDto>();
            formInfo.MultipleQuestions = new List<MultipleQuestionDto>();
            formInfo.SelectBoxesQuestions = new List<SelectBoxesQuestionDto>();
            formInfo.GridMultipleQuestions = new List<GridMultipleQuestionDto>();
            formInfo.GridSelectBoxesQuestions = new List<GridSelectBoxesQuestionDto>();

            List<BaseQuestion> baseQuestions = this._formManager.getFormsBaseQuestion(formInfo.Id);
            List<GridQuestion> gridQuestions = this._formManager.getFormsGridQuestion(formInfo.Id);

            foreach (var baseQuestion in baseQuestions)
            {
                switch (baseQuestion.Type)
                {
                    case QuestionTypes.Short:
                        ShortQuestionDto shortQuestion = this._mapper.Map<ShortQuestionDto>(baseQuestion);
                        formInfo.ShortQuestions.Add(shortQuestion);
                        break;
                    case QuestionTypes.MultipleOptions:
                        MultipleQuestionDto multipleQuestion = 
                            this._mapper.Map<MultipleQuestionDto>(baseQuestion);
                        multipleQuestion.Options = _formManager
                            .getOptionsForBaseQuestion(multipleQuestion.Id);
                        formInfo.MultipleQuestions.Add(multipleQuestion);
                        break;
                    case QuestionTypes.SelectBoxes:
                        SelectBoxesQuestionDto selectBoxes = 
                            this._mapper.Map<SelectBoxesQuestionDto>(baseQuestion);
                        selectBoxes.Options = _formManager.getOptionsForBaseQuestion(selectBoxes.Id);
                        formInfo.SelectBoxesQuestions.Add(selectBoxes);
                        break;
                    default:
                        break;
                }
            }

            foreach (var gridQuestion in gridQuestions)
            {
                switch (gridQuestion.Type)
                {
                    case QuestionTypes.GridMultipleOptions:
                        GridMultipleQuestionDto gridMultiple = 
                            this._mapper.Map<GridMultipleQuestionDto>(gridQuestion);

                        gridMultiple.Rows = _formManager.getRowsForGridQuestion(gridMultiple.Id);
                        gridMultiple.Columns = _formManager.getColumnsForGridQuestion(gridMultiple.Id);
                        
                        formInfo.GridMultipleQuestions.Add(gridMultiple);
                        break;
                    
                    case QuestionTypes.GridSelectBoxes:
                        GridSelectBoxesQuestionDto gridSelect =
                            this._mapper.Map<GridSelectBoxesQuestionDto>(gridQuestion);

                        gridSelect.Rows = _formManager.getRowsForGridQuestion(gridSelect.Id);
                        gridSelect.Columns = _formManager.getColumnsForGridQuestion(gridSelect.Id);
                        
                        formInfo.GridSelectBoxesQuestions.Add(gridSelect);
                        break;

                    default:
                        break;
                }
            }

            return formInfo;
        }

        [HttpPost("ChangeSessionStatus")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public async Task<IActionResult> ChangeSessionStatus([FromBody] RecruitmentSessionDto sessionDto)
        {
            if (sessionDto == null || !ModelState.IsValid)
                return BadRequest("Session's data is not valid");

            var session = _mapper.Map<RecruitmentSession>(sessionDto);
            var result = await _sessionManager.ChangeSessionStatus(session);

            return result != null ? Ok(result) : BadRequest("Something went wrong!");
        }

        [HttpPost("UpdateSessionInfo")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public async Task<IActionResult> UpdateSessionInfo([FromBody] RecruitmentSessionDto newSessionInfo)
        {
            if (newSessionInfo == null || !ModelState.IsValid)
                return BadRequest("Session's data is not valid");

            var session = _mapper.Map<RecruitmentSession>(newSessionInfo);
            var result = await _sessionManager.UpdateSessionInfo(session);

            return result != null ? Ok(result) : BadRequest("Something went wrong!");
        }

        [HttpGet("RecruitmentSessions")]
        public ActionResult<List<RecruitmentSessionDto>> GetAllSessions()
        {
            return Ok(this._sessionManager.GetAllSessions());
        }

        [HttpGet("ActiveForm")]
        public ActionResult<FormDto> GetActiveForm()
        {
            RecruitmentSession activeSession = this._sessionManager.GetActiveSession();
            if (activeSession == null)
                return NotFound("NoActiveSession");

            var sessionsFormResponse = this.GetSessionsForm(activeSession.Id);
            var sessionsForm = sessionsFormResponse.Value;

            if (sessionsForm == null)
                return NotFound("NoFormInSession");

            if (DateTime.Now < sessionsForm.StartDate)
                return BadRequest($"UpcomingForm||{sessionsForm.StartDate}");

            DateTime endDate = sessionsForm.EndDate + new TimeSpan(23,59,59);

            if (endDate < DateTime.Now)
                return BadRequest($"ClosedForm||{sessionsForm.EndDate}");

            return sessionsForm;
        }

        [HttpGet("ActiveSession")]
        public ActionResult<RecruitmentSession> GetActiveSession()
        {
            return Ok(this._sessionManager.GetActiveSession());
        }

        [HttpGet("{id:int}")]
        public ActionResult<RecruitmentSessionDto> getSessionById(int id) =>
            this._mapper.Map<RecruitmentSessionDto>(this._sessionManager.GetSessionById(id));

        [HttpPost("DeleteSession/{sessionId:int}")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public IActionResult deleteSession([FromBody] UserDto requester, int sessionId) {
            if (requester == null || sessionId == null)
                return BadRequest("NullData");

            RecruitmentSession session = this._sessionManager.GetSessionById(sessionId);

            if (sessionId != session.Id)
                return Unauthorized("Current user is not the creator");

            this._sessionManager.DeleteSession(session);

            return Ok();
        } 
    
        [HttpPost("UpdateForm")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public async Task<IActionResult> UpdateFormAsync([FromBody] FormDto updatedFormDto) {
            if (updatedFormDto == null)
                return BadRequest("MissingFormUpdate");

            Form updatedForm = _mapper.Map<Form>(updatedFormDto);
            this._formManager.updateForm(updatedForm);

            var oldBaseQuestions = _formManager.getFormsBaseQuestion(updatedForm.Id);
            var oldGridQuestions = _formManager.getFormsGridQuestion(updatedForm.Id);

            List<int> oldBaseQuestionsIds = new();
            List<int> oldGridQuestionsIds = new();

            foreach (var item in oldBaseQuestions)
                oldBaseQuestionsIds.Add(item.Id);

            foreach (var item in oldGridQuestions)
                oldGridQuestionsIds.Add(item.Id);

            foreach (var shortQuestion in updatedFormDto.ShortQuestions)
            {
                var baseQuestion = _mapper.Map<BaseQuestion>(shortQuestion);
                if (shortQuestion.Id == 0)
                {
                    baseQuestion.FormId = updatedForm.Id;
                    await _formManager.addSimpleQuestionToForm(baseQuestion);
                }
                else
                {
                    oldBaseQuestionsIds.Remove(baseQuestion.Id);
                    _formManager.updateBaseQuestion(baseQuestion);
                }
            }

            foreach (var multipleQuestion in updatedFormDto.MultipleQuestions)
            {
                var baseQuestion = _mapper.Map<BaseQuestion>(multipleQuestion);
                if (baseQuestion.Id == 0)
                {
                    baseQuestion.FormId = updatedForm.Id;
                    var newBaseQuestion = await _formManager.addSimpleQuestionToForm(baseQuestion);
                    foreach (var option in multipleQuestion.Options)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = multipleQuestion.Options.IndexOf(option);
                        newOption.Type = InputTypes.Option;
                        newOption.Content = option;
                        newOption.QuestionId = newBaseQuestion.Id;
                        await _formManager.addOptionsToQuestion(newOption);
                    }
                }
                else
                {
                    oldBaseQuestionsIds.Remove(baseQuestion.Id);
                    _formManager.updateBaseQuestion(baseQuestion);
                    List<InputsOption> updatedInputs = new();
                    foreach (var option in multipleQuestion.Options)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = multipleQuestion.Options.IndexOf(option);
                        newOption.Type = InputTypes.Option;
                        newOption.Content = option;
                        newOption.QuestionId = multipleQuestion.Id;
                        updatedInputs.Add(newOption);
                    }
                    await _formManager.updateQuestionOptionsAsync(baseQuestion.Id, updatedInputs);
                }
            }

            foreach (var selectQuestion in updatedFormDto.SelectBoxesQuestions)
            {
                var baseQuestion = _mapper.Map<BaseQuestion>(selectQuestion);
                if (baseQuestion.Id == 0)
                {
                    baseQuestion.FormId = updatedForm.Id;
                    var newBaseQuestion = await _formManager.addSimpleQuestionToForm(baseQuestion);
                    foreach (var option in selectQuestion.Options)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = selectQuestion.Options.IndexOf(option);
                        newOption.Type = InputTypes.Option;
                        newOption.Content = option;
                        newOption.QuestionId = newBaseQuestion.Id;
                        _formManager.addOptionsToQuestion(newOption);
                    }
                }
                else
                {
                    oldBaseQuestionsIds.Remove(baseQuestion.Id);
                    _formManager.updateBaseQuestion(baseQuestion);
                    List<InputsOption> updatedInputs = new();
                    foreach (var option in selectQuestion.Options)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = selectQuestion.Options.IndexOf(option);
                        newOption.Type = InputTypes.Option;
                        newOption.Content = option;
                        newOption.QuestionId = selectQuestion.Id;
                        updatedInputs.Add(newOption);
                    }
                    await _formManager.updateQuestionOptionsAsync(baseQuestion.Id, updatedInputs);
                }
            }

            foreach (var gridMultipleQuestion in updatedFormDto.GridMultipleQuestions)
            {
                var gridQuestion = _mapper.Map<GridQuestion>(gridMultipleQuestion);
                if (gridQuestion.Id == 0) 
                {
                    gridQuestion.FormId = updatedForm.Id;
                    var newGridQuestion = await _formManager.addGridQuestionToForm(gridQuestion);
                    foreach (var row in gridMultipleQuestion.Rows)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridMultipleQuestion.Rows.IndexOf(row);
                        newOption.Type = InputTypes.Row;
                        newOption.Content = row;
                        newOption.QuestionId = newGridQuestion.Id;
                        await _formManager.addOptionsToQuestion(newOption);
                    }
                    foreach (var col in gridMultipleQuestion.Columns)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridMultipleQuestion.Rows.IndexOf(col);
                        newOption.Type = InputTypes.Column;
                        newOption.Content = col;
                        newOption.QuestionId = newGridQuestion.Id;
                        await _formManager.addOptionsToQuestion(newOption);
                    }

                }
                else
                {
                    oldGridQuestionsIds.Remove(gridQuestion.Id);
                    _formManager.updateGridQuestion(gridQuestion);
                    List<InputsOption> updatedGridRowsColumns = new();
                    foreach (var row in gridMultipleQuestion.Rows)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridMultipleQuestion.Rows.IndexOf(row);
                        newOption.Type = InputTypes.Row;
                        newOption.Content = row;
                        newOption.QuestionId = gridMultipleQuestion.Id;
                        updatedGridRowsColumns.Add(newOption);
                    }
                    foreach (var col in gridMultipleQuestion.Columns)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridMultipleQuestion.Rows.IndexOf(col);
                        newOption.Type = InputTypes.Column;
                        newOption.Content = col;
                        newOption.QuestionId = gridMultipleQuestion.Id;
                        updatedGridRowsColumns.Add(newOption);
                    }
                    
                    await this._formManager.updateQuestionOptionsAsync(gridQuestion.Id, updatedGridRowsColumns);
                }
            }

            foreach (var gridSelectQuestion in updatedFormDto.GridSelectBoxesQuestions)
            {
                var gridQuestion = _mapper.Map<GridQuestion>(gridSelectQuestion);
                if(gridQuestion.Id == 0)
                {
                    gridQuestion.FormId = updatedForm.Id;
                    var newGridQuestion = await _formManager.addGridQuestionToForm(gridQuestion);
                    foreach (var row in gridSelectQuestion.Rows)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridSelectQuestion.Rows.IndexOf(row);
                        newOption.Type = InputTypes.Row;
                        newOption.Content = row;
                        newOption.QuestionId = newGridQuestion.Id;
                        await _formManager.addOptionsToQuestion(newOption); 
                    }
                    foreach (var col in gridSelectQuestion.Columns)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridSelectQuestion.Rows.IndexOf(col);
                        newOption.Type = InputTypes.Column;
                        newOption.Content = col;
                        newOption.QuestionId = newGridQuestion.Id;
                        await _formManager.addOptionsToQuestion(newOption);
                    }
                }
                else
                {
                    oldGridQuestionsIds.Remove(gridQuestion.Id);
                    _formManager.updateGridQuestion(gridQuestion);
                    List<InputsOption> updatedGridRowsColumns = new();
                    foreach (var row in gridSelectQuestion.Rows)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridSelectQuestion.Rows.IndexOf(row);
                        newOption.Type = InputTypes.Row;
                        newOption.Content = row;
                        newOption.QuestionId = gridSelectQuestion.Id;
                        updatedGridRowsColumns.Add(newOption);
                    }
                    foreach (var col in gridSelectQuestion.Columns)
                    {
                        InputsOption newOption = new();
                        newOption.Id = 0;
                        newOption.Position = gridSelectQuestion.Rows.IndexOf(col);
                        newOption.Type = InputTypes.Column;
                        newOption.Content = col;
                        newOption.QuestionId = gridSelectQuestion.Id;
                        updatedGridRowsColumns.Add(newOption);
                    }

                    await this._formManager.updateQuestionOptionsAsync(gridQuestion.Id, updatedGridRowsColumns);

                }
            }

            if(oldBaseQuestionsIds.Count != 0)
            {
                foreach (var item in oldBaseQuestionsIds)
                    _formManager.deleteBaseQuestion(item);
            }
            if(oldGridQuestionsIds.Count != 0)
            {
                foreach (var item in oldGridQuestionsIds)
                    _formManager.deleteGridQuestion(item);
            }

            return Ok();
        }
   
        [HttpPost("PostWorkshop")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult<Workshop> PostNewWorkshop([FromBody] Workshop newWorkshop)
        {
            if (newWorkshop == null)
                return BadRequest("MissingBodyWorkshop");

            if (newWorkshop.WorkshopDate < new DateTime())
                return BadRequest("WrongDateTime");

            if (newWorkshop.Id != 0)
                return _workshopManager.updateWorkshop(newWorkshop);

            var res = _workshopManager.createWorkshop(newWorkshop);
            if (res == null) 
                return StatusCode(500, "ErrorCreatingWorkshop");

            return res;
        }

        [HttpGet("Workshops/{sessionId}")]
        public ActionResult<List<Workshop>> GetWorkshopsBySessionId(int sessionId) 
            => this._workshopManager.getWorkshopRangeBySessionId(sessionId);


        [HttpGet("Workshop/{workshopId}")]
        public ActionResult<Workshop> GetWorkshopById(int workshopId) =>
            this._workshopManager.getWorkshopById(workshopId);
    
        [HttpPost("Workshop/Delete")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public IActionResult DeleteWorkshop([FromBody] Workshop workshopToBeDeleted) {
            if (workshopToBeDeleted == null)
                return BadRequest("MissingBodyWorkshop");

            this._workshopManager.deleteWorkshop(workshopToBeDeleted);

            return Ok();
        }
    
        [HttpGet("Workshop/ParticipantsToBeScheduled/{workshopId}")]
        public List<User> GetParticipantsWhoCanBeScheduled(int workshopId)
        {

            var workshop = this._workshopManager.getWorkshopById(workshopId);
            var session = this._sessionManager.GetSessionById(workshop.SessionId);
            var form = this._formManager.getFormBySessionId(session.Id);

            var users = this._formManager.getUsersWhoPassedForm(form.Id);

            var eligibleUsers = this._workshopManager.getUsersEligibleForSchedule(users, session);

            return eligibleUsers;
        }
    
        [HttpPost("Workshop/Schedule")]
        public ActionResult<WorkshopSchedule> PostNewSchedule([FromBody] WorkshopSchedule newSchedule)
        {
            if (newSchedule == null)
                return BadRequest("MissingBodySchedule");

            var activeSession = this._sessionManager.GetActiveSession();
            var currentForm = this._formManager.getFormBySessionId(activeSession.Id);

            if (currentForm.EndDate < DateTime.Now)
                return this._workshopManager.createWorkshopSchedule(newSchedule);

            return BadRequest("WaitForFormToClose");
        }
    
        [HttpGet("Workshop/Scheduled/Participants/{workshopId}")]
        public ActionResult<List<User>> GetScheduledParticipants(int workshopId)
            => this._workshopManager.getWorkshopParticipants(this._workshopManager.getWorkshopById(workshopId));

        [HttpGet("Workshop/Scheduled/Volunteers/{workshopId}")]
        public ActionResult<List<User>> GetScheduledVolunteers(int workshopId)
            => this._workshopManager.getWorkshopVolunteers(this._workshopManager.getWorkshopById(workshopId));

        [HttpGet("Workshop/Scheduled/CDDD/{workshopId}")]
        public ActionResult<List<User>> GetScheduledCDDD(int workshopId)
            => this._workshopManager.getWorkshopScheduledCDDD(this._workshopManager.getWorkshopById(workshopId));

        [HttpGet("Workshop/IsScheduled/{userId}/{sessionId}")]
        public ActionResult<bool> IsParticipantScheduled(int sessionId, string userId)
            => this._workshopManager.isParticipantScheduled(sessionId, userId);

        [HttpGet("Workshop/Status/{userId}/{sessionId}")]
        public ActionResult<string> GetWorkshopStatusFromUserIdAndSessionId(string userId, int sessionId)
            => this._workshopManager.getWorkshopStatus(sessionId, userId);
    
        [HttpPost("Workshop/Scheduled/WhoScheduled/{sessionId}")]
        public ActionResult<List<User>> GetWhoScheduled([FromBody] List<User> users, int sessionId)
        {
            if (users == null)
                return BadRequest("MissingBodyUsers");

            var workshops = _workshopManager.getWorkshopRangeBySessionId(sessionId);

            return _workshopManager.getVolunteerWhoScheduledParticipants(workshops, users);
        }

        [HttpPost("Workshop/Schedule/DeleteSchedule/{participantId}/{workshopId}")]
        public IActionResult DeleteScheduledUser(string participantId, int workshopId)
        {
            this._workshopManager.deleteParticipantScheduleSlot(participantId, workshopId);
            return Ok();
        }

    }
}
