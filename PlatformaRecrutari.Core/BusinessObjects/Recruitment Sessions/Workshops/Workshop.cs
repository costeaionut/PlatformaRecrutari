using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Workshops
{
    public class Workshop
    {
        [Required]
        public int Id { get; set; }
        
        [Required]
        public int SessionId { get; set; }

        [Required]
        public string Location { get; set; }
        
        [Required]
        public string Departments { get; set; }

        [Required]
        public DateTime WorkshopDate { get; set; }

        [Required]
        [Range(1, 4)]
        public int NumberOfDirectors { get; set; }

        [Required]
        [Range(2, 6)]
        public int NumberOfVolunteers { get; set; }

        [Required]
        [Range(1, 4)]
        public int NumberOfBoardMembers { get; set; }

        [Required]
        [Range(10, 30)]
        public int NumberOfParticipants { get; set; }
    }
}
