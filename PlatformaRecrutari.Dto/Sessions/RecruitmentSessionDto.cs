using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions
{
    public class RecruitmentSessionDto
    {
        [Required(ErrorMessage = "ID must have a value. If creating a new sesison id shouldn't be added.")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Creator ID is required")]
        public string CreatorId { get; set; }
        [Required(ErrorMessage = "Session's title is required.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Session's start date is required.")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Session's end date is required.")]
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "Session's status is required.")]
        public bool IsOpen { get; set; }
        public bool IsFinalVoteStarted { get; set; }
        public FormDto Form { get; set; }
    }
}
