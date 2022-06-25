using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Workshops;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    public class WorkshopManager : IWorkshopManager
    {

        private readonly RepositoryContext _context;

        public WorkshopManager(RepositoryContext context)
        {
            this._context = context;
        }

        public List<Workshop> getWorkshopRangeBySessionId(int sessionId)
            => _context.Workshops.Where(w=> w.SessionId == sessionId).ToList();

        public Workshop createWorkshop(Workshop newWorkshop)
        {
            var res = _context.Add(newWorkshop);
            _context.SaveChanges();

            return res.Entity;
        }

        public Workshop getWorkshopById(int id) => _context.Workshops.FirstOrDefault(w => w.Id == id);
    
        public Workshop updateWorkshop(Workshop updatedWorkshop) {
            var entityToBeUpdated = _context.Workshops.FirstOrDefault(w => w.Id == updatedWorkshop.Id);
            
            entityToBeUpdated.Location = updatedWorkshop.Location;
            entityToBeUpdated.Departments = updatedWorkshop.Departments;
            entityToBeUpdated.WorkshopDate = updatedWorkshop.WorkshopDate;
            entityToBeUpdated.NumberOfDirectors = updatedWorkshop.NumberOfDirectors;
            entityToBeUpdated.NumberOfVolunteers = updatedWorkshop.NumberOfVolunteers;
            entityToBeUpdated.NumberOfBoardMembers= updatedWorkshop.NumberOfBoardMembers;
            entityToBeUpdated.NumberOfParticipants = updatedWorkshop.NumberOfParticipants;

            _context.SaveChanges();
            return entityToBeUpdated;
        }

        public void deleteWorkshop(Workshop deleteWorkshop) {
            _context.Workshops.Remove(deleteWorkshop);
            _context.SaveChanges();
        }
    
        public List<User> getUsersEligibleForSchedule(
            List<User> usersWhoPassedForm, 
            RecruitmentSession workshopsSession
        )
        {
            List<User> eligibleForSchedule = new();
            List<int> sessionsWorkshopIds = _context.Workshops
                .Where(w => w.SessionId == workshopsSession.Id)
                .Select(w => w.Id)
                .ToList();

            foreach (var user in usersWhoPassedForm)
            {
                var res = _context.WorkshopSchedules
                    .FirstOrDefault(
                    ws => ws.ParticipantId == user.Id &&
                    sessionsWorkshopIds.Contains(ws.WorkshopId) && 
                    ws.Type == ScheduleTypes.Participant);

                if (res == null)
                    eligibleForSchedule.Add(user);
            }

            return eligibleForSchedule;
        }
        
        public WorkshopSchedule createWorkshopSchedule(WorkshopSchedule newSchedule)
        {
            var res = this._context.WorkshopSchedules.Add(newSchedule);
            this._context.SaveChanges();
            return res.Entity;
        }
    
        public List<User> getWorkshopParticipants(Workshop workshop) {
            List<User> participants = new();

            var participantsIds = 
                _context.WorkshopSchedules
                .Where(ws => ws.WorkshopId == workshop.Id && ws.Type == ScheduleTypes.Participant)
                .Select(ws => ws.ParticipantId)
                .ToList();

            participants = _context.Users.Where(u => participantsIds.Contains(u.Id)).ToList();

            return participants;
        }
    
        public List<User> getWorkshopVolunteers(Workshop workshop) {
            List<User> volunteers = new();

            var volunteersIds =
                _context.WorkshopSchedules
                .Where(ws => ws.WorkshopId == workshop.Id && ws.Type == ScheduleTypes.Volunteer)
                .Select(ws => ws.ParticipantId)
                .ToList();

            volunteers = _context.Users.Where(u => volunteersIds.Contains(u.Id)).ToList();

            return volunteers;
        }

        public List<User> getWorkshopScheduledCDDD(Workshop workshop) {
            List<User> cddd = new();

            var cdddIds =
                _context.WorkshopSchedules
                .Where(ws => ws.WorkshopId == workshop.Id && 
                       (ws.Type == ScheduleTypes.CD || ws.Type == ScheduleTypes.Director))
                .Select(ws => ws.ParticipantId)
                .ToList();

            cddd = _context.Users.Where(u => cdddIds.Contains(u.Id)).ToList();

            return cddd;
        }

        public bool isParticipantScheduled(int sessionId, string userId)
        {
            var workshopsIds = this._context.Workshops.Where(w => w.SessionId == sessionId).Select(w => w.Id).ToList();
            var res = this._context.WorkshopSchedules
                .Where(ws => workshopsIds.Contains(ws.WorkshopId) && ws.ParticipantId == userId)
                .FirstOrDefault();
            return res != null; 
        }

        public string getWorkshopStatus(int sessionId, string participantId)
        {
            var workshopIds = this._context.Workshops
                .Where(ws => ws.SessionId == sessionId)
                .Select(ws => ws.Id)
                .ToList();

            var workshopId = this._context.WorkshopSchedules
                .FirstOrDefault(ws => ws.ParticipantId == participantId && workshopIds.Contains(ws.WorkshopId))
                .WorkshopId;

            var workshop = this._context.Workshops.FirstOrDefault(w => w.Id == workshopId);

            if (DateTime.Now < workshop.WorkshopDate)
                return "Upcoming";
            if (workshop.WorkshopDate < DateTime.Now && DateTime.Now < workshop.WorkshopDate.AddHours(4))
                return "Active";

            return "Finished";

        }

        public List<User> getVolunteerWhoScheduledParticipants(List<Workshop> workshops, List<User> participants)
        {
            List<User> schedulers = new();
            List<int> workshopIds = workshops.Select(w => w.Id).ToList();
            foreach (var participant in participants)
            {
                var schedulerId = _context.WorkshopSchedules
                    .FirstOrDefault(ws => ws.ParticipantId == participant.Id && workshopIds.Contains(ws.WorkshopId))
                    .VolunteerId;
                schedulers.Add(_context.Users.FirstOrDefault(u => u.Id == schedulerId));
            }
            return schedulers;
        }
    
        public void deleteParticipantScheduleSlot(string participantId, int workshopId) {
            var scheduleToDelete = _context.WorkshopSchedules
                .FirstOrDefault(ws => ws.ParticipantId == participantId && ws.WorkshopId == workshopId);
            _context.WorkshopSchedules.Remove(scheduleToDelete);
            _context.SaveChanges();
        }
    }
}
