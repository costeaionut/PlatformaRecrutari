using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FinalVote
{
    public class VotedParticipant
    {
        [Required]
        public string ParticipantId { get; set; }

        [Required]
        public int SessionId { get; set; }

        [Required]
        public string Status { get; set; }
    }
}
