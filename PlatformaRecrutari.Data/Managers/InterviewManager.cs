using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
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
    
        public InterviewSchedule addInterviewSchedule(InterviewSchedule interviewSchedule)
        {
            var newIS = _context.InterviewSchedules.Add(interviewSchedule).Entity;
            _context.SaveChanges();
            return newIS;
        }

        public InterviewSchedule getInterviewSchedule(string participantId, int interviewId)
            => _context.InterviewSchedules
            .FirstOrDefault(s => s.ParticipantId == participantId && s.InterviewId == interviewId);

        public void deleteInterviewSchedule(InterviewSchedule interviewSchedule) 
        {
            _context.InterviewSchedules.Remove(interviewSchedule);
            _context.SaveChanges();
        }

        public List<InterviewSchedule> getInterviewsScheduledUsers(int interviewId) =>
            _context.InterviewSchedules.Where(s => s.InterviewId == interviewId).ToList();
    
        public List<User> getUsersEligibleForInterviewSchedule(int sessionId)
        {
            List<int> workshopIds = _context.Workshops
                .Where(w => w.SessionId == sessionId)
                .Select(w => w.Id)
                .ToList();

            List<int> interviewIds = _context.Interviews
                .Where(w => w.SessionId == sessionId)
                .Select(w => w.Id)
                .ToList();

            List<string> usersPassedWSIds =
                _context.WorkshopFeedbacks
                .Where(wf => workshopIds.Contains(wf.WorkshopId) && wf.Status == "passed")
                .Select(wf => wf.ParticipantId).ToList();

            List<string> usersScheduledIds = _context
                .InterviewSchedules
                .Where(s => interviewIds.Contains(s.InterviewId))
                .Select(s => s.ParticipantId)
                .ToList();

            return _context.Users
                .Where(u => usersPassedWSIds.Contains(u.Id) && !usersScheduledIds.Contains(u.Id))
                .ToList();
        }
    }
}
