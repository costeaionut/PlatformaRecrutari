using Microsoft.EntityFrameworkCore.Migrations;

namespace PlatformaRecrutari.Data.Migrations
{
    public partial class AddNewDbSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InterviewSchedule_Interviews_InterviewId",
                table: "InterviewSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_InterviewSchedule_Users_VolunteerId",
                table: "InterviewSchedule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InterviewSchedule",
                table: "InterviewSchedule");

            migrationBuilder.RenameTable(
                name: "InterviewSchedule",
                newName: "InterviewSchedules");

            migrationBuilder.RenameIndex(
                name: "IX_InterviewSchedule_VolunteerId",
                table: "InterviewSchedules",
                newName: "IX_InterviewSchedules_VolunteerId");

            migrationBuilder.RenameIndex(
                name: "IX_InterviewSchedule_InterviewId",
                table: "InterviewSchedules",
                newName: "IX_InterviewSchedules_InterviewId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InterviewSchedules",
                table: "InterviewSchedules",
                columns: new[] { "ParticipantId", "InterviewId" });

            migrationBuilder.AddForeignKey(
                name: "FK_InterviewSchedules_Interviews_InterviewId",
                table: "InterviewSchedules",
                column: "InterviewId",
                principalTable: "Interviews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InterviewSchedules_Users_VolunteerId",
                table: "InterviewSchedules",
                column: "VolunteerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InterviewSchedules_Interviews_InterviewId",
                table: "InterviewSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_InterviewSchedules_Users_VolunteerId",
                table: "InterviewSchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InterviewSchedules",
                table: "InterviewSchedules");

            migrationBuilder.RenameTable(
                name: "InterviewSchedules",
                newName: "InterviewSchedule");

            migrationBuilder.RenameIndex(
                name: "IX_InterviewSchedules_VolunteerId",
                table: "InterviewSchedule",
                newName: "IX_InterviewSchedule_VolunteerId");

            migrationBuilder.RenameIndex(
                name: "IX_InterviewSchedules_InterviewId",
                table: "InterviewSchedule",
                newName: "IX_InterviewSchedule_InterviewId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InterviewSchedule",
                table: "InterviewSchedule",
                columns: new[] { "ParticipantId", "InterviewId" });

            migrationBuilder.AddForeignKey(
                name: "FK_InterviewSchedule_Interviews_InterviewId",
                table: "InterviewSchedule",
                column: "InterviewId",
                principalTable: "Interviews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InterviewSchedule_Users_VolunteerId",
                table: "InterviewSchedule",
                column: "VolunteerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
