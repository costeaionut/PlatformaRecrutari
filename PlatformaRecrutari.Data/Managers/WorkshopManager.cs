using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
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
    
        public List<User> getUsersEligibleForSchedule(List<User> usersWhoPassedForm, Workshop workshop)
        {
            List<User> eligibleForSchedule = new();

            foreach (var user in usersWhoPassedForm)
            {
                var res = _context.WorkshopSchedules
                    .FirstOrDefault(ws => ws.ParticipantId == user.Id && ws.WorkshopId == workshop.Id);
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
    }
}
