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
  When Click "Bài đăng" sub menu to "#/vn/setting/post"
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
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field
  Then Required message "Xin vui lòng nhập slug" displayed under "Slug" field

  When Click "date" in "Ngày tạo" with "today"
  When Select file in "Hình ảnh" with "image.jpg"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup

  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field

  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field

  When Click "date" in "Ngày tạo" with "yesterday"
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup

  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Ngày tạo" should be equal "${yesterday}"
  Then Data's information in "Tên Bài đăng" should be equal "_@Tên Bài đăng@_"
  Then Data's information in "Slug" should be equal "_@Slug@_"
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  Then Data's information in "Nội dung" should be equal "_@Nội dung@_"

  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line with cancel
  Then "_@Tên Bài đăng@_" should be visible in the table line

  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then User look message "Xóa thành công" popup
  Then "_@Tên Bài đăng@_" should not be visible in the table line

*** Keywords ***
Go to "Bài đăng" page with "${category}" list
  Login to admin
  Click "Thiết lập" menu
  Click "Bài đăng" sub menu to "#/vn/setting/post"
  Select on the "${category}" item line

### Post ###
Create a test post in "${category}" list
  ${condition}=            Run Keyword And Return Status            Confirm locating exactly in "Bài đăng" page of "Thiết lập" menu
  IF    '${condition}' == 'True'
    Select on the "${category}" item line
  ELSE
    Go to "Bài đăng" page with "${category}" list
  END
  Click "Thêm mới Bài đăng ${category}" button
  Click "date" in "Ngày tạo" with "today"
  Select file in "Hình ảnh" with "image.jpg"
  Click on "Tiếng Anh" tab
  Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
  Click on "Tiếng Việt" tab
  Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
    ${name}=               Check Text                               _@Tên Bài đăng@_
  Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
  Click "Lưu lại" button
  User look message "Tạo thành công" popup
  RETURN               ${name}
