*** Settings ***
Resource               ../keywords/common.robot
Test Setup             Setup
Test Teardown          Tear Down
Library                DateTime

*** Test Cases ***
CL_00 User
  [Tags]                                                                                                Develop1                   UI                     Smoketest
  Login to admin
  When Click "Người Dùng" menu
  Then Heading should contain "Người Dùng" inner text
  Then Confirm locating exactly in "Danh sách" page of "Người Dùng" menu
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Họ và tên" column with sort and search function
  Then Webpage should contain "Vị trí" column with sort and search function
  Then Webpage should contain "Email" column with sort and search function
  Then Webpage should contain "Số điện thoại" column with sort and search function
  Then Webpage should contain "Ngày tạo" column with sort and search function
  Then Webpage should contain "Vai trò" group
  Then Webpage should contain "Thêm mới người dùng Super Admin" button

  When Click "Thêm mới người dùng Super Admin" button
  Then Heading should contain "Thêm mới người dùng Super Admin" inner text
  Then Webpage should contain "Họ và tên" input field
  Then Webpage should contain "Email" input field
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Xác nhận mật khẩu" input field
  Then Webpage should contain "Số điện thoại" input field
  Then Webpage should contain "Ngày sinh" input field
  Then Webpage should contain "Vị trí" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Tải ảnh lên" image upload field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập họ và tên" displayed under "Họ và tên" field
  Then Required message "Xin vui lòng nhập email" displayed under "Email" field
  Then Required message "Xin vui lòng nhập số điện thoại" displayed under "Số điện thoại" field
  Then Required message "Xin vui lòng chọn ngày sinh" displayed under "Ngày sinh" field
  Then Required message "Xin vui lòng chọn vị trí" displayed under "Vị trí" field

  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "password" in "Mật khẩu" with "_RANDOM_"
  When Enter "password" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click "date" in "Ngày sinh" with "_RANDOM_"
  When Click select "Vị trí" with "Tester"
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"
  When Select file in "Tải ảnh lên" with "image.jpg"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup

  When Click on the "Đã kích hoạt người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line
  Then User look message "Cập nhật thành công" popup
  Then The status button in the "_@Họ và tên@_" table line should change to "Đã vô hiệu hóa người dùng _@Họ và tên@_"

  When Click on the "Đã vô hiệu hóa người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line
  Then The status button in the "_@Họ và tên@_" table line should change to "Đã kích hoạt người dùng _@Họ và tên@_"

  When Click on the "Chỉnh sửa người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line
  Then Data's information in "Họ và tên" should be equal "_@Họ và tên@_"
  Then Data's information in "Email" should be equal "_@Email@_"
  Then Data's information in "Số điện thoại" should be equal "_@Số điện thoại@_"
  Then Data's information in "Ngày sinh" should be equal "_@Ngày sinh@_"
  Then Data's information in "Vị trí" should be equal "_@Vị trí@_"
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  When Click "Huỷ bỏ" button

  When Click on the "Chỉnh sửa người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line
  Then Heading should contain "Chỉnh sửa người dùng Super Admin" inner text
  Then Webpage should contain "Họ và tên" input field
  Then Webpage should contain "Email" input field
  Then Webpage should contain "Số điện thoại" input field
  Then Webpage should contain "Ngày sinh" input field
  Then Webpage should contain "Vị trí" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Tải ảnh lên" image upload field

  When Enter "test name" in "Họ và tên" with ""
  When Enter "email" in "Email" with ""
  When Enter "phone" in "Số điện thoại" with ""
  When Click on cross icon in select "Vị trí"
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập họ và tên" displayed under "Họ và tên" field
  Then Required message "Xin vui lòng nhập email" displayed under "Email" field
  Then Required message "Xin vui lòng nhập số điện thoại" displayed under "Số điện thoại" field
  Then Required message "Xin vui lòng chọn vị trí" displayed under "Vị trí" field

  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Vị trí" with "Tester"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup

  When Click on the "Chỉnh sửa người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line
  ${before}=                     Get the image's information in "Tải ảnh lên" field
  When Click on cross icon inside image in "Tải ảnh lên"
  When Select file in "Tải ảnh lên" with "image2.jpg"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line
  ${after}=                      Get the image's information in "Tải ảnh lên" field
  Then Should Not Be Equal       ${after}    ${before}

  ${yesterday}=                                                                                         Get Current Date                local                         -1 day                                     result_format=%d-%m-%Y
  Then Data's information in "Ngày sinh" should be equal "${yesterday}"
  When Click on cross icon in select "Ngày sinh"
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng chọn ngày sinh" displayed under "Ngày sinh" field
  When Click "Huỷ bỏ" button

  When Click on the "Xóa người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line with cancel
  Then "_@Họ và tên@_" should be visible in the table line

  When Click on the "Xóa người dùng _@Họ và tên@_" button in the "_@Họ và tên@_" table line
  Then User look message "Xóa thành công" popup
  Then "_@Họ và tên@_" should not be visible in the table line
