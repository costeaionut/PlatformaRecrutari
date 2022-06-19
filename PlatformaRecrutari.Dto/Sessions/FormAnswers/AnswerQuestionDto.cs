using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FormAnswers
{
    public class AnswerQuestionDto
    {
        [Required(ErrorMessage = "RequiredQuestionId")]
        public int QuestionId { get; set; }

        [Required(ErrorMessage = "RequiredAnswer")]
        public string Answer { get; set; }
    }
}
