using PlatformaRecrutari.Core.BusinessObjects;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Workshops;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Interviews;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FinalVote;

namespace PlatformaRecrutari.Data
{
    public class RepositoryContext : DbContext
    {
        public RepositoryContext(DbContextOptions options)
        : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        
        public DbSet<RecruitmentSession> RecruitmentSessions { get; set; }
        
        public DbSet<Form> Forms { get; set; }
        public DbSet<FormAnswers> FormAnswers { get; set; }
        public DbSet<GridQuestion> GridQuestions { get; set; }
        public DbSet<FormFeedback> FormFeedbacks { get; set; }
        public DbSet<InputsOption> InputsOptions { get; set; }
        public DbSet<BaseQuestion> SimpleQuestions { get; set; }
        

        public DbSet<Workshop> Workshops { get; set; }
        public DbSet<WorkshopFeedback> WorkshopFeedbacks { get; set; }
        public DbSet<WorkshopSchedule> WorkshopSchedules { get; set; }

        public DbSet<Interview> Interviews { get; set; }
        public DbSet<InterviewFeedback> InterviewFeedbacks { get; set; }
        public DbSet<InterviewSchedule> InterviewSchedules { get; set; }
        
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Voter> Voters { get; set; }
        public DbSet<VotedParticipant> VotedParticipants { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne<Role>()
                .WithMany()
                .HasForeignKey(u => u.RoleId);

            modelBuilder.Entity<RecruitmentSession>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(u => u.CreatorId);

            modelBuilder.Entity<Form>()
                .HasOne<RecruitmentSession>()
                .WithMany()
                .HasForeignKey(f => f.SessionId);

            modelBuilder.Entity<BaseQuestion>()
                .HasOne<Form>()
                .WithMany()
                .HasForeignKey(bq => bq.FormId);

            modelBuilder.Entity<GridQuestion>()
                .HasOne<Form>()
                .WithMany()
                .HasForeignKey(gq => gq.FormId);

            modelBuilder.Entity<FormAnswers>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(fa => fa.CandidateId);

            modelBuilder.Entity<FormAnswers>()
                .Property(fa => fa.Answer)
                .IsRequired();

            modelBuilder.Entity<FormAnswers>()
                .HasOne<BaseQuestion>()
                .WithMany()
                .HasForeignKey(fa => fa.QuestionId);

            modelBuilder.Entity<FormAnswers>()
                .HasKey(k => new { k.QuestionId, k.CandidateId });

            modelBuilder.Entity<FormFeedback>()
                .HasKey(ff => new { ff.CandidateId, ff.FormId });

            modelBuilder.Entity<FormFeedback>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(ff => ff.CandidateId);

            modelBuilder.Entity<FormFeedback>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(ff => ff.FeedbackGiverId);

            modelBuilder.Entity<FormFeedback>()
                .HasOne<Form>()
                .WithMany()
                .HasForeignKey(ff => ff.FormId);

            modelBuilder.Entity<FormFeedback>()
                .Property(ff=> ff.Status)
                .IsRequired(true);

            modelBuilder.Entity<Workshop>()
                .HasOne<RecruitmentSession>()
                .WithMany()
                .HasForeignKey(w => w.SessionId);

            modelBuilder.Entity<WorkshopSchedule>()
                .HasKey(ws => new { ws.ParticipantId, ws.WorkshopId});

            modelBuilder.Entity<WorkshopFeedback>()
                .HasKey(wf => new { wf.ParticipantId, wf.WorkshopId });

            modelBuilder.Entity<WorkshopFeedback>()
                .HasOne<Workshop>()
                .WithMany()
                .HasForeignKey(wf => wf.WorkshopId);

            modelBuilder.Entity<Interview>()
                .HasOne<RecruitmentSession>()
                .WithMany()
                .HasForeignKey(i => i.SessionId);

            modelBuilder.Entity<InterviewSchedule>()
                .HasKey(s => new { s.ParticipantId, s.InterviewId });

            modelBuilder.Entity<InterviewSchedule>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.ParticipantId).OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(s => s.VolunteerId).OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<InterviewSchedule>()
                .HasOne<Interview>()
                .WithMany()
                .HasForeignKey(i => i.InterviewId);

            modelBuilder.Entity<InterviewFeedback>()
                .HasOne<Interview>()
                .WithMany()
                .HasForeignKey(i => i.InterviewId);

            modelBuilder.Entity<Vote>()
                .HasKey(v => new { v.VoterId, v.ParticipantId, v.SessionId });

            modelBuilder.Entity<Voter>()
                .HasKey(v => new { v.VolunteerId, v.SessionId });

            modelBuilder.Entity<VotedParticipant>()
                .HasKey(vp => new { vp.ParticipantId, vp.SessionId });

            modelBuilder.Entity<Vote>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(v => v.ParticipantId).OnDelete(DeleteBehavior.NoAction)
                .HasForeignKey(v => v.VoterId).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Vote>()
                .HasOne<RecruitmentSession>()
                .WithMany()
                .HasForeignKey(v => v.SessionId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Voter>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(v => v.VolunteerId).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Voter>()
                .HasOne<RecruitmentSession>()
                .WithMany()
                .HasForeignKey(v => v.SessionId);

            modelBuilder.Entity<VotedParticipant>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(vp => vp.ParticipantId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VotedParticipant>()
                .HasOne<RecruitmentSession>()
                .WithMany()
                .HasForeignKey(vp => vp.SessionId);

        }
    }
}