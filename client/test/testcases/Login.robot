*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
### Link to testcases https://docs.google.com/spreadsheets/d/1R_jW5GBVBaMy7YgNKJQ2Ha5xW12Vn0nRzOHE0-OsyF8/edit#gid=180435324 ###

### Verify the User Interface of the Login Page ###
L0_01 Verify the User Interface displays correctly with design
  [Tags]                                                                                                MainPage                       UI                     Smoketest
  Then Heading should contain "Đăng nhập" inner text
  Then Heading should contain "Nhập thông tin chi tiết của bạn để đăng nhập vào tài khoản của bạn" inner text
  Then Webpage should contain "Tên đăng nhập" input field
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Đăng nhập" button
  Then Webpage should contain "Quên mật khẩu?" button

LO_02 Check the showing password when click on eye icon in "Mật khẩu" field
  [Tags]                                                                                                MainPage    Test1                       UI
  When Enter "password" in "Mật khẩu" with "_RANDOM_"
  When Click on eye icon in "Mật khẩu" field
  Then The hidden password in "Mật khẩu" field should be visibled as "_@Mật khẩu@_"

### Verify the log in function when entering the valid data ###
LO_03 Verify that login successfully when enter the valid data (admin account)
  [Tags]                                                                                                Valid                          Smoketest
  When Enter "email" in "Tên đăng nhập" with "${EMAIL_ADMIN}"
  When Enter "text" in "Mật khẩu" with "${PASSWORD_ADMIN}"
  When Click "Đăng nhập" button
  Then User look message "Thành công" popup

### Verify the log in unsuccessful when entering the invalid data ###
LO_04 Verify that login with entering the non-existent email
  [Tags]                                                                                                Invalid                        Smoketest
  When Enter "email" in "Tên đăng nhập" with "_RANDOM_"
  When Enter "password" in "Mật khẩu" with "${PASSWORD_ADMIN}"
  When Click "Đăng nhập" button
  Then User look message "Những thông tin xác thực này không khớp với bản ghi của chúng tôi." popup

LO_05 Verify that login with entering the invalid data in "Tên đăng nhập" field
  [Tags]                                                                                                Invalid                        Smoketest
  When Enter "email" in "Tên đăng nhập" with "admin.admin.com"
  When Enter "password" in "Mật khẩu" with "${PASSWORD_ADMIN}"
  When Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập địa chỉ email hợp lệ!" displayed under "Tên đăng nhập" field

LO_06 Verify that login with entering the invalid password
  [Tags]                                                                                                Invalid                        Smoketest
  When Enter "email" in "Tên đăng nhập" with "${EMAIL_ADMIN}"
  When Enter "password" in "Mật khẩu" with "_RANDOM_"
  When Click "Đăng nhập" button
  Then User look message "Những thông tin xác thực này không khớp với bản ghi của chúng tôi." popup

### Verify the log in unsuccessful when leaving a blank field ###
LO_07 Verify that login with leaving the blank field in "Tên đăng nhập"
  [Tags]                                                                                                BlankField                     Smoketest
  When Enter "password" in "Mật khẩu" with "_RANDOM_"
  When Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập tên đăng nhập" displayed under "Tên đăng nhập" field

LO_08 Verify that login with leaving the blank field in "Mật khẩu"
  [Tags]                                                                                                BlankField                     Smoketest
  When Enter "email" in "Tên đăng nhập" with "${EMAIL_ADMIN}"
  When Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập mật khẩu" displayed under "Mật khẩu" field

### Verify the reset Password function when click on "Quên mật khẩu" ###
LO_09 Verify the User Interface of the "Quên mật khẩu" page
  [Tags]                                                                                                ForgotPassword    Test1                 UI                     Smoketest
  When Click "Quên mật khẩu?" button
  Then Heading should contain "Quên mật khẩu?" inner text
  Then Heading should contain "Vui lòng nhập e-mail của bạn. Mã xác minh OTP sẽ được gửi cho bạn" inner text
  Then Webpage should contain "Email khôi phục" input field
  Then Webpage should contain "Lấy Mã OTP" button
  Then Webpage should contain "Quay trở lại đăng nhập" button

LO_10 Verify the User Interface of the "Xác nhận OTP" page
  [Tags]                                                                                                ForgotPassword    Test1                 UI                     Smoketest
  When Click "Quên mật khẩu?" button
  When Enter "email" in "Email khôi phục" with "${EMAIL_ADMIN}"
  When Click "Lấy Mã OTP" button
  Then User look message "Thành công" popup
  Then Heading should contain "Quên mật khẩu?" inner text
  Then Heading should contain "Vui lòng nhập mã OTP đã gửi đến email của bạn" inner text
  Then Webpage should contain "Mã OTP" input field
  Then Webpage should contain "Gửi mã OTP" button
  Then Webpage should contain "Quay trở lại đăng nhập" button

LO_13 Check to reset password with entering the non-existence email
  [Tags]                                                                                                ForgotPassword    Test1
  When Click "Quên mật khẩu?" button
  When Enter "email" in "Email khôi phục" with "_RANDOM_"
  When Click "Lấy Mã OTP" button
  Then User look message "Những thông tin xác thực này không khớp với bản ghi của chúng tôi." popup

LO_16 Verify the go back button when click on "Quay trở lại đăng nhập" button in nhập email đăng nhập page
  [Tags]                                                                                                ForgotPassword    Test1                 GoBack
  When Click "Quên mật khẩu?" button
  When Click "Quay trở lại đăng nhập" button
  Then Webpage should contain "Tên đăng nhập" input field
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Quên mật khẩu?" button

LO_17 Verify the go back button when click on "Quay trở lại đăng nhập" button in confirming OTP page
  [Tags]                                                                                                ForgotPassword    Test1                 GoBack
  When Click "Quên mật khẩu?" button
  When Enter "email" in "Email khôi phục" with "${EMAIL_ADMIN}"
  When Click "Lấy Mã OTP" button
  When Click "Quay trở lại đăng nhập" button
  Then Webpage should contain "Tên đăng nhập" input field
  Then Webpage should contain "Mật khẩu" input field
  Then Webpage should contain "Quên mật khẩu?" button

