export class employeeServices {
  arrayEmployees = [];
  constructor() {}
  //thêm nhân viên vào mảng
  addEmployee(nhanvien) {
    this.arrayEmployees.push(nhanvien);
  }
  //xóa nhân viên theo tknv
  deleteEmployee(tknv) {
    const index = this.arrayEmployees.findIndex((item) => item.tknv === tknv);
    console.log("index: ", index);

    if (index !== -1) {
      // Xóa
      this.arrayEmployees.splice(index, 1);
    }
  }
  //cập nhật nhân viên
  updateEmployee(nhanvien) {
    const index = this.arrayEmployees.findIndex(
      (item) => item.tknv === nhanvien.tknv
    );
    if (index !== -1) {
      this.arrayEmployees[index] = nhanvien;
    }
  }
}
