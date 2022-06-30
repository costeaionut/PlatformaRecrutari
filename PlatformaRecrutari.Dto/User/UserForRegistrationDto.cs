using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.User
{
    public class UserForRegistrationDto
    {
        [Required(ErrorMessage = "Firstname is required.")]
        public string FirstName { get; set; }
        
        [Required(ErrorMessage = "Lastname is required.")]
        public string LastName { get; set; }
        
        [Required(ErrorMessage = "Phone Number is required")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Facebook link is required")]
        public string Facebook { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Must select a role for the user.")]
        public int RoleId { get; set; }

        [Required]
        public string Profile { get; set; }

        [Required]
        public string Class { get; set; }
    }
}
