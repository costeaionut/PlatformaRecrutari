using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FinalVote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    public class FinalVoteManager : IFinalVoteManager
    {
        private readonly RepositoryContext _context;
        public FinalVoteManager(RepositoryContext context)
        {
            this._context = context;
        }

        public Vote AddVote(Vote vote)
        {
            var newVote = _context.Votes.Add(vote);
            _context.SaveChanges();
            return newVote.Entity;
        }

        public VotedParticipant AddVotedParticipant(VotedParticipant votedParticipant)
        {
            var newParticipant = _context.VotedParticipants.Add(votedParticipant);
            _context.SaveChanges();
            return newParticipant.Entity;
        }

        public Voter AddVoter(Voter voter)
        {
            var newVoter = _context.Voters.Add(voter);
            _context.SaveChanges();
            return newVoter.Entity;
        }

        public List<Vote> GetParticipantVotes(int sessionId, string participantId)
            => _context.Votes.Where(v => v.ParticipantId == participantId && v.SessionId == sessionId).ToList();

        public List<VotedParticipant> GetVotedParticipantsBySessionId(int sessionId)
            => _context.VotedParticipants.Where(vp => vp.SessionId == sessionId).ToList();

        public VotedParticipant GetParticipantWaitingForAnswer(int sessionId)
            => _context.VotedParticipants.FirstOrDefault(vp => vp.SessionId == sessionId && vp.Status == "Waiting");

        public Vote GetVolunteerVote(int sessionId, string volunteerId ,string participantId)
            => _context.Votes
            .FirstOrDefault(v => v.SessionId == sessionId && v.VoterId == volunteerId && v.ParticipantId == participantId);

        public List<Voter> GetVotersBySessionId(int sessionId)
            => _context.Voters.Where(v => v.SessionId == sessionId).ToList();

        public Voter UpdateVoterStatus(Voter voter)
        {
            var oldVoter = _context.Voters
                .FirstOrDefault(v => v.VolunteerId == voter.VolunteerId && v.SessionId == voter.SessionId);
            oldVoter.Status = voter.Status;

            _context.SaveChanges();
            return oldVoter;
        }

        public Voter GetVoter(string volunteerId, int sessionId)
            => _context.Voters.FirstOrDefault(v => v.SessionId == sessionId && v.VolunteerId == volunteerId);

        public void UpdateVotedParticipant(string participantId, int sessionId, string status) {
            var oldVotedParticipants = _context.VotedParticipants
                .FirstOrDefault(vp => vp.ParticipantId == participantId && vp.SessionId == sessionId);
            oldVotedParticipants.Status = status;
            _context.SaveChanges();
        }

        public List<Vote> GetSessionVotes(int sessionId)
        => _context.Votes.Where(v => v.SessionId == sessionId).ToList();

        public VotedParticipant GetVotedParticipant(int sessionId, string participantId)
         => _context.VotedParticipants.FirstOrDefault(vp => vp.ParticipantId == participantId && vp.SessionId == sessionId);

        public void DeleteVotedParticipant(VotedParticipant votedParticipant) {
            _context.VotedParticipants.Remove(votedParticipant);
            _context.SaveChanges();
        }

        public void DeleteVote(Vote vote)
        {
            _context.Votes.Remove(vote);
            _context.SaveChanges();
        }
    }
}
