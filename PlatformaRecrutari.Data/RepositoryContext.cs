using PlatformaRecrutari.Core.BusinessObjects;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;

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

            modelBuilder.Entity<RecruitmentSession>()
                .Property(s => s.Form).IsRequired(false);

            modelBuilder.Entity<RecruitmentSession>()
                .Property(s => s.Workshop).IsRequired(false);

            modelBuilder.Entity<RecruitmentSession>()
                .Property(s => s.Interview).IsRequired(false);
        }
    }
}