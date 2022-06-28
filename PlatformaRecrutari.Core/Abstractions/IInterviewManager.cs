using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
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
        InterviewSchedule addInterviewSchedule(InterviewSchedule interviewSchedule);
        public List<InterviewSchedule> getInterviewsScheduledUsers(int interviewId);
        InterviewSchedule getInterviewSchedule(string participantId, int interviewId);
        void deleteInterviewSchedule(InterviewSchedule interviewSchedule);

        List<User> getUsersEligibleForInterviewSchedule(int sessionId);

        InterviewFeedback getInterviewsFeedback(int interviewId);
        InterviewFeedback addInterviewFeedback(InterviewFeedback interviewFeedback);
        InterviewFeedback getParticipantFeedback(string participantId, int sessionId);

    }
}
