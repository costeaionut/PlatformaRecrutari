using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Dto.Sessions.FormAnswers;
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
    public class ParticipantsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IFormManager _formManager;
        private readonly UserManager<User> _userManager;
        private readonly ISessionManager _sessionManager;
        private readonly IParticipantsManager _participantsManager;

        public ParticipantsController(
            IMapper mapper,
            IFormManager formManager,
            UserManager<User> userManager,
            ISessionManager sessionManager,
            IParticipantsManager participantsManager
            )
        {
            _mapper = mapper;
            _formManager = formManager;
            _userManager = userManager;
            _sessionManager = sessionManager;
            _participantsManager = participantsManager;
        }

        [HttpPost("AddFormResponse")]
        public async Task<IActionResult> AddFormResponse([FromBody] AnswersDto newAnswer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("InvalidAnswerDto");
            }

            Form form = _formManager.getFormById(newAnswer.FormId);
            User currentUser = await _userManager.FindByIdAsync(newAnswer.CandidateId);

            if (form == null)
                return NotFound("FormNotFound");
            else if (currentUser == null)
                return NotFound("UserNotFound");

            List<FormAnswers> answersAlreadyAdded = new();
            try
            {
                foreach (var answer in newAnswer.Answers)
                {
                    FormAnswers answerToBeAdded = new FormAnswers();
                    answerToBeAdded.Answer = answer.Answer;
                    answerToBeAdded.QuestionId = answer.QuestionId;
                    answerToBeAdded.CandidateId = newAnswer.CandidateId;

                    var res = _participantsManager.AddFormAnswer(answerToBeAdded);
                    answersAlreadyAdded.Add(res);
                }
            }
            catch (Exception)
            {

                foreach (var addedAnswer in answersAlreadyAdded)
                {
                    _participantsManager.DeleteFormAnswer(addedAnswer);
                }

                return StatusCode(500, "ErrorWhileAddingAnswers");

            }
            
            return Ok(answersAlreadyAdded);
        }
    
        [HttpGet("GetSessionsParticipants/{sessionId:int}")]
        public async Task<IActionResult> GetSessionsParticipants(int sessionId) {

            Form sessionForm = _formManager.getFormBySessionId(sessionId);

            if (sessionForm == null)
                return BadRequest("MissingSessionForm");

            var formBaseQuestion = _formManager.getFormsBaseQuestion(sessionForm.Id);
            var formGridQuestion = _formManager.getFormsGridQuestion(sessionForm.Id);

            if (formBaseQuestion == null && formGridQuestion == null)
                return BadRequest("MissingQuestions");

            List<int> questionIds = new();
            foreach (var baseQuestion in formBaseQuestion)
                questionIds.Add(baseQuestion.Id);

            foreach (var gridQuestion in formGridQuestion)
                questionIds.Add(gridQuestion.Id);

            List<UserDto> participantsInfo = new();
            List<string> candidateIds = _participantsManager.FindParticipantIdByQuestionIdRange(questionIds);
            foreach (var candidateId in candidateIds)
                participantsInfo.Add(_mapper.Map<UserDto>(await _userManager.FindByIdAsync(candidateId)));

            return Ok(participantsInfo); 
        }
    
        [HttpGet("FindParticipantAnswer/{userId}/{formId}")]
        public async Task<IActionResult> GetParticipantAnswers(string userId, int formId) {

            if (userId == null || formId == null)
                return BadRequest("MissingInfo");

            User answerer = await this._userManager.FindByIdAsync(userId);
            if (answerer == null)
                return NotFound("MissingUser");

            Form formInfo = this._formManager.getFormById(formId);
            if (formInfo == null)
                return NotFound("MissingForm");

            return Ok(this._participantsManager.FindParticipantAnswers(userId, formId)); 
        }
    }
}
