using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IParticipantsManager
    {
        FormAnswers AddFormAnswer(FormAnswers answerToBeAdded);
        void DeleteFormAnswer(FormAnswers answerToBeDeleted);
        List<string> FindParticipantIdByQuestionIdRange(List<int> questionIds);
        List<FormAnswers> FindParticipantAnswers(string userId, int formId);
        FormFeedback FindParticipantFormFeedback(string userId, int formId);
        FormFeedback AddFormFeedback(FormFeedback feedback);
    }
}
