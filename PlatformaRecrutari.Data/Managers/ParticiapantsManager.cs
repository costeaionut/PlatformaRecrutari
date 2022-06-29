using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Workshops;
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

        public string GetParticipantsStatus(string participantId)
        {
            var formFeedback = _context.FormFeedbacks.FirstOrDefault(fs => fs.CandidateId == participantId);
            if (formFeedback == null) return "Waiting for form feedback";

            var form = _context.Forms.FirstOrDefault(f => f.Id == formFeedback.FormId);
            var workshops = _context.Workshops.Where(w => w.SessionId == form.SessionId).ToList();
            var workshopIds = workshops.Select(w => w.Id).ToList();

            if (formFeedback.Status == StatusType.RejectedForm) return "Rejected at form stage";
            if (formFeedback.Status == StatusType.PassedForm) {
                if (workshops.Count == 0) return "Passed form stage";
                var workshopSchedule = _context.WorkshopSchedules
                    .FirstOrDefault(ws => ws.ParticipantId == participantId && workshopIds.Contains(ws.WorkshopId));
                if (workshopSchedule == null) return "Not scheduled for workshop";
                else
                {
                    var currentWorkshop = workshops.FirstOrDefault(w => w.Id == workshopSchedule.WorkshopId);
                    if (DateTime.Now < currentWorkshop.WorkshopDate || 
                        (currentWorkshop.WorkshopDate < DateTime.Now && 
                        DateTime.Now < (currentWorkshop.WorkshopDate + new TimeSpan(4, 0, 0)))) 
                        return "Scheduled for workshop";
                    else
                    {
                        var workshopFeedback = _context.WorkshopFeedbacks
                            .FirstOrDefault(wf => wf.ParticipantId == participantId && workshopIds.Contains(wf.WorkshopId));
                        if (workshopFeedback == null) return "Waiting for workshop feedback";
                        if (workshopFeedback.Status == "rejected") return "Rejected at workshop stage";
                        if(workshopFeedback.Status == "passed") {
                            var interviews = _context.Interviews
                                .Where(i => i.SessionId == currentWorkshop.SessionId).ToList();
                            var interviewsIds = interviews.Select(i => i.Id).ToList();

                            if(interviews.Count == 0) return "Passed workshop stage";
                            var interviewSchedule = _context.InterviewSchedules
                                .FirstOrDefault(s => s.ParticipantId == participantId && interviewsIds.Contains(s.InterviewId));
                            if (interviewSchedule == null) return "Not scheduled for interview";
                            var currentInterview = interviews.FirstOrDefault(i => i.Id == interviewSchedule.InterviewId);
                            if (DateTime.Now < currentInterview.InterviewDateTime) return "Scheduled for interview";
                            else
                            {
                                var interviewFeedback = _context.InterviewFeedbacks
                                    .FirstOrDefault(f => f.InterviewId == currentInterview.Id);
                                if (interviewFeedback == null) return "Waiting for interview feedback";
                                else return "Ready for final vote";
                            }
                        }
                    }
                }
            }
            return "ErrorNotFound";
        }

        public Workshop GetParticipantsWorkshop(string participantId, int sessionId)
        {
            var workshopsIds = _context.Workshops.Where(w => w.SessionId == sessionId).Select(w => w.Id).ToList();
            var participantsWorkshop = _context.WorkshopSchedules
                .FirstOrDefault(s => s.ParticipantId == participantId && workshopsIds.Contains(s.WorkshopId));
            return _context.Workshops.FirstOrDefault(w => w.Id == participantsWorkshop.WorkshopId);
        }
    }
}
