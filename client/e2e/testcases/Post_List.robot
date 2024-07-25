*** Settings ***
Resource               ../keywords/common.robot
Test Setup             Setup
Test Teardown          Tear Down
Library                DateTime

*** Test Cases ***
### Link to testcases https://docs.google.com/spreadsheets/d/1R_jW5GBVBaMy7YgNKJQ2Ha5xW12Vn0nRzOHE0-OsyF8/edit#gid=1857962472 ###
PL_00 Verify the User Interface of "Bài đăng" page
  [Tags]                                                                                                MainPage                   UI                     Smoketest
  ${yesterday}=                                                                                         Get Current Date                local                         -1 day                                     result_format=%d-%m-%Y
  Login to admin
  When Click "Thiết lập" menu
  When Click "Bài đăng" sub menu to "#/vi/setting/post"
  Select on the "Projects" item line
  Then Heading should contain "Bài đăng" inner text
  Then Confirm locating exactly in "Bài đăng" page of "Thiết lập" menu
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Tên Bài đăng" column with sort and search function
  Then Webpage should contain "Slug" column with sort and search function
  Then Webpage should contain "Ngày tạo" column with sort and search function
  Then Webpage should contain "Loại Bài đăng" group
  Then Webpage should contain "Thêm mới Bài đăng Projects" button

  When Click "Thêm mới Bài đăng Projects" button
  Then Heading should contain "Thêm mới Bài đăng Projects" inner text
  Then Webpage should contain "Ngày tạo" input field
  Then Webpage should contain "Hình ảnh" image upload field
  Then Webpage should contain "Tiếng Anh" tab
  Then Webpage should contain "Tên Bài đăng" input field
  Then Webpage should contain "Slug" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Nội dung" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field
  Then Required message "Xin vui lòng nhập slug" displayed under "Slug" field

  When Click "date" in "Ngày tạo" with "today"
  When Select file in "Hình ảnh" with "image.jpg"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup

  When Click on the "Đã kích hoạt bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then User look message "Cập nhật thành công" popup
  Then The status button in the "_@Tên Bài đăng@_" table line should change to "Đã vô hiệu hóa bài đăng _@Tên Bài đăng@_"

  When Click on the "Đã vô hiệu hóa bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then The status button in the "_@Tên Bài đăng@_" table line should change to "Đã kích hoạt bài đăng _@Tên Bài đăng@_"

  When Click on the "Chỉnh sửa bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then Heading should contain "Chỉnh sửa Bài đăng Projects" inner text
  Then Webpage should contain "Ngày tạo" input field
  Then Webpage should contain "Hình ảnh" image upload field
  Then Webpage should contain "Tiếng Anh" tab
  Then Webpage should contain "Tên Bài đăng" input field
  Then Webpage should contain "Slug" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Nội dung" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field

  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field

  When Click "date" in "Ngày tạo" with "yesterday"
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup

  When Click on the "Chỉnh sửa bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Ngày tạo" should be equal "${yesterday}"
  Then Data's information in "Tên Bài đăng" should be equal "_@Tên Bài đăng@_"
  Then Data's information in "Slug" should be equal "_@Slug@_"
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  Then Data's information in "Nội dung" should be equal "_@Nội dung@_"

  ${before}=                     Get the image's information in "Hình ảnh" field
  When Click on cross icon inside image in "Hình ảnh"
  When Select file in "Hình ảnh" with "image2.jpg"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  ${after}=                      Get the image's information in "Hình ảnh" field
  Then Should Not Be Equal       ${after}    ${before}

  When Click on cross icon in select "Ngày tạo"
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng chọn ngày tạo" displayed under "Ngày tạo" field
  When Click "Huỷ bỏ" button

  When Click on the "Xóa bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line with cancel
  Then "_@Tên Bài đăng@_" should be visible in the table line

  When Click on the "Xóa bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then User look message "Xóa thành công" popup
  Then "_@Tên Bài đăng@_" should not be visible in the table line
