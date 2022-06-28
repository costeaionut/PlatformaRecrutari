using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status
{
    public class InterviewFeedback
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int InterviewId { get; set; }

        [Required]
        public string Feedback { get; set; }

        [Required]
        public string HRVote { get; set; }

        [Required]
        public string DDVote { get; set; }

        [Required]
        public string CDVote { get; set; }
    }
}
