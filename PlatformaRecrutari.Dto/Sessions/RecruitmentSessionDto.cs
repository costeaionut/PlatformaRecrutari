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
        [Required(ErrorMessage = "ID must have a value. If creating a new sesison id should be set to 0.")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Session's title is required.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Session's start date is required.")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Session's end date is required.")]
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "Session's status is required.")]
        public bool IsOpen { get; set; }
        public string Form { get; set; }
        public string Workshop { get; set; }
        public string Interview { get; set; }
    }
}
