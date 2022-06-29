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

        public VotedParticipant AddVotedParticipant(VotedParticipant votedParticipant);
        public Voter AddVoter(Voter voter);
        public Vote AddVote(Vote vote);
    }
}
