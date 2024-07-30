*** Settings ***
Resource               ../keywords/common.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
MP_00 My Profile
  [Tags]                                                                                               Develop1                 UI                     Smoketest
  Login to admin
  When Click "Thông tin cá nhân" line in the avatar's account
  Then Webpage should contain the profile information group with name and role
  When Click on "Đổi mật khẩu" tab
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Mật khẩu mới" input field
  Then Webpage should contain "Xác nhận mật khẩu" input field
  Then Webpage should contain "Đổi mật khẩu" button

  When Click on "Thông tin cá nhân" tab
  Then Heading should contain "Thông tin cá nhân" inner text
  Then Webpage should contain "Thông tin cá nhân" tab
  Then Webpage should contain "Đổi mật khẩu" tab
  Then Webpage should contain "Họ và tên" input field
  Then Webpage should contain "Email" input field
  Then Webpage should contain "Số điện thoại" input field
  Then Webpage should contain "Ngày sinh" input field
  Then Webpage should contain "Vị trí" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Lưu lại" button

  When Enter "test name" in "Họ và tên" with ""
  When Enter "email" in "Email" with ""
  When Enter "phone" in "Số điện thoại" with ""
  When Click on cross icon in select "Ngày sinh"
  When Click on cross icon in select "Vị trí"
  When Enter "text" in textarea "Mô tả" with ""

  Then Required message "Xin vui lòng nhập họ và tên" displayed under "Họ và tên" field
  Then Required message "Xin vui lòng nhập email" displayed under "Email" field
  Then Required message "Xin vui lòng nhập số điện thoại" displayed under "Số điện thoại" field
  Then Required message "Xin vui lòng chọn ngày sinh" displayed under "Ngày sinh" field
  Then Required message "Xin vui lòng chọn vị trí" displayed under "Vị trí" field

  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click "date" in "Ngày sinh" with "_RANDOM_"
  When Click select "Vị trí" with "Tester"
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"

  When Click "Lưu lại" button

  Then User look message "Thành công" popup
  Then Data's information in "Họ và tên" should be equal "_@Họ và tên@_"
  Then Data's information in "Email" should be equal "_@Email@_"
  Then Data's information in "Số điện thoại" should be equal "_@Số điện thoại@_"
  Then Data's information in "Ngày sinh" should be equal "_@Ngày sinh@_"
  Then Data's information in "Vị trí" should be equal "_@Vị trí@_"
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"


  When Enter "test name" in "Họ và tên" with "May Rodriguez PhD"
  When Enter "email" in "Email" with "admin@admin.com"
  When Enter "phone" in "Số điện thoại" with "053702170206"

  When Click "Lưu lại" button

