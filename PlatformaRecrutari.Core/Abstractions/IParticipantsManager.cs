using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Workshops;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IParticipantsManager
    {
        List<string> FindParticipantIdByQuestionIdRange(List<int> questionIds);
        List<FormAnswers> FindParticipantAnswers(string userId, int formId);
        FormFeedback FindParticipantFormFeedback(string userId, int formId);
        FormAnswers AddFormAnswer(FormAnswers answerToBeAdded);
        void DeleteFormAnswer(FormAnswers answerToBeDeleted);
        FormFeedback AddFormFeedback(FormFeedback feedback);
        string GetParticipantsStatus(string participantId);
        Workshop GetParticipantsWorkshop(string participantId, int sessionId);
    }
}
