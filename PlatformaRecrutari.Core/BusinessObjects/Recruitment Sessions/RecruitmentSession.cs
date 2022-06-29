using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions
{
    public class RecruitmentSession
    {
        public int Id { get; set; }
        public string CreatorId { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsOpen { get; set; }
        public bool IsFinalVoteStarted { get; set; }
    }
}
