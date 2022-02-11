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

        public async Task<RecruitmentSession> ChangeSessionStatus(RecruitmentSession session, bool newStatus)
        {
            var res = _context.RecruitmentSessions.FirstOrDefault(s => s.Id == session.Id);
            if (res == null)
                return null;

            if (session.IsOpen == newStatus)
                return session;
            
            res.IsOpen = newStatus;
            await _context.SaveChangesAsync();

            return res;
        }

        public async Task<RecruitmentSession> UpdateSessionInfo(RecruitmentSession newSessionData)
        {
            var res = _context.RecruitmentSessions.FirstOrDefault(s => s.Id == newSessionData.Id);
            if (res == null) return null;

            res = newSessionData;
            await _context.SaveChangesAsync();

            return res;
        }

    }
}
