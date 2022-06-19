export enum ApiCallPaths {
  apiUrl = "https://localhost:44301/",
  registerPath = "api/Accounts/Register/",
  loginPath = "api/Accounts/Login/",
  getUserById = "api/Accounts/GetUserById/",
  getCurrentUserPath = "api/Accounts/GetCurrentUser/",

  createSessionPath = "api/Session/CreateSession/",
  activeFormPath = "api/Session/ActiveSession/",
  getAllSessionsPath = "api/Session/RecruitmentSessions/",
  updateSessionPath = "api/Session/UpdateSessionInfo/",
  getFormFromSession = "api/Session/SessionForm/",
  getSessionById = "api/Session/",
  deleteSession = "api/Session/DeleteSession/",

  addFormAnswrs = "api/Participants/AddFormResponse/",
  getSessionParticipants = "api/Participants/GetSessionsParticipants/",
}
