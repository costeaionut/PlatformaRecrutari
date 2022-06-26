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
        
        public DbSet<Form> Forms { get; set; }
        public DbSet<Workshop> Workshops { get; set; }
        public DbSet<FormAnswers> FormAnswers { get; set; }
        public DbSet<FormFeedback> FormFeedbacks { get; set; }
        public DbSet<InputsOption> InputsOptions { get; set; }
        public DbSet<GridQuestion> GridQuestions { get; set; }
        public DbSet<BaseQuestion> SimpleQuestions { get; set; }
        public DbSet<WorkshopFeedback> WorkshopFeedbacks { get; set; }
        public DbSet<WorkshopSchedule> WorkshopSchedules { get; set; }
        public DbSet<RecruitmentSession> RecruitmentSessions { get; set; }

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
        }
    }
}