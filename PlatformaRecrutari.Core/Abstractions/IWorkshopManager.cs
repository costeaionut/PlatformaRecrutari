using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Workshops;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IWorkshopManager
    {
        Workshop getWorkshopById(int id);
        void deleteWorkshop(Workshop deleteWorkshop);
        Workshop createWorkshop(Workshop newWorkshop);
        Workshop updateWorkshop(Workshop updatedWorkshop);
        List<Workshop> getWorkshopRangeBySessionId(int sessionId);
        List<User> getUsersEligibleForSchedule(List<User> usersWhoPassedForm, Workshop workshop);
        WorkshopSchedule createWorkshopSchedule(WorkshopSchedule newSchedule);
    }
}
