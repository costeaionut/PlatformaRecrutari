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
        public DbSet<InputsOption> InputsOptions { get; set; }
        public DbSet<GridQuestion> GridQuestions { get; set; }
        public DbSet<BaseQuestion> SimpleQuestions { get; set; }
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
        }
    }
}