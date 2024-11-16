import { NhanVien } from "./NhanVien.js";
import { employeeServices } from "./employeeServices.js";
//thêm employee Services\
const employeeservice = new employeeServices();
console.log("employeeservice: ", employeeservice);
//=============xuất thông tin nhân viên ra cửa số console
document.getElementById("formNV").onsubmit = (ev) => {
  //ngăn chặn load sự kiện
  ev.preventDefault();
  //
  const nhanvien = layThongTinNV();
  employeeservice.addEmployee(nhanvien);
  console.log(employeeservice.arrayEmployees);
  //hiện thị thông tin nhân viên đã nhậpra UI
  renderEmployees();
};
//=================lấy thông tin nhân viên từ html và class
const layThongTinNV = () => {
  const allElements = document.querySelectorAll("#formNV input,#formNV select");
  //console.log("Tất cả elements khi DOM: ", allElements);

  let nhanVien = {};

  allElements.forEach((thuoctinh) => {
    const { id, value } = thuoctinh;
    nhanVien[id] = value;
  });
  console.log("danh sách NhanVien", nhanVien);
  return new NhanVien(
    nhanVien.tknv,
    nhanVien.name,
    nhanVien.email,
    nhanVien.password,
    nhanVien.datepicker,
    nhanVien.luongCB,
    nhanVien.chucvu,
    nhanVien.gioLam
  );
};
//===================hiển thị danh sách nhân viên ra ngoài màn hình===========
const renderEmployees = (arrayEmployees = employeeservice.arrayEmployees) => {
  let contentHtml = "";
  //đối số callback nhanvien
  arrayEmployees.forEach((nhanvien) => {
    contentHtml += `
    <tr>
      <td>${nhanvien.tknv}</td>
      <td>${nhanvien.name}</td>
      <td>${nhanvien.email}</td>
      <td>${nhanvien.datepicker}</td>
      <td>${nhanvien.chucvu}</td>
      <td>${nhanvien.tongLuong()}</td>
      <td>${nhanvien.xepLoaiGioLam()}</td>
      <td>
      <button class="btn btn-success" data-toggle="modal" 
      data-target="#myModal" onclick="editEmployee('${
        nhanvien.tknv
      }')" >Edit</button>
      <button class="btn btn-danger"onclick="deleteEmployee('${
        nhanvien.tknv
      }')">Delete</button>
      </td>
    `;
  });
  //in ra danh sách bản tbody
  document.getElementById("tableDanhSach").innerHTML = contentHtml;
};

//=========================xóa nhân viên==========
window.deleteEmployee = (tknv) => {
  console.log("tknv: ", tknv);

  employeeservice.deleteEmployee(tknv);

  console.log(employeeservice.arrayEmployees);

  renderEmployees();
};
// ============chinh sua thong tin nhan vien=============
window.editEmployee = (tknv) => {
  console.log("tknv: ", tknv);
  const employeeEdit = employeeservice.arrayEmployees.find(
    (item) => item.tknv === tknv
  );
  console.log("Employeeedit: ", employeeEdit);
  //document.getElementById("myModal").innerHTML = "CẬP NHẬT NHÂN VIÊN";
};
// ===========================
function timKiemXL() {
  let valueSearchInput = document.getElementById("searchName").value;
  let xeploaiSearch = employeeservice.arrayEmployees.filter((nhanvien) => {
    return nhanvien
      .xepLoaiGioLam()
      .toUpperCase()
      .includes(valueSearchInput.toUpperCase());
  });
  console.log("Kết quả tìm kiếm theo xếp loại: ", xeploaiSearch);
  renderEmployees(xeploaiSearch);
}
document.getElementById("searchName").oninput = timKiemXL;
