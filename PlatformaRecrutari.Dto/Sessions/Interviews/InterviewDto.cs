using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.Interviews
{
    public class InterviewDto
    {
        public InterviewDto()
        {
            this.InterviewsDetails = new();
            this.InterviewsDate = new DateTime();
            this.InterviewsScheduledUsers = new();
            this.InterviewsFeedbacks = new();
        }

        public DateTime InterviewsDate { get; set; }
        public List<Interview> InterviewsDetails { get; set; }
        public List<InterviewScheduleDto> InterviewsScheduledUsers { get; set; }
        public List<InterviewFeedback> InterviewsFeedbacks { get; set; }
    }
}
