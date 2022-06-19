using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
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
    }
}
