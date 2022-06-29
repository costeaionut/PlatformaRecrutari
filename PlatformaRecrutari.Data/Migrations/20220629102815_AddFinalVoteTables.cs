using Microsoft.EntityFrameworkCore.Migrations;

namespace PlatformaRecrutari.Data.Migrations
{
    public partial class AddFinalVoteTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VotedParticipants",
                columns: table => new
                {
                    ParticipantId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VotedParticipants", x => new { x.ParticipantId, x.SessionId });
                    table.ForeignKey(
                        name: "FK_VotedParticipants_RecruitmentSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "RecruitmentSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VotedParticipants_Users_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Voters",
                columns: table => new
                {
                    VolunteerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voters", x => new { x.VolunteerId, x.SessionId });
                    table.ForeignKey(
                        name: "FK_Voters_RecruitmentSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "RecruitmentSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Voters_Users_VolunteerId",
                        column: x => x.VolunteerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Votes",
                columns: table => new
                {
                    VoterId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ParticipantId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    Response = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Votes", x => new { x.VoterId, x.ParticipantId, x.SessionId });
                    table.ForeignKey(
                        name: "FK_Votes_RecruitmentSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "RecruitmentSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Votes_Users_VoterId",
                        column: x => x.VoterId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_VotedParticipants_SessionId",
                table: "VotedParticipants",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Voters_SessionId",
                table: "Voters",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Votes_SessionId",
                table: "Votes",
                column: "SessionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VotedParticipants");

            migrationBuilder.DropTable(
                name: "Voters");

            migrationBuilder.DropTable(
                name: "Votes");
        }
    }
}
