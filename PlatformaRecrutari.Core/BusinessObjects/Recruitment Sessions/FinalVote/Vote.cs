using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FinalVote
{
    public class Vote
    {
        [Required]
        public string VoterId { get; set; }

        [Required]
        public string ParticipantId { get; set; }

        [Required]
        public int SessionId { get; set; }

        [Required]
        public string Response { get; set; }

    }
}
