using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Dto.Sessions.FormAnswers;
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
        private readonly IFormManager _formManager;
        private readonly UserManager<User> _userManager;
        private readonly ISessionManager _sessionManager;
        private readonly IParticipantsManager _participantsManager;

        public ParticipantsController(
            IFormManager formManager,
            ISessionManager sessionManager,
            UserManager<User> userManager,
            IParticipantsManager participantsManager
            )
        {
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
    }
}
