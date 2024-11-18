import { NhanVien } from "./NhanVien.js";
import { employeeServices } from "./employeeServices.js";
import { Validation } from "./Validation.js";
//=============================thêm employee Services==================
const employeeservice = new employeeServices();
const validation = new Validation();
console.log("employeeservice: ", employeeservice);
//=================================lấy thông tin nhân viên từ html và class================
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

//============================hiển thị danh sách nhân viên ra ngoài màn hình=========================
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
const SetlocalStorage = () => {
  localStorage.setItem(
    "arrayEmployees",
    JSON.stringify(employeeservice.arrayEmployees)
  );
};
// ======================== render du lieu vao Storage =============
const renderLocalsStorage = () => {
  let arrayEmployees = localStorage.getItem("arrayEmployees");
  if (!arrayEmployees) return;
  arrayEmployees = JSON.parse(arrayEmployees);
  const newEmployees = arrayEmployees.map((nhanVien) => {
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
  });
  employeeservice.arrayEmployees = newEmployees;
  renderEmployees(newEmployees);
};
renderLocalsStorage();
document.getElementById("btnThem").onclick = () => {
  const form = document.getElementById("formNV");
  form.reset();
  document.getElementById("btnCapNhatNV").style.display = "none";
  document.getElementById("btnThemNV").style.display = "inline-block";
  document.getElementById("tknv").disabled = false;
};
////===========================xuất thông tin nhân viên ra cửa số console======================
document.getElementById("formNV").onsubmit = (ev) => {
  //ngăn chặn load sự kiện
  ev.preventDefault();
  //
  const Alleles = document.getElementById("formNV");
  const action = Alleles.getAttribute("data-action");
  //
  const nhanvien = layThongTinNV();
  let isValid = true;
  //kiểm tra có nhập không
  //value và errorID bên valid và div  trong html
  // tài khoản phải nhập trên < 8 và > 20 kí tự , có thể bao gồm số
  isValid &= validation.required(nhanvien.tknv, "invalidtknv");
  // kiểm tra họ và tên từ 6 đến 20 kí tự không bao gồm số
  isValid &= validation.checkName(nhanvien.name, "invalidname");
  // kiểm tra email thì phải nhập chữ , số kí tự @ , đuôi gmail.com
  isValid &= validation.checkEmail(nhanvien.email, "invalidemail");
  //kiểm tra ngày đúng theo quy định 12 tháng gồm 2 số , ngày gồm 2 số như 01,02...28,29,30,31 ngày , năm gồm 4 số 2XXX
  isValid &= validation.checkNgay(nhanvien.datepicker, "invalidngay");
  //kiểm tra mật khẩu có lượng kí tự và Ký tự đặc biệt . VD: Pass@1 , Tên@123
  isValid &= validation.checkPassword(nhanvien.password, "invalidpassword");
  //
  isValid &= validation.checkLuong(nhanvien.luongCB, "invalidluong");
  //
  isValid &= validation.checkChucVu(nhanvien.chucvu, "invalidchucvu");
  isValid &= validation.checkWorkingHours(nhanvien.gioLam, "invalidgiolam");
  //không hiện ra màn hình khi 1 trong tất cả sai điều kiện trên
  if (!isValid) return;
  if (action !== "edit") {
    //thêm nhân viên vào form
    employeeservice.addEmployee(nhanvien);
  }
  if (action === "edit") {
    //cập nhật nhân viên
    employeeservice.updateEmployee(nhanvien);
    document.getElementById("btnThemNV").style.display = "inline-block";
    //
    document.getElementById("btnCapNhatNV").style.display = "none";
  }
  //employeeservice.addEmployee(nhanvien);
  //console.log(employeeservice.arrayEmployees);
  Alleles.removeAttribute("data-action");
  Alleles.reset();
  //mo lai disable
  //document.getElementById("tknv").disabled = false;
  document.getElementById("btnDong").click();
  //lưu dữ liệu nhân viên vào localStorage
  SetlocalStorage();
  //hiện thị thông tin nhân viên đã nhậpra UI
  renderEmployees();
};
// ================== reset btn Thêm ======

//=============================================xóa nhân viên========================================
window.deleteEmployee = (tknv) => {
  console.log("tknv: ", tknv);

  employeeservice.deleteEmployee(tknv);

  console.log(employeeservice.arrayEmployees);

  renderEmployees();
  SetlocalStorage();
};
// ================================Edit thông tin nhân viên===============================
window.editEmployee = (tknv) => {
  //console.log("tknv: ", tknv);
  const employeeEdit = employeeservice.arrayEmployees.find(
    (item) => item.tknv === tknv
  );
  //console.log("Employeeedit: ", employeeEdit);

  //thêm data-action để khi click edit
  document.getElementById("formNV").setAttribute("data-action", "edit");
  //lấy lại thông tin từ nhân viên đã nhập đưa vào form eidt

  // không thể thay đổi nút tknv
  document.getElementById("tknv").disabled = true;
  //
  document.getElementById("btnCapNhatNV").style.display = "inline-block";
  // ẩn button thêm ở chức năng edit
  document.getElementById("btnThemNV").style.display = "none";
  //

  // có lỗi
  //document.getElementById("myModal").innerHTML = "Cập nhật";
  const elements = document.querySelectorAll("#formNV input,#formNV select");
  elements.forEach((element) => {
    const id = element.id; // id là #id của từng phần tử thẻ HTML
    if (employeeEdit[id] !== undefined) {
      element.value = employeeEdit[id]; // Gán giá trị thuộc tính tương ứng
    }
  });
  const nhanvien = layThongTinNV();
  let isValid = true;
  //kiểm tra có nhập không
  //value và errorID bên valid và div  trong html
  // tài khoản phải nhập trên < 8 và > 20 kí tự , có thể bao gồm số
  isValid &= validation.required(nhanvien.tknv, "invalidtknv");
  // kiểm tra họ và tên từ 6 đến 20 kí tự không bao gồm số
  isValid &= validation.checkName(nhanvien.name, "invalidname");
  // kiểm tra email thì phải nhập chữ , số kí tự @ , đuôi gmail.com
  isValid &= validation.checkEmail(nhanvien.email, "invalidemail");
  //kiểm tra ngày đúng theo quy định 12 tháng gồm 2 số , ngày gồm 2 số như 01,02...28,29,30,31 ngày , năm gồm 4 số 2XXX
  isValid &= validation.checkNgay(nhanvien.datepicker, "invalidngay");
  //kiểm tra mật khẩu có lượng kí tự và Ký tự đặc biệt . VD: Pass@1 , Tên@123
  isValid &= validation.checkPassword(nhanvien.password, "invalidpassword");
  //lương cơ bản 1 tr
  isValid &= validation.checkLuong(nhanvien.luongCB, "invalidluong");
  //
  isValid &= validation.checkChucVu(nhanvien.chucvu, "invalidchucvu");
  isValid &= validation.checkWorkingHours(nhanvien.gioLam, "invalidgiolam");
  //không hiện ra màn hình khi 1 trong tất cả sai điều kiện trên
  if (!isValid) return;
};
// =========================== tìm kiếm nhân viên theo xếp loại : khá ,giỏi ...==============================
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
