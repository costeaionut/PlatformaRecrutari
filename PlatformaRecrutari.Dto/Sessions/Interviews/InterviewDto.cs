using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews;
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
        }

        public DateTime InterviewsDate { get; set; }
        public List<Interview> InterviewsDetails { get; set; }
    }
}
