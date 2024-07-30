*** Settings ***
Resource               ../keywords/common.robot
Test Setup             Setup
Test Teardown          Tear Down
Library                DateTime

*** Test Cases ***
DL_00 Data
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Login to admin
  When Click "Thiết lập" menu
  When Click "Nội dung" sub menu to "#/vi/setting/content"
  Then Heading should contain "Nội dung" inner text
  Then Confirm locating exactly in "Nội dung" page of "Thiết lập" menu
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Tên Nội dung" column with sort and search function
  Then Webpage should contain "Thứ tự" column with sort and search function
  Then Webpage should contain "Ngày tạo" column with sort and search function
  Then Webpage should contain "Loại Nội dung" group
  Then Webpage should contain "Thêm mới Nội dung Members" button

  When Click "Thêm mới Nội dung Members" button
  Then Heading should contain "Thêm mới Nội dung Members" inner text
  Then Webpage should contain "Thứ tự" input field
  Then Webpage should contain "Hình ảnh" image upload field
  Then Webpage should contain "Tiếng Anh" tab
  Then Webpage should contain "Tên Nội dung" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên nội dung" displayed under "Tên Nội dung" field

  When Enter "number" in "Thứ tự" with "_RANDOM_"
  When Select file in "Hình ảnh" with "image.jpg"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Nội dung" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Nội dung" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup

  When Click on the "Đã kích hoạt nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line
  Then User look message "Cập nhật thành công" popup
  Then The status button in the "_@Tên Nội dung@_" table line should change to "Đã vô hiệu hóa nội dung _@Tên Nội dung@_"

  When Click on the "Đã vô hiệu hóa nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line
  Then The status button in the "_@Tên Nội dung@_" table line should change to "Đã kích hoạt nội dung _@Tên Nội dung@_"


  When Click on the "Chỉnh sửa nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Thứ tự" should be equal "_@Thứ tự@_"
  Then Data's information in "Tên Nội dung" should be equal "_@Tên Nội dung@_"
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  When Click "Huỷ bỏ" button

  When Click on the "Chỉnh sửa nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line
  Then Heading should contain "Chỉnh sửa Nội dung Members" inner text
  Then Webpage should contain "Thứ tự" input field
  Then Webpage should contain "Hình ảnh" image upload field
  Then Webpage should contain "Tiếng Anh" tab
  Then Webpage should contain "Tên Nội dung" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Nội dung" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên nội dung" displayed under "Tên Nội dung" field

  When Enter "test name" in "Tên Nội dung" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Nội dung" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên nội dung" displayed under "Tên Nội dung" field

  When Enter "number" in "Thứ tự" with "_RANDOM_"
  When Enter "test name" in "Tên Nội dung" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup

  When Click on the "Chỉnh sửa nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line
  ${before}=                     Get the image's information in "Hình ảnh" field
  When Click on cross icon inside image in "Hình ảnh"
  When Select file in "Hình ảnh" with "image2.jpg"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line
  ${after}=                      Get the image's information in "Hình ảnh" field
  Then Should Not Be Equal       ${after}    ${before}
  When Click "Huỷ bỏ" button

  When Click on the "Xóa nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line with cancel
  Then "_@Tên Nội dung@_" should be visible in the table line

  When Click on the "Xóa nội dung _@Tên Nội dung@_" button in the "_@Tên Nội dung@_" table line
  Then User look message "Xóa thành công" popup
  Then "_@Tên Nội dung@_" should not be visible in the table line
