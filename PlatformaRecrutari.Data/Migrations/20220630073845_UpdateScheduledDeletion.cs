using Microsoft.EntityFrameworkCore.Migrations;

namespace PlatformaRecrutari.Data.Migrations
{
    public partial class UpdateScheduledDeletion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ScheduledDeletion",
                table: "Users",
                newName: "DeletionDate");

            migrationBuilder.AddColumn<bool>(
                name: "ScheduledForDeletion",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScheduledForDeletion",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "DeletionDate",
                table: "Users",
                newName: "ScheduledDeletion");
        }
    }
}
