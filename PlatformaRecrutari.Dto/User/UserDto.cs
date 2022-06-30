using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.User
{
    public class UserDto
    {
        public String Id { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String PhoneNumber { get; set; }
        public String Facebook { get; set; }
        public String Email { get; set; }
        public String Role { get; set; }
        public string Profile { get; set; }
        public string Class { get; set; }
        public bool ScheduledForDeletion { get; set; }
    }
}
