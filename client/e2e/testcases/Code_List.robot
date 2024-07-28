*** Settings ***
Resource               ../keywords/common.robot
Test Setup             Setup
Test Teardown          Tear Down
Library                DateTime

*** Test Cases ***
### Link to testcases https://docs.google.com/spreadsheets/d/1R_jW5GBVBaMy7YgNKJQ2Ha5xW12Vn0nRzOHE0-OsyF8/edit#gid=778615548 ###
PC_00 Verify the User Interface of "Mã" page
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Login to admin
  When Click "Thiết lập" menu
  When Click "Mã" sub menu to "#/vi/setting/code"
  Select on the "Position" item line
  Then Heading should contain "Mã" inner text
  Then Confirm locating exactly in "Mã" page of "Thiết lập" menu
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Mã" column with sort and search function
  Then Webpage should contain "Tên mã" column with sort and search function
  Then Webpage should contain "Ngày tạo" column with sort and search function
  Then Webpage should contain "Loại mã" group
  Then Webpage should contain "Thêm mới mã Position" button

  When Click "Thêm mới mã Position" button
  Then Heading should contain "Thêm mới mã Position" inner text
  Then Webpage should contain "Tên mã" input field
  Then Webpage should contain "Mã" input field
  Then Webpage should contain "Mô tả mã" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên mã" displayed under "Tên mã" field
  Then Required message "Xin vui lòng nhập mã" displayed under "Mã" field

  When Enter "test name" in "Tên mã" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả mã" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup

  When Click on the "Đã kích hoạt mã _@Tên mã@_" button in the "_@Tên mã@_" table line
  Then User look message "Cập nhật thành công" popup
  Then The status button in the "_@Tên mã@_" table line should change to "Đã vô hiệu hóa mã _@Tên mã@_"

  When Click on the "Đã vô hiệu hóa mã _@Tên mã@_" button in the "_@Tên mã@_" table line
  Then The status button in the "_@Tên mã@_" table line should change to "Đã kích hoạt mã _@Tên mã@_"

  When Click on the "Chỉnh sửa mã _@Tên mã@_" button in the "_@Tên mã@_" table line
  Then Heading should contain "Chỉnh sửa mã Position" inner text
  Then Webpage should contain "Tên mã" input field
  Then Webpage should contain "Mô tả mã" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Enter "test name" in "Tên mã" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên mã" displayed under "Tên mã" field

  When Enter "test name" in "Tên mã" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả mã" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup

  When Click on the "Chỉnh sửa mã _@Tên mã@_" button in the "_@Tên mã@_" table line
  Then Data's information in "Tên mã" should be equal "_@Tên mã@_"
  Then Data's information in "Mô tả mã" should be equal "_@Mô tả mã@_"
  When Click "Huỷ bỏ" button

  When Click on the "Xóa mã _@Tên mã@_" button in the "_@Tên mã@_" table line with cancel
  Then "_@Tên mã@_" should be visible in the table line

  When Click on the "Xóa mã _@Tên mã@_" button in the "_@Tên mã@_" table line
  Then User look message "Xóa thành công" popup
  Then "_@Tên mã@_" should not be visible in the table line
