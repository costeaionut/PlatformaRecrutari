using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews
{
    public class Interview
    {
        [Required]
        public int Id { get; set; }

        [Required, Range(10, 30)]
        public int Break { get; set; }

        [Required, Range(10, 60)]
        public int Duration { get; set; }

        [Required]
        public int SessionId { get; set; }

        [Required]
        public DateTime InterviewDateTime { get; set; }
    }
}
