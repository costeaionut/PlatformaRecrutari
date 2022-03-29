using Microsoft.EntityFrameworkCore.Migrations;

namespace PlatformaRecrutari.Data.Migrations
{
    public partial class SessionUpdateAddFKFromUserId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CreatorId",
                table: "RecruitmentSessions",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RecruitmentSessions_CreatorId",
                table: "RecruitmentSessions",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecruitmentSessions_Users_CreatorId",
                table: "RecruitmentSessions",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecruitmentSessions_Users_CreatorId",
                table: "RecruitmentSessions");

            migrationBuilder.DropIndex(
                name: "IX_RecruitmentSessions_CreatorId",
                table: "RecruitmentSessions");

            migrationBuilder.AlterColumn<string>(
                name: "CreatorId",
                table: "RecruitmentSessions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
