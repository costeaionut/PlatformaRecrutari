using Microsoft.EntityFrameworkCore.Migrations;

namespace PlatformaRecrutari.Data.Migrations
{
    public partial class AddFormAnswers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FormAnswers",
                columns: table => new
                {
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    CandidateId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAnswers", x => new { x.QuestionId, x.CandidateId });
                    table.ForeignKey(
                        name: "FK_FormAnswers_SimpleQuestions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "SimpleQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAnswers_Users_CandidateId",
                        column: x => x.CandidateId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormAnswers_CandidateId",
                table: "FormAnswers",
                column: "CandidateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormAnswers");
        }
    }
}
