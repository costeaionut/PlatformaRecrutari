using PlatformaRecrutari.Dto.User;

namespace PlatformaRecrutari.Dto.Sessions.Interviews
{
    public class InterviewScheduleDto
    {
        public int InterviewId { get; set; }
        public string SchedulerId { get; set; }
        public UserDto Participant { get; set; }
        public UserDto HR { get; set; }
        public UserDto CD { get; set; }
        public UserDto DD { get; set; }
    }
}