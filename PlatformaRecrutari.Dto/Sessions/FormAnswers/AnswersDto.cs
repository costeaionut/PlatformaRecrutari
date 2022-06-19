using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FormAnswers
{
    public class AnswersDto
    {
        [Required(ErrorMessage = "RequiredErrorMessage")]
        public int FormId { get; set; }
        
        [Required(ErrorMessage = "RequiredCandidateId")]
        public string CandidateId { get; set; }
        
        [Required(ErrorMessage = "RequiredAnswers")]
        public List<AnswerQuestionDto> Answers { get; set; }
    }
}
