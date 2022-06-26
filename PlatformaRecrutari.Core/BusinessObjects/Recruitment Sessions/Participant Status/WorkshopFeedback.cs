using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status
{
    public class WorkshopFeedback
    {
        [Required]
        public string ParticipantId { get; set; }

        [Required]
        public string FeedbackGiverId { get; set; }
        
        [Required]
        public int WorkshopId { get; set; }

        [Required]
        public int YesVotes { get; set; }

        [Required]
        public int NoVotes { get; set; }
        
        [Required]
        public int AbstainVotes { get; set; }

        [Required]
        public string Feedback { get; set; }

        [Required]
        public string Status { get; set; }
    }
}
