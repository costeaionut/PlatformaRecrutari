using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Responses.ParticipantStatus
{
    public class ParticipantStatusDto
    {
        public ParticipantStatusDto(String _participantId, string _participantStatus)
        {
            this.ParticipantId = _participantId;
            this.ParticipantStatus = _participantStatus;
        }
        
        public String ParticipantId { get; set; }
        public String ParticipantStatus { get; set; }
    }
}
