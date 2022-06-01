using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    public class SessionsManager : ISessionManager
    {
        private readonly RepositoryContext _context;

        public SessionsManager(RepositoryContext context)
        {
            _context = context;
        }

        public async Task<RecruitmentSession> CreateSession(RecruitmentSession newSession)
        {
            var res = _context.RecruitmentSessions.Add(newSession);
            await _context.SaveChangesAsync();

            return res.Entity;
        } 

        public async Task<RecruitmentSession> ChangeSessionStatus(RecruitmentSession session)
        {
            var res = _context.RecruitmentSessions.FirstOrDefault(s => s.Id == session.Id);
            if (res == null)
                return null;

            res.IsOpen = !res.IsOpen;
            await _context.SaveChangesAsync();

            return res;
        }

        public async Task<RecruitmentSession> UpdateSessionInfo(RecruitmentSession newSessionData)
        {
            var res = _context.RecruitmentSessions.FirstOrDefault(s => s.Id == newSessionData.Id);
            if (res == null) return null;

            setSessionInfo(ref res, newSessionData);
            await _context.SaveChangesAsync();

            return res;
        }

        private void setSessionInfo(ref RecruitmentSession originalData, RecruitmentSession newData)
        {
            originalData.Id = newData.Id;
            originalData.Title = newData.Title;
            originalData.StartDate = newData.StartDate;
            originalData.EndDate = newData.EndDate;
            originalData.IsOpen = newData.IsOpen;
        }

    }
}
