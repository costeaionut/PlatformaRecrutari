using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews
{
    public class InterviewSchedule
    {
        [Required]
        public string ParticipantId { get; set; }
        public string VolunteerId { get; set; }
        [Required]
        public int InterviewId { get; set; }
        [Required]
        public string Type { get; set; }
    }
}
