export class employeeServices {
  arrayEmployees = [];
  constructor() {}

  addEmployee(nhanvien) {
    this.arrayEmployees.push(nhanvien);
  }
  deleteEmployee(tknv) {
    const index = this.arrayEmployees.findIndex((item) => item.tknv === tknv);
    console.log("index: ", index);

    if (index !== -1) {
      // Xóa
      this.arrayEmployees.splice(index, 1);
    }
  }
  //editEmployee(tknv) {}
}
