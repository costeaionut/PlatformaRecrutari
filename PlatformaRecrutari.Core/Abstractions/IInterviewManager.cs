using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IInterviewManager
    {
        Interview getInterview(int interviewId);
        List<Interview> getSessionsInterview(int sessionId);
        List<Interview> getOverlappingInterviews(Interview interview);

        Interview createInterview(Interview interview);
        void createInterviewRange(List<Interview> interviews);

        void deleteInterview(int interviewId);
        Interview updateInterview(Interview updatedInterview);
    }
}
