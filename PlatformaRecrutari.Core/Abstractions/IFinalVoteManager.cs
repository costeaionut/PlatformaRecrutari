using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FinalVote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.Abstractions
{
    public interface IFinalVoteManager
    {
        public List<VotedParticipant> GetVotedParticipantsBySessionId(int sessionId);
        public List<Vote> GetParticipantVotes(int sessionId, string participantId);
        VotedParticipant GetParticipantWaitingForAnswer(int sessionId);
        public List<Voter> GetVotersBySessionId(int sessionId);
        Voter GetVoter(string volunteerId, int sessionId);
        Vote GetVolunteerVote(int sessionId, string volunteerId, string participantId);

        VotedParticipant GetVotedParticipant(int sessionId, string participantId);
        void DeleteVotedParticipant(VotedParticipant votedParticipant);
        public Voter UpdateVoterStatus(Voter voter);
        void DeleteVote(Vote vote);

        public VotedParticipant AddVotedParticipant(VotedParticipant votedParticipant);
        public Voter AddVoter(Voter voter);
        public Vote AddVote(Vote vote);

        void UpdateVotedParticipant(string participantId, int sessionId, string status);
        public List<Vote> GetSessionVotes(int sessionId);
    }
}
