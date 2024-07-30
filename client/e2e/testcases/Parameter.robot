*** Settings ***
Resource                       ../keywords/common.robot
Test Setup                     Setup
Test Teardown                  Tear Down
Library                        DateTime

*** Test Cases ***
PL_00 Parameter
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Login to admin
  Click "Thiết lập" menu
  When Click "Tham số" sub menu to "#/vi/setting/parameter"
  Then Confirm locating exactly in "Tham số" page of "Thiết lập" menu
  Then Heading should contain "Chỉnh sửa tham số Address" inner text
  Then Webpage should contain "Tham số tiếng Việt" input field
  Then Webpage should contain "Tham số tiếng Anh" input field
  Then Webpage should contain "Lưu lại" button

  When Enter "text" in "Tham số tiếng Việt" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Data's information in "Tham số tiếng Việt" should be equal "_@Tham số tiếng Việt@_"
  When Enter "text" in "Tham số tiếng Việt" with "P3A.01.03, Picity High Park, 9A đường Thạnh Xuân 13, P. Thạnh Xuân, Q.12, TP. Hồ Chí Minh, Việt Nam."

  When Enter "text" in "Tham số tiếng Anh" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Data's information in "Tham số tiếng Anh" should be equal "_@Tham số tiếng Anh@_"
  When Enter "text" in "Tham số tiếng Anh" with "P3A.01.03, Picity High Park, 9A Thạnh Xuan 13 St., Thạnh Xuan Ward, 12 Dist., Ho Chi Minh City, Vietnam."
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
