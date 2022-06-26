using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    public class InterviewManager : IInterviewManager
    {
        private readonly RepositoryContext _context;

        public InterviewManager(RepositoryContext context)
        {
            this._context = context;
        }

        public Interview createInterview(Interview interview)
        {
            var res = _context.Interviews.Add(interview);
            _context.SaveChanges();
            return res.Entity;
        }

        public void createInterviewRange(List<Interview> interviews)
        {
            _context.Interviews.AddRange(interviews);
            _context.SaveChanges();
        }

        public Interview getInterview(int interviewId)
        => _context.Interviews.FirstOrDefault(i => i.Id == interviewId);

        private bool interviewOverlaps(Interview interview1, Interview interview2)
        {
            DateTime startDateInterview1 = interview1.InterviewDateTime;
            DateTime endDateInterview1 = startDateInterview1 + 
                new TimeSpan(0, interview1.Duration + interview1.Break, 0);

            DateTime startDateInterview2 = interview2.InterviewDateTime;
            DateTime endDateInterview2 = startDateInterview2 +
                new TimeSpan(0, interview2.Duration + interview2.Break, 0);

            return startDateInterview1 < endDateInterview2 && startDateInterview2 < endDateInterview1;
        }
        public List<Interview> getOverlappingInterviews(Interview interview)
        {
            var interviews = getSessionsInterview(interview.SessionId);

            List<Interview> overlappingInterviews = new();
            foreach (var existingInterview in interviews)
            {
                if (interviewOverlaps(interview, existingInterview))
                    overlappingInterviews.Add(existingInterview);
            }

            return overlappingInterviews;
        }

        public List<Interview> getSessionsInterview(int sessionId)
        => _context.Interviews.Where(i => i.SessionId == sessionId).OrderBy(i => i.InterviewDateTime).ToList();

        public void deleteInterview(int interviewId)
        {
            var interview = _context.Interviews.FirstOrDefault(i => i.Id == interviewId);
            _context.Remove(interview);
            _context.SaveChanges();
        }

        public Interview updateInterview(Interview updatedInterview)
        {
            var currentInterview = _context.Interviews.FirstOrDefault(i => i.Id == updatedInterview.Id);
            currentInterview.InterviewDateTime = updatedInterview.InterviewDateTime;
            currentInterview.Break = updatedInterview.Break;
            currentInterview.Duration = updatedInterview.Duration;
            _context.SaveChanges();

            return currentInterview;
        }
    }
}
