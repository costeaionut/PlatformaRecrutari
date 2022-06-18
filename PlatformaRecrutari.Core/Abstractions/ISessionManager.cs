using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface ISessionManager
    {
        Task<RecruitmentSession> CreateSession(RecruitmentSession newSession);
        Task<RecruitmentSession> ChangeSessionStatus(RecruitmentSession session);
        Task<RecruitmentSession> UpdateSessionInfo(RecruitmentSession newSessionData);
        List<RecruitmentSession> GetAllSessions();
        RecruitmentSession GetActiveSession();
        RecruitmentSession GetSessionById(int sessionId);
        List<RecruitmentSession> GetUsersSessions(string creatorId);
        void DeleteSession(RecruitmentSession sessionToDelete);
    }
}
