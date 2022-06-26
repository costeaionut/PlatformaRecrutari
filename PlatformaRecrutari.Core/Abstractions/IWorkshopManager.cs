using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
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
        List<User> getWorkshopVolunteers(Workshop workshop);
        List<User> getWorkshopParticipants(Workshop workshop);
        List<User> getWorkshopScheduledCDDD(Workshop workshop);
        List<Workshop> getWorkshopRangeBySessionId(int sessionId);
        bool isParticipantScheduled(int sessionId, string userId);
        void deleteUserFeedback(WorkshopFeedback feedbackToDelete);
        string getWorkshopStatus(int sessionId, string participantId);
        WorkshopFeedback createWrokshopFeedback(WorkshopFeedback newFeedback);
        WorkshopSchedule createWorkshopSchedule(WorkshopSchedule newSchedule);
        void deleteParticipantScheduleSlot(string participantId, int workshopId);
        WorkshopFeedback getUsersFeedbackForWorkshop(string participantId, int workshopId);
        WorkshopFeedback GetWorkshopFeedbackBySessionId(string participantId, int sessionId);
        List<User> getVolunteerWhoScheduledParticipants(List<Workshop> workshops, List<User> participants);
        List<User> getUsersEligibleForSchedule(List<User> usersWhoPassedForm, RecruitmentSession workshopsSession);
    }
}
