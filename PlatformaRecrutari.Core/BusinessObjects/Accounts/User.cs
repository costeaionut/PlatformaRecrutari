﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Facebook { get; set; }
        public int RoleId { get; set; }
        public string Profile { get; set; }
        public string Class { get; set; }
        public bool ScheduledForDeletion { get; set; }
        public DateTime DeletionDate { get; set; }
    }
}
