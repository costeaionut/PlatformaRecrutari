using PlatformaRecrutari.Dto.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FinalVotes
{
    public class VotedUserDto
    {
        public UserDto ParticipantInfo { get; set; }
        public string VoteStatus { get; set; }
        public List<VotesDto> VotersVotes { get; set; }
    }
}
