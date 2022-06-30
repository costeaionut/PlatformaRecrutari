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
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews;
using PlatformaRecrutari.Dto.Sessions.Interviews;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FinalVote;
using PlatformaRecrutari.Dto.Sessions.FinalVotes;

namespace PlatformaRecrutari.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SessionController : ControllerBase
    {
        private const string AnyOfVolunteerPMCDDD =
            "ProjectManager,Volunteer,DepartmentDirector,BoardMember";
        private readonly IMapper _mapper;
        private readonly IFormManager _formManager;
        private readonly IRoleManager _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly ISessionManager _sessionManager;
        private readonly IWorkshopManager _workshopManager;
        private readonly IFinalVoteManager _finalVoteManager;
        private readonly IInterviewManager _interviewManager;

        public SessionController(
            IMapper mapper,
            IRoleManager roleManager,
            IFormManager formManager,
            UserManager<User> userManager,
            ISessionManager sessionsManager,
            IWorkshopManager workshopManager,
            IFinalVoteManager finalVoteManager,
            IInterviewManager interviewManager
        )
        {
            _interviewManager = interviewManager;
            _finalVoteManager = finalVoteManager;
            _workshopManager = workshopManager;
            _sessionManager = sessionsManager;
            _userManager = userManager;
            _roleManager = roleManager;
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

            DateTime endDate = sessionsForm.EndDate + new TimeSpan(23, 59, 59);

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
                if (gridQuestion.Id == 0)
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

            if (oldBaseQuestionsIds.Count != 0)
            {
                foreach (var item in oldBaseQuestionsIds)
                    _formManager.deleteBaseQuestion(item);
            }
            if (oldGridQuestionsIds.Count != 0)
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
        public List<UserDto> GetParticipantsWhoCanBeScheduled(int workshopId)
        {

            var workshop = this._workshopManager.getWorkshopById(workshopId);
            var session = this._sessionManager.GetSessionById(workshop.SessionId);
            var form = this._formManager.getFormBySessionId(session.Id);

            var users = this._formManager.getUsersWhoPassedForm(form.Id);

            var eligibleUsers = this._workshopManager.getUsersEligibleForSchedule(users, session);
            List<UserDto> eligibleUsersDto = new();

            foreach (var user in eligibleUsers)
            {
                var mappedUser = this._mapper.Map<UserDto>(user);
                mappedUser.Role = this._roleManager.GetRoleType(user.RoleId);
                eligibleUsersDto.Add(mappedUser);
            }

            return eligibleUsersDto;
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
        public ActionResult<List<UserDto>> GetScheduledParticipants(int workshopId)
        {
            var users =
                this._workshopManager.getWorkshopParticipants(this._workshopManager.getWorkshopById(workshopId));

            List<UserDto> usersDto = new();

            foreach (var user in users)
            {
                var mappedUser = this._mapper.Map<UserDto>(user);
                mappedUser.Role = this._roleManager.GetRoleType(user.RoleId);
                usersDto.Add(mappedUser);
            }

            return usersDto;
        }

        [HttpGet("Workshop/Scheduled/Volunteers/{workshopId}")]
        public ActionResult<List<UserDto>> GetScheduledVolunteers(int workshopId)
        {
            var users =
                this._workshopManager.getWorkshopVolunteers(this._workshopManager.getWorkshopById(workshopId));

            List<UserDto> usersDto = new();

            foreach (var user in users)
            {
                var mappedUser = this._mapper.Map<UserDto>(user);
                mappedUser.Role = this._roleManager.GetRoleType(user.RoleId);
                usersDto.Add(mappedUser);
            }

            return usersDto;
        }

        [HttpGet("Workshop/Scheduled/CDDD/{workshopId}")]
        public ActionResult<List<UserDto>> GetScheduledCDDD(int workshopId)
        {
            var users =
                this._workshopManager.getWorkshopScheduledCDDD(this._workshopManager.getWorkshopById(workshopId));

            List<UserDto> usersDto = new();
            foreach (var user in users)
            {
                var mappedUser = this._mapper.Map<UserDto>(user);
                mappedUser.Role = this._roleManager.GetRoleType(user.RoleId);
                usersDto.Add(mappedUser);
            }

            return usersDto;
        }

        [HttpGet("Workshop/IsScheduled/{userId}/{sessionId}")]
        public ActionResult<bool> IsParticipantScheduled(int sessionId, string userId)
            => this._workshopManager.isParticipantScheduled(sessionId, userId);

        [HttpGet("Workshop/Status/{userId}/{sessionId}")]
        public ActionResult<string> GetWorkshopStatusFromUserIdAndSessionId(string userId, int sessionId)
            => this._workshopManager.getWorkshopStatus(sessionId, userId);

        [HttpPost("Workshop/Scheduled/WhoScheduled/{sessionId}")]
        public ActionResult<List<UserDto>> GetWhoScheduled([FromBody] List<User> users, int sessionId)
        {
            if (users == null)
                return BadRequest("MissingBodyUsers");

            var workshops = _workshopManager.getWorkshopRangeBySessionId(sessionId);

            var foundUsers = _workshopManager.getVolunteerWhoScheduledParticipants(workshops, users);
            List<UserDto> usersDto = new();
            foreach (var user in foundUsers)
            {
                var mappedUser = this._mapper.Map<UserDto>(user);
                mappedUser.Role = this._roleManager.GetRoleType(user.RoleId);
                usersDto.Add(mappedUser);
            }

            return usersDto;
        }

        [HttpPost("Workshop/Schedule/DeleteSchedule/{participantId}/{workshopId}")]
        public IActionResult DeleteScheduledUser(string participantId, int workshopId)
        {
            this._workshopManager.deleteParticipantScheduleSlot(participantId, workshopId);
            return Ok();
        }

        [HttpPost("Workshop/Feedback/Create")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public async Task<ActionResult<WorkshopFeedback>>
            CreateWorkshopFeedbackAsync([FromBody] WorkshopFeedback newFeedback)
        {
            if (newFeedback == null)
                return BadRequest("MissingBodyFeedback");

            var participant = await this._userManager.FindByIdAsync(newFeedback.ParticipantId);
            var participantRole = this._roleManager.GetRoleType(participant.RoleId);

            var feedbackGiver = await this._userManager.FindByIdAsync(newFeedback.FeedbackGiverId);
            var feedbackGiverRole = this._roleManager.GetRoleType(feedbackGiver.RoleId);

            if (participant == null || feedbackGiver == null)
                return BadRequest("Participant|GiverNotFound");

            if (participantRole != RoleType.Candidate)
                return BadRequest("CandidateRoleNotEligible");

            if (feedbackGiverRole != RoleType.ProjectManager)
                return BadRequest("FeedbackGiverNotEligible");

            if (_workshopManager.getUsersFeedbackForWorkshop(newFeedback.ParticipantId, newFeedback.WorkshopId) != null)
                return BadRequest("FeedbackAlreadyGiven");

            var res = _workshopManager.createWrokshopFeedback(newFeedback);

            return res;
        }

        [HttpGet("Workshop/Feedback/{participantId}/{workshopId}")]
        public async Task<ActionResult<WorkshopFeedback>> GetParticipantWorkshopFeedbackAsync(string participantId, int workshopId)
        {
            var res = await this._userManager.FindByIdAsync(participantId);
            if (res == null)
                return BadRequest("ParticipantNotFound");

            return _workshopManager.getUsersFeedbackForWorkshop(participantId, workshopId);
        }

        [HttpPost("Workshop/Feedback/Delete")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public IActionResult DeleteParticipantsFeedback([FromBody] WorkshopFeedback workshopFeedback)
        {
            if (workshopFeedback == null)
                return BadRequest("MissingBodyFeedback");

            _workshopManager.deleteUserFeedback(workshopFeedback);

            return Ok();
        }

        [HttpGet("Workshop/FeedbackBySession/{participantId}/{sessionId}")]
        public async Task<ActionResult<WorkshopFeedback>>
            GetParticipantWorkshopFormBySessionIdAsync(string participantId, int sessionId)
        {
            var participant = await this._userManager.FindByIdAsync(participantId);
            if (participant == null)
                return BadRequest("ParticipantNotFound");

            return _workshopManager.GetWorkshopFeedbackBySessionId(participantId, sessionId);
        }

        [HttpPost("Workshop/Feedback/Edit")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult<WorkshopFeedback>
            EditParticipantFeedback([FromBody] WorkshopFeedback newWorkshopValues)
            => _workshopManager.editUserFeedback(newWorkshopValues);

        [HttpPost("Interview/Create")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult CreateInterview([FromBody] Interview interview)
        {
            if (interview == null)
                return BadRequest("MissingBodyInterview");

            if (interview.InterviewDateTime < DateTime.Now)
                return BadRequest("DateEarlierThanNow");

            if (_interviewManager.getOverlappingInterviews(interview).Count != 0)
                return BadRequest("InterviewsOverlapping");

            _interviewManager.createInterview(interview);

            return StatusCode(201);
        }

        [HttpPost("Interview/CreateRange")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult CreateInterviewRange([FromBody] List<Interview> interviews)
        {
            if (interviews == null)
                return BadRequest("MissingBodyInterviews");

            foreach (var interview in interviews)
            {
                if (interview.InterviewDateTime < DateTime.Now)
                    return BadRequest("DateEarlierThanNow");

                if (_interviewManager.getOverlappingInterviews(interview).Count != 0)
                    return BadRequest("InterviewsOverlapping");
            }

            _interviewManager.createInterviewRange(interviews);

            return StatusCode(201);
        }

        [HttpGet("Interview/{interviewId}")]
        public ActionResult<InterviewDto> GetInterviewById(int interviewId)
        {
            var interview = _interviewManager.getInterview(interviewId);

            InterviewDto interviewDto = new();
            DateTime commonDate =
                interview.InterviewDateTime -
                new TimeSpan(interview.InterviewDateTime.Hour,
                             interview.InterviewDateTime.Minute,
                             interview.InterviewDateTime.Second);

            interviewDto.InterviewsDate = commonDate;
            interviewDto.InterviewsDetails.Add(interview);

            return interviewDto;
        }

        [HttpGet("Interviews/{sessionId}")]
        public async Task<ActionResult<List<InterviewDto>>> GetInterviewBySessionIdAsync(int sessionId)
        {
            var interviews = _interviewManager.getSessionsInterview(sessionId);
            var interviewsDict = new Dictionary<DateTime, List<Interview>>();
            var interviewsPariticipantsDict = new Dictionary<DateTime, List<InterviewScheduleDto>>();
            var interviewsFeedbackDict = new Dictionary<DateTime, List<InterviewFeedback>>();

            foreach (var interview in interviews)
            {
                DateTime commonDate =
                interview.InterviewDateTime -
                new TimeSpan(interview.InterviewDateTime.Hour,
                             interview.InterviewDateTime.Minute,
                             interview.InterviewDateTime.Second);

                if (interviewsDict.ContainsKey(commonDate)) {

                    List<InterviewSchedule> participants =
                        _interviewManager.getInterviewsScheduledUsers(interview.Id);

                    InterviewScheduleDto interviewScheduledUsers = new InterviewScheduleDto();
                    interviewScheduledUsers.InterviewId = interview.Id;
                    foreach (var participant in participants)
                    {
                        var user = await _userManager.FindByIdAsync(participant.ParticipantId);
                        var userDto = _mapper.Map<UserDto>(user);
                        userDto.Role = _roleManager.GetRoleType(user.RoleId);
                        interviewScheduledUsers.SchedulerId = participant.VolunteerId;
                        switch (participant.Type)
                        {
                            case ScheduleTypes.Participant:
                                interviewScheduledUsers.Participant = userDto;
                                break;
                            case ScheduleTypes.Volunteer:
                                interviewScheduledUsers.HR = userDto;
                                break;
                            case ScheduleTypes.Director:
                                interviewScheduledUsers.DD = userDto;
                                break;
                            case ScheduleTypes.CD:
                                interviewScheduledUsers.CD = userDto;
                                break;
                        }
                    }
                    interviewsDict[commonDate].Add(interview);
                    interviewsPariticipantsDict[commonDate].Add(interviewScheduledUsers);
                    interviewsFeedbackDict[commonDate].Add(_interviewManager.getInterviewsFeedback(interview.Id));
                }
                else
                {
                    var newInterviewList = new List<Interview>();
                    var newInterviewParticipantList = new List<InterviewScheduleDto>();
                    var newInterviewFeedbackList = new List<InterviewFeedback>();

                    List<InterviewSchedule> participants =
                        _interviewManager.getInterviewsScheduledUsers(interview.Id);

                    InterviewScheduleDto interviewScheduledUsers = new InterviewScheduleDto();
                    interviewScheduledUsers.InterviewId = interview.Id;
                    foreach (var participant in participants)
                    {
                        var user = await _userManager.FindByIdAsync(participant.ParticipantId);
                        var userDto = _mapper.Map<UserDto>(user);
                        userDto.Role = _roleManager.GetRoleType(user.RoleId);
                        interviewScheduledUsers.SchedulerId = participant.VolunteerId;
                        switch (participant.Type)
                        {
                            case ScheduleTypes.Participant:
                                interviewScheduledUsers.Participant = userDto;
                                break;
                            case ScheduleTypes.Volunteer:
                                interviewScheduledUsers.HR = userDto;
                                break;
                            case ScheduleTypes.Director:
                                interviewScheduledUsers.DD = userDto;
                                break;
                            case ScheduleTypes.CD:
                                interviewScheduledUsers.CD = userDto;
                                break;
                        }
                    }

                    newInterviewFeedbackList.Add(_interviewManager.getInterviewsFeedback(interview.Id));
                    newInterviewParticipantList.Add(interviewScheduledUsers);
                    newInterviewList.Add(interview);

                    interviewsPariticipantsDict.Add(commonDate, newInterviewParticipantList);
                    interviewsFeedbackDict.Add(commonDate, newInterviewFeedbackList);
                    interviewsDict.Add(commonDate, newInterviewList);
                }

            }

            var interviewsDto = new List<InterviewDto>();

            foreach (var pair in interviewsDict)
            {
                var newInterviewDto = new InterviewDto();
                newInterviewDto.InterviewsDate = pair.Key;
                newInterviewDto.InterviewsDetails = pair.Value;
                newInterviewDto.InterviewsScheduledUsers = interviewsPariticipantsDict[pair.Key];
                newInterviewDto.InterviewsFeedbacks = interviewsFeedbackDict[pair.Key];

                interviewsDto.Add(newInterviewDto);
            }

            return Ok(interviewsDto);
        }

        [HttpPost("Interview/Delete")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult DeleteInterview([FromBody] Interview interview)
        {
            _interviewManager.deleteInterview(interview.Id);
            return Ok();
        }

        [HttpPost("Interview/Update")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult UpdateInterview([FromBody] Interview interview) {
            _interviewManager.updateInterview(interview);
            return Ok();
        }

        [HttpPost("Interview/Schedule/Create")]
        [Authorize(Roles = AnyOfVolunteerPMCDDD)]
        public ActionResult<InterviewSchedule> CreateInterviewSchedule([FromBody] InterviewSchedule interviewSchedule)
        {
            if (interviewSchedule == null)
                return BadRequest("MissingBodySchedule");

            List<InterviewSchedule> alreadyScheduledInterviews =
                _interviewManager.getInterviewsScheduledUsers(interviewSchedule.InterviewId);
            foreach (var scheduledInterview in alreadyScheduledInterviews)
            {
                if (scheduledInterview.Type == interviewSchedule.Type)
                    return BadRequest("InterviewAlreadyTaken");
            }

            return _interviewManager.addInterviewSchedule(interviewSchedule);
        }

        [HttpPost("Interview/Schedule/Delete")]
        [Authorize(Roles = AnyOfVolunteerPMCDDD)]
        public ActionResult DeleteInterviewSchedule([FromBody] InterviewSchedule interviewSchedule)
        {
            _interviewManager.deleteInterviewSchedule(interviewSchedule);
            return Ok();
        }

        [HttpGet("Interview/Schedule/GetEligibleCandidates/{sessionId}")]
        public ActionResult<List<UserDto>> GetCandidatesEligibleForInterview(int sessionId)
        {
            List<UserDto> eligibleUsersDto = new();

            var eligibleUsers = _interviewManager.getUsersEligibleForInterviewSchedule(sessionId);

            foreach (var user in eligibleUsers)
            {
                var userDto = _mapper.Map<UserDto>(user);
                userDto.Role = _roleManager.GetRoleType(user.RoleId);
                eligibleUsersDto.Add(userDto);
            }

            return eligibleUsersDto;
        }

        [HttpPost("Interview/Feedback/Create")]
        public ActionResult<InterviewFeedback> AddInterviewFeedback([FromBody] InterviewFeedback interviewFeedback)
        {
            if (interviewFeedback == null)
                return BadRequest("MissingBodyFeedback");

            var newFeedback = _interviewManager.addInterviewFeedback(interviewFeedback);

            return Ok(newFeedback);
        }

        [HttpPost("FinalVote/Voter/Create")]
        public async Task<ActionResult<Voter>> AddNewVoterAsync([FromBody] Voter voter)
        {

            if (voter == null)
                return BadRequest("MissingBodyVoterInfo");

            voter.Status = "WaitingApproval";

            var volunteer = await _userManager.FindByIdAsync(voter.VolunteerId);
            var session = _sessionManager.GetSessionById(voter.SessionId);

            if (volunteer == null || session == null)
                return BadRequest("VolunterOrSessionNotFound");

            if (session.EndDate < DateTime.Now)
                return BadRequest("SessionClosed");

            return _finalVoteManager.AddVoter(voter);

        }

        [HttpPost("FinalVote/Vote/Create")]
        public async Task<ActionResult<Vote>> AddNewVoteAsync([FromBody] Vote vote)
        {
            if (vote == null)
                return BadRequest("MissingBodyVoterInfo");

            if (_finalVoteManager.GetVolunteerVote(vote.SessionId, vote.VoterId, vote.ParticipantId) != null)
                return BadRequest("VolunteerAlreadyVoted");

            var participant = await _userManager.FindByIdAsync(vote.ParticipantId);
            var voter = await _userManager.FindByIdAsync(vote.VoterId);
            var session = _sessionManager.GetSessionById(vote.SessionId);

            if (participant == null || session == null || voter == null)
                return BadRequest("ParticipantVolunterOrSessionNotFound");

            if (session.EndDate < DateTime.Now)
                return BadRequest("SessionClosed");

            return _finalVoteManager.AddVote(vote);

        }

        [HttpPost("FinalVote/VotedParticipant/Create")]
        public async Task<ActionResult<VotedParticipant>> AddNewVotedParticipantAsync([FromBody] VotedParticipant participant)
        {
            if (participant == null)
                return BadRequest("MissingBodyVoterInfo");

            var voted = await _userManager.FindByIdAsync(participant.ParticipantId);
            var session = _sessionManager.GetSessionById(participant.SessionId);

            if (session == null || voted == null)
                return BadRequest("ParticipantVolunterOrSessionNotFound");

            if (session.EndDate < DateTime.Now)
                return BadRequest("SessionClosed");

            return _finalVoteManager.AddVotedParticipant(participant);

        }

        [HttpGet("FinalVote/GetSessionVoters/{sessionId}")]
        public async Task<ActionResult<List<VoterDto>>> GetSessionsVotersAsync(int sessionId)
        {
            var voters = _finalVoteManager.GetVotersBySessionId(sessionId);
            var votersDto = new List<VoterDto>();
            foreach (var voter in voters)
            {
                var user = await _userManager.FindByIdAsync(voter.VolunteerId);
                var userDto = _mapper.Map<UserDto>(user);
                userDto.Role = _roleManager.GetRoleType(user.RoleId);

                var voterDto = new VoterDto();
                voterDto.User = userDto;
                voterDto.Status = voter.Status;

                votersDto.Add(voterDto);
            }
            return votersDto;
        }

        [HttpGet("FinalVote/GetSesionVotedUsers/{sessionId}")]
        public async Task<ActionResult<VotedUserDto>> GetSessionsVotedUsersAsync(int sessionId)
        {
            var votedUsersDto = new List<VotedUserDto>();
            var votedUsers = _finalVoteManager.GetVotedParticipantsBySessionId(sessionId);

            foreach (var user in votedUsers)
            {
                var votedUserDto = new VotedUserDto();
                var voters = new List<VotesDto>();

                var userInfo = await _userManager.FindByIdAsync(user.ParticipantId);
                var userDto = _mapper.Map<UserDto>(userInfo);
                userDto.Role = _roleManager.GetRoleType(userInfo.RoleId);

                if (user.Status == "Waiting") {
                    votedUserDto.VoteStatus = "Waiting";
                }
                else
                {
                    votedUserDto.VoteStatus = user.Status;

                    var participantVotes = _finalVoteManager.GetParticipantVotes(sessionId, userDto.Id);
                    foreach (var vote in participantVotes)
                    {
                        var voter = new VotesDto();

                        var voterInfo = await _userManager.FindByIdAsync(vote.VoterId);
                        var voterUserDto = _mapper.Map<UserDto>(voterInfo);
                        voterUserDto.Role = _roleManager.GetRoleType(voterInfo.RoleId);

                        voter.VoterInfo = voterUserDto;
                        voter.Vote = vote.Response;
                        
                        voters.Add(voter);
                    }
                }

                votedUserDto.VotersVotes = voters;
                votedUserDto.ParticipantInfo = userDto;
                votedUsersDto.Add(votedUserDto);
            }

            return Ok(votedUsersDto);
        }

        [HttpPut("FinalVote/ChangeVoterStatus")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public async Task<ActionResult<VoterDto>> ChangeVoterStatusAsync([FromBody] Voter voter)
        {
            if (voter == null)
                return BadRequest("MissingVoterBody");

            var currentVoter =
                _finalVoteManager
                .GetVotersBySessionId(voter.SessionId)
                .Find(v => v.VolunteerId == voter.VolunteerId);

            if (currentVoter.Status == voter.Status)
                return BadRequest("AlreadyHasStatus");

            voter = _finalVoteManager.UpdateVoterStatus(voter);

            var voterDto = new VoterDto();
            var user = await _userManager.FindByIdAsync(voter.VolunteerId);
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Role = _roleManager.GetRoleType(user.RoleId);
            voterDto.User = userDto;
            voterDto.Status = voter.Status;

            return voterDto;
        }

        [HttpPut("FinalVote/StartVotingSession/{sessionId}")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public async Task<ActionResult> StartVotingSessionAsync(int sessionId) {
            var session = _sessionManager.GetSessionById(sessionId);
            if (session == null)
                return BadRequest("SessionNotFound");
            if (session.IsFinalVoteStarted)
                return NoContent();
            session.IsFinalVoteStarted = true;
           await _sessionManager.UpdateSessionInfo(session);

            var sessionCreator = await _userManager.FindByIdAsync(session.CreatorId);

            if (_finalVoteManager.GetVoter(sessionCreator.Id, sessionId) != null)
                return Ok();
            
            var voter = new Voter();
            voter.VolunteerId = sessionCreator.Id;
            voter.SessionId = sessionId;
            voter.Status = "Approved";

            _finalVoteManager.AddVoter(voter);

            return Ok();
        }

        [HttpGet("FinalVote/Voter/{sessionId}/{volunteerId}")]
        public async Task<ActionResult<VoterDto>> GetVoterDtoAsync(int sessionId, string volunteerId)
        {
            var voterInfo = _finalVoteManager.GetVoter(volunteerId, sessionId);

            if (voterInfo == null) return null;

            var voterDto = new VoterDto();
            var user = await _userManager.FindByIdAsync(voterInfo.VolunteerId);
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Role = _roleManager.GetRoleType(user.RoleId);
            voterDto.User = userDto;
            voterDto.Status = voterInfo.Status;

            return voterDto;
            ; }

        [HttpGet("FinalVote/Voter/ParticipantWaitingForVote/{sessionId}")]
        public async Task<ActionResult<UserDto>> GetParticipantWaitingForVote(int sessionId)
        {
            var votedParticipant = _finalVoteManager.GetParticipantWaitingForAnswer(sessionId);

            if (votedParticipant == null)
                return null;

            var participant = await _userManager.FindByIdAsync(votedParticipant.ParticipantId);
            var participantDto = _mapper.Map<UserDto>(participant);
            participantDto.Role = _roleManager.GetRoleType(participant.RoleId);
            
            return participantDto;
        }
    
        [HttpPost("FinalVote/VotedParticipant/CloseVote/{sessionId}")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult StopAndCalculateVoteForParticipant([FromBody] UserDto user, int sessionId) 
        {
            if (user == null)
                return BadRequest();

            var participantReceivedVotes = _finalVoteManager.GetParticipantVotes(sessionId, user.Id);

            int yesVotes = 0;
            int noVotes = 0;
            foreach (var vote in participantReceivedVotes)
            {
                if (vote.Response == "Yes") yesVotes++;
                else noVotes++;
            }

            string status = "";
            if ((yesVotes + noVotes)/2 < yesVotes) status = "Approved";
            else status = "Rejected";

            _finalVoteManager.UpdateVotedParticipant(user.Id, sessionId, status);
            return Ok();
        }
    
        [HttpPost("FinalVote/VotedParticipant/DeleteVote/{sessionId}")]
        [Authorize(Roles = RoleType.ProjectManager)]
        public ActionResult DeleteFinalVote([FromBody] UserDto user, int sessionId)
        {
            if (user == null)
                return BadRequest("MissingBodyUser");

            var participantFinalVote = _finalVoteManager.GetVotedParticipant(sessionId, user.Id);
            var participantVotes = _finalVoteManager.GetParticipantVotes(sessionId, user.Id);

            foreach (var vote in participantVotes)
                _finalVoteManager.DeleteVote(vote);
            _finalVoteManager.DeleteVotedParticipant(participantFinalVote);

            return Ok();
        }

        [HttpPost("FinalVote/VotedParticipant/DeleteVoterVote/{sessionId}/{voterId}")]
        public ActionResult DeleteVoterVote([FromBody] UserDto user, int sessionId, string voterId)
        {
            if (user == null)
                return BadRequest("MissingBodyUser");

            var volunteerVote = _finalVoteManager.GetVolunteerVote(sessionId, voterId, user.Id);
            _finalVoteManager.DeleteVote(volunteerVote);


            return Ok();
        }
    }
}