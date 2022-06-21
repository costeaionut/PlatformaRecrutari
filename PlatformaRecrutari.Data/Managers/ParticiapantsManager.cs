using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    class ParticiapantsManager : IParticipantsManager
    {
        private readonly RepositoryContext _context;

        public ParticiapantsManager(RepositoryContext context)
        {
            _context = context;
        }

        public FormAnswers AddFormAnswer(FormAnswers answerToBeAdded)
        {
            var res = this._context.FormAnswers.Add(answerToBeAdded);
            _context.SaveChanges();

            return res.Entity;
        }
    
        public void DeleteFormAnswer(FormAnswers answerToBeDeleted) {
            this._context.FormAnswers.Remove(answerToBeDeleted);
            this._context.SaveChanges();
        }

        public List<string> FindParticipantIdByQuestionIdRange(List<int> questionIds) =>
            this._context.FormAnswers
                .Where(fa =>questionIds.Contains(fa.QuestionId))
                .Select(fa => fa.CandidateId)
                .Distinct()
                .ToList();

        public List<FormAnswers> FindParticipantAnswers(string userId, int formId) {
            List<int> questionIds = new(); 
            questionIds.AddRange(
                this._context.SimpleQuestions
                .Where(sq => sq.FormId == formId)
                .Select(sq => sq.Id)
                .Distinct()
                .ToList()
            );
            
            questionIds.AddRange(
                this._context.GridQuestions
                .Where(gq => gq.Id == formId && !questionIds.Contains(gq.Id))
                .Select(gq => gq.Id)
                .Distinct()
                .ToList()
            );

            return this._context.FormAnswers
                .Where(fa => fa.CandidateId == userId && questionIds.Contains(fa.QuestionId))
                .ToList();
        }

        public FormFeedback FindParticipantFormFeedback(string userId, int formId) =>
            this._context.FormFeedbacks
            .FirstOrDefault(ff => ff.CandidateId == userId && ff.FormId == formId);

        public FormFeedback AddFormFeedback(FormFeedback feedback)
        {
            var newFeedback = this._context.FormFeedbacks.Add(feedback);
            this._context.SaveChanges();

            return newFeedback.Entity;
        }
    }
}
