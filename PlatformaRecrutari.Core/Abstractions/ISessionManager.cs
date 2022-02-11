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
        Task<RecruitmentSession> ChangeSessionStatus(RecruitmentSession session, bool newStatus);
        Task<RecruitmentSession> UpdateSessionInfo(RecruitmentSession newSessionData);
    }
}
