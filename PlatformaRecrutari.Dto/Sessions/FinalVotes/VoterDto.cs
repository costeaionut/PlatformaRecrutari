using PlatformaRecrutari.Dto.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FinalVotes
{
    public class VoterDto
    {
        public UserDto User { get; set; }
        public string Status { get; set; }
    }
}
