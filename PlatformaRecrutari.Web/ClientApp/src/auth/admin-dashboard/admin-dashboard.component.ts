import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { AdminService } from "src/shared/services/admin-service.service";
import { AuthenticationService } from "src/shared/services/authentication.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private authService: AuthenticationService,
    private modalService: NgbModal
  ) {}

  users: UserInfo[];
  currentUser: UserInfo;

  async ngOnInit() {
    this.users = await this.adminService.getAllUsers().toPromise();
    this.currentUser = await this.authService.getCurrentUser().toPromise();
  }
  editedUser: UserInfo;
  openUserEditModal(userIndex, template) {
    this.editedUser = this.users[userIndex];
    this.modalService.open(template, { size: "lg", centered: true });
  }
  saveProfileChanges() {
    Swal.fire({
      title: "Done editing?",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.authService.updateUser(this.editedUser).subscribe((res) => {
          Swal.fire({
            title: "User updated successfully",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(async (_) => {
            this.users = await this.adminService.getAllUsers().toPromise();
            this.modalService.dismissAll();
          });
        });
    });
  }
}
