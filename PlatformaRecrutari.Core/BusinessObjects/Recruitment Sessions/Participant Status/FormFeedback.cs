using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status
{
    public class FormFeedback
    {
        public String CandidateId { get; set; }
        public int FormId { get; set; }
        public String Status { get; set; }
        public String FeedbackGiverId { get; set; }
    }
}
