using Microsoft.EntityFrameworkCore.Migrations;

namespace PlatformaRecrutari.Data.Migrations
{
    public partial class WorkshopFeedbackTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkshopFeedbacks",
                columns: table => new
                {
                    ParticipantId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    WorkshopId = table.Column<int>(type: "int", nullable: false),
                    FeedbackGiverId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YesVotes = table.Column<int>(type: "int", nullable: false),
                    NoVotes = table.Column<int>(type: "int", nullable: false),
                    AbstainVotes = table.Column<int>(type: "int", nullable: false),
                    Feedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkshopFeedbacks", x => new { x.ParticipantId, x.WorkshopId });
                    table.ForeignKey(
                        name: "FK_WorkshopFeedbacks_Workshops_WorkshopId",
                        column: x => x.WorkshopId,
                        principalTable: "Workshops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkshopFeedbacks_WorkshopId",
                table: "WorkshopFeedbacks",
                column: "WorkshopId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkshopFeedbacks");
        }
    }
}
