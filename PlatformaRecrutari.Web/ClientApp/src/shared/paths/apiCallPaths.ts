export enum ApiCallPaths {
  apiUrl = "https://localhost:44301/",

  loginPath = "api/Accounts/Login/",
  registerPath = "api/Accounts/Register/",
  getUserById = "api/Accounts/GetUserById/",
  getCurrentUserPath = "api/Accounts/GetCurrentUser/",

  getSessionById = "api/Session/",
  activeFormPath = "api/Session/ActiveForm/",
  UpdateFormInfo = "api/Session/UpdateForm/",
  deleteSession = "api/Session/DeleteSession/",
  getFormFromSession = "api/Session/SessionForm/",
  createSessionPath = "api/Session/CreateSession/",
  activeSessionPath = "api/Session/ActiveSession/",
  updateSessionPath = "api/Session/UpdateSessionInfo/",
  getAllSessionsPath = "api/Session/RecruitmentSessions/",

  postWorkshop = "api/Session/PostWorkshop",
  getWorkshopById = "api/Session/Workshop/",
  deleteWorkshop = "api/Session/Workshop/Delete/",
  getWorkshopsBySessionId = "api/Session/Workshops/",
  postWorkshopSchedule = "api/Session/Workshop/Schedule",
  getUsersEligibleForSchedule = "api/Session/Workshop/ParticipantsToBeScheduled/",
  getWorkshopParticipantsByWSId = "api/Session/Workshop/Scheduled/Participants/",
  getWorkshopVolunteersByWSId = "api/Session/Workshop/Scheduled/Volunteers/",
  isParticipantScheduled = "api/Session/Workshop/IsScheduled/",
  getWorkshopCDDDByWSId = "api/Session/Workshop/Scheduled/CDDD/",
  getWorkshopStatusSessionIdParticipantId = "api/Session/Workshop/Status/",
  getVolunteerWhoScheduledRange = "api/Session/Workshop/Scheduled/WhoScheduled/",
  deleteScheduleSlot = "api/Session/Workshop/Schedule/DeleteSchedule/",

  addFormAnswrs = "api/Participants/AddFormResponse/",
  postFormFeedback = "api/Participants/PostFormFeedback",
  getParticipantAnswer = "api/Participants/FindParticipantAnswer/",
  getPaticipantStatus = "api/Participants/FindParticipantStatus/",
  getSessionParticipants = "api/Participants/GetSessionsParticipants/",

  getWorkshopFeedback = "api/Session/Workshop/Feedback/",
  postWorkshopFeedback = "api/Session/Workshop/Feedback/Create/",
  deleteWorkshopFeedback = "api/Session/Workshop/Feedback/Delete/",
  getWorkshopFeedbackBySessionId = "api/Session/Workshop/FeedbackBySession/",
  editWorkshopFeedback = "api/Session/Workshop/Feedback/Edit/",

  postInterview = "api/Session/Interview/Create",
  postInterviewRange = "api/Session/Interview/CreateRange",
  getInterviewById = "api/Session/Interview/",
  getInterviewBySessionId = "api/Session/Interviews/",
  deleteInterview = "api/Session/Interview/Delete/",
  editInterview = "api/Session/Interview/Update/",

  postInterviewSchedule = "api/Session/Interview/Schedule/Create/",
  deleteInterviewSchedule = "api/Session/Interview/Schedule/Delete/",
  getInterviewEligibleUsers = "api/Session/Interview/Schedule/GetEligibleCandidates/",
}
