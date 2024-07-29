*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
### Link to testcases https://docs.google.com/spreadsheets/d/1R_jW5GBVBaMy7YgNKJQ2Ha5xW12Vn0nRzOHE0-OsyF8/edit#gid=180435324 ###
LO_00 Login
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Then Heading should contain "Đăng nhập" inner text
  Then Heading should contain "Nhập thông tin chi tiết của bạn để đăng nhập vào tài khoản của bạn" inner text
  Then Webpage should contain "Tên đăng nhập" input field
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Đăng nhập" button
  Then Webpage should contain "Quên mật khẩu?" button

  When Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập tên đăng nhập" displayed under "Tên đăng nhập" field
  Then Required message "Xin vui lòng nhập mật khẩu" displayed under "Mật khẩu" field

  When Enter "email" in "Tên đăng nhập" with "admin.admin.com"
  When Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập địa chỉ email hợp lệ!" displayed under "Tên đăng nhập" field

  When Click "Quên mật khẩu?" button
  Then Heading should contain "Quên mật khẩu?" inner text
  Then Heading should contain "Vui lòng nhập e-mail của bạn. Mã xác minh OTP sẽ được gửi cho bạn" inner text
  Then Webpage should contain "Email khôi phục" input field
  Then Webpage should contain "Lấy Mã OTP" button
  Then Webpage should contain "Quay trở lại đăng nhập" button

  When Click "Quay trở lại đăng nhập" button
  Then Webpage should contain "Tên đăng nhập" input field
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Quên mật khẩu?" button

  When Click "Quên mật khẩu?" button
  When Enter "email" in "Email khôi phục" with "_RANDOM_"
  When Click "Lấy Mã OTP" button
  Then User look message "Những thông tin xác thực này không khớp với bản ghi của chúng tôi." popup

  When Enter "email" in "Email khôi phục" with "${EMAIL_ADMIN}"
  When Click "Lấy Mã OTP" button
  Then User look message "Thành công" popup
  Then Heading should contain "Quên mật khẩu?" inner text
  Then Heading should contain "Vui lòng nhập mã OTP đã gửi đến email của bạn" inner text
  Then Webpage should contain "Mã OTP" input field
  Then Webpage should contain "Gửi mã OTP" button
  Then Webpage should contain "Quay trở lại đăng nhập" button

  When Click "Quay trở lại đăng nhập" button
  Then Webpage should contain "Tên đăng nhập" input field
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Quên mật khẩu?" button

  When Enter "email" in "Tên đăng nhập" with "${EMAIL_ADMIN}"
  When Enter "text" in "Mật khẩu" with "${PASSWORD_ADMIN}"
  When Click "Đăng nhập" button
  Then User look message "Thành công" popup
