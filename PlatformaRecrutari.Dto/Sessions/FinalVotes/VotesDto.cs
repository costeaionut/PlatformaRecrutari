using PlatformaRecrutari.Dto.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FinalVotes
{
    public class VotesDto
    {
        public UserDto VoterInfo { get; set; }
        public string Vote { get; set; }
    }
}
