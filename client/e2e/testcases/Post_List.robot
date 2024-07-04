*** Settings ***
Resource               ../keywords/common.robot
Test Setup             Setup
Test Teardown          Tear Down
Library                DateTime

*** Test Cases ***
### Link to testcases https://docs.google.com/spreadsheets/d/1R_jW5GBVBaMy7YgNKJQ2Ha5xW12Vn0nRzOHE0-OsyF8/edit#gid=1857962472 ###
PL_01 Verify the User Interface of "Bài đăng" page
  [Tags]                                                                                                MainPage                   UI                     Smoketest
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

PL_08 Verify that switch off post when click on "Đã kích hoạt" button
  [Tags]                                                                                                Activate  Test1                     Projects
  Create a test post in "Projects" list
  When Click on the "Đã kích hoạt Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then User look message "Cập nhật thành công" popup
  Then The status button in the "_@Tên Bài đăng@_" table line should change to "Đã vô hiệu hóa Bài đăng _@Tên Bài đăng@_"
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_10 Verify that switch off post when click on "Đã kích hoạt" button
  [Tags]                                                                                                Activate  Test1                     News
  Create a test post in "News" list
  When Click on the "Đã kích hoạt Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then User look message "Cập nhật thành công" popup
  Then The status button in the "_@Tên Bài đăng@_" table line should change to "Đã vô hiệu hóa Bài đăng _@Tên Bài đăng@_"
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_38 Verify the UI of the editing post page in "Projects" list (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        Projects
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
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
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_38_2 Verify the UI of the editing post page in "Projects" list (VIETNAM tab)
  [Tags]                                                                                                EditInfo                          Projects
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then Heading should contain "Chỉnh sửa Bài đăng Projects" inner text
  Then Webpage should contain "Ngày tạo" input field
  Then Webpage should contain "Hình ảnh" image upload field
  Then Webpage should contain "Tiếng Việt" tab
  Then Webpage should contain "Tên Bài đăng" input field
  Then Webpage should contain "Slug" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Nội dung" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_39 Verity that change the post's information by entering the valid data in "Ngày tạo" field
  [Tags]                                                                                                EditInfo  Test1                        Projects                      Valid
  ${yesterday}=                                                                                         Get Current Date                local                         -1 day                                     result_format=%d-%m-%Y
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click "date" in "Ngày tạo" with "yesterday"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then Data's information in "Ngày tạo" should be equal "${yesterday}"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_40 Verity that change the post's information by entering the valid data in "Hình ảnh" field
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  ${before}=                     Get the image's information in "Hình ảnh" field
  When Click on cross icon inside image in "Hình ảnh"
  When Select file in "Hình ảnh" with "image2.jpg"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  ${after}=                      Get the image's information in "Hình ảnh" field
  Then Should Not Be Equal       ${after}    ${before}
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_42 Verity that change the post's information by entering the valid data in "Name" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  ${name} =     Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng ${name}" button in the "${name}" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Tên Bài đăng" should be equal "_@Tên Bài đăng@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng ${name}" button in the "${name}" table line

PL_43 Verity that change the post's information by entering the valid data in "Slug" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in "Slug" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Slug" should be equal "_@Slug@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_44 Verity that change the post's information by entering the valid data in "Slug" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in "Slug" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Slug" should be equal "_@Slug@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_45 Verity that change the post's information by entering the valid data in "Mô tả" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_46 Verity that change the post's information by entering the valid data in "Mô tả" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_47 Verity that change the post's information by entering the valid data in "Nội dung" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Nội dung" should be equal "_@Nội dung@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_48 Verity that change the post's information by entering the valid data in "Nội dung" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        Projects                      Valid
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Nội dung" should be equal "_@Nội dung@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_49 Verity that change the post's information by entering the existent data in "Name" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        Projects                      Invalid
  ${Post}=                   Create a test post in "Projects" list
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng ${Post}" button in the "${Post}" table line
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_@Tên Bài đăng@_"
  When Click "Lưu lại" button
  Then Required message "Tên Bài đăng _@Tên Bài đăng@_ đã được sử dụng!" displayed under "Tên Bài đăng" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng ${Post}" button in the "${Post}" table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_51 Verify the "Huỷ bỏ" button in the edit post's information page
  [Tags]                                                                                                EditInfo                        Projects                      Button
  ${Post}=                   Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Click "Huỷ bỏ" button
  Then "_@Tên Bài đăng@_" should not be visible in the table line
  When Click on the "Xóa Bài đăng ${Post}" button in the "${Post}" table line

PL_52 Verify the "Huỷ bỏ" button in the edit post's information page
  [Tags]                                                                                                EditInfo                        Projects                      Button
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_54 Verity that change the post's information by leaving the blank field in "Ngày tạo" field
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on cross icon in select "Ngày tạo"
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng chọn ngày tạo" displayed under "Ngày tạo" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_56 Verity that change the post's information by leaving the blank field in "Tên Bài đăng" field
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  ${Post}=                 Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "${Post}" table line

PL_57 Verity that change the post's information by leaving the blank field in "Name" field
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  ${Post}=                 Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "${Post}" table line

PL_58 Verity that change the post's information by leaving the blank field in "Slug" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in "Slug" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập slug" displayed under "Slug" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_59 Verity that change the post's information by leaving the blank field in "Slug" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in "Slug" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập slug" displayed under "Slug" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_60 Verity that change the post's information by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in textarea "Mô tả" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_61 Verity that change the post's information by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in textarea "Mô tả" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_62 Verity that change the post's information by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in editor "Nội dung" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_63 Verity that change the post's information by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                EditInfo                        Projects                      BlankField
  Create a test post in "Projects" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in editor "Nội dung" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

## Verify that edit post's information page of "News" list ##
PL_64 Verify the UI of the editing post page in "News" list (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        News
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then Heading should contain "Chỉnh sửa Bài đăng News" inner text
  Then Webpage should contain "Ngày tạo" input field
  Then Webpage should contain "Hình ảnh" image upload field
  Then Webpage should contain "Tiếng Anh" tab
  Then Webpage should contain "Tên Bài đăng" input field
  Then Webpage should contain "Slug" input field
  Then Webpage should contain "Mô tả" input field
  Then Webpage should contain "Nội dung" input field
  Then Webpage should contain "Lưu lại" button
  Then Webpage should contain "Huỷ bỏ" button
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_65 Verity that change the post's information by entering the valid data in "Ngày tạo" field
  [Tags]                                                                                                EditInfo                        News                      Valid
  ${yesterday}=                                                                                         Get Current Date                local                         -1 day                                     result_format=%d-%m-%Y
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click "date" in "Ngày tạo" with "yesterday"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then Data's information in "Ngày tạo" should be equal "${yesterday}"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_66 Verity that change the post's information by entering the valid data in "Hình ảnh" field
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  ${before}=                     Get the image's information in "Hình ảnh" field
  When Click on cross icon inside image in "Hình ảnh"
  When Select file in "Hình ảnh" with "image2.jpg"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  ${after}=                      Get the image's information in "Hình ảnh" field
  Then Should Not Be Equal       ${after}    ${before}
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_67 Verity that change the post's information by entering the valid data in "Tên Bài đăng" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_68 Verity that change the post's information by entering the valid data in "Name" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  ${Post}=                            Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng ${Post}" button in the "${Post}" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Tên Bài đăng" should be equal "_@Tên Bài đăng@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng ${Post}" button in the "${Post}" table line

PL_69 Verity that change the post's information by entering the valid data in "Slug" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in "Slug" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Slug" should be equal "_@Slug@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_70 Verity that change the post's information by entering the valid data in "Slug" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in "Slug" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Slug" should be equal "_@Slug@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_71 Verity that change the post's information by entering the valid data in "Mô tả" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_72 Verity that change the post's information by entering the valid data in "Mô tả" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_73 Verity that change the post's information by entering the valid data in "Nội dung" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  Then Data's information in "Nội dung" should be equal "_@Nội dung@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_74 Verity that change the post's information by entering the valid data in "Nội dung" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        News                      Valid
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  Then Data's information in "Nội dung" should be equal "_@Nội dung@_"
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_77 Verify the "Huỷ bỏ" button in the edit post's information page
  [Tags]                                                                                                EditInfo                        News                      Button
  ${Post}=                   Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Click "Huỷ bỏ" button
  Then "_@Tên Bài đăng@_" should not be visible in the table line
  When Click on the "Xóa Bài đăng ${Post}" button in the "${Post}" table line

PL_80 Verity that change the post's information by leaving the blank field in "Ngày tạo" field
  [Tags]                                                                                                EditInfo                        News                      BlankField
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on cross icon in select "Ngày tạo"
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng chọn ngày tạo" displayed under "Ngày tạo" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_82 Verity that change the post's information by leaving the blank field in "Tên Bài đăng" field
  [Tags]                                                                                                EditInfo                        News                      BlankField
  ${Post}=                 Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "${Post}" table line

PL_83 Verity that change the post's information by leaving the blank field in "Tên Bài đăng" field
  [Tags]                                                                                                EditInfo                        News                      BlankField
  ${Post}=                 Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "${Post}" table line

PL_84 Verity that change the post's information by leaving the blank field in "Slug" field (VIETNAM tab)
  [Tags]                                                                                                EditInfo                        News                      BlankField
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in "Slug" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập slug" displayed under "Slug" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_85 Verity that change the post's information by leaving the blank field in "Slug" field (Tiếng Anh tab)
  [Tags]                                                                                                EditInfo                        News                      BlankField
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in "Slug" with ""
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập slug" displayed under "Slug" field
  When Click "Huỷ bỏ" button
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_86 Verity that change the post's information by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                EditInfo                        News                      BlankField
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in textarea "Mô tả" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_87 Verity that change the post's information by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                EditInfo                        News                      BlankField
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in textarea "Mô tả" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_88 Verity that change the post's information by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                EditInfo                        News                      BlankField
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Việt" tab
  When Enter "text" in editor "Nội dung" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_89 Verity that change the post's information by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                EditInfo                        News                      BlankField
  Create a test post in "News" list
  When Click on the "Chỉnh sửa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  When Click on "Tiếng Anh" tab
  When Enter "text" in editor "Nội dung" with ""
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

### Verify that create the post ###
## Verify that create post page of "Projects" list ##
PL_90 Verify the UI of the creating post page in "Projects" list
  [Tags]                                                                                                Create                       Projects                      UI
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
  When Heading should contain "Thêm mới Bài đăng Projects" inner text
  When Webpage should contain "Ngày tạo" input field
  When Webpage should contain "Hình ảnh" image upload field
  When Webpage should contain "Tiếng Anh" tab
  When Webpage should contain "Tên Bài đăng" input field
  When Webpage should contain "Slug" input field
  When Webpage should contain "Mô tả" input field
  When Webpage should contain "Nội dung" input field
  When Webpage should contain "Lưu lại" button
  When Webpage should contain "Huỷ bỏ" button

PL_91 Verity that create the new post by entering the valid data
  [Tags]                                                                                                Create                       Projects                      Valid
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
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
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_92 Verity that create the new post by entering the valid data
  [Tags]                                                                                                Create                       Projects                      Invalid
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
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
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_93 Verify the "Huỷ bỏ" button in the create new post page
  [Tags]                                                                                                Create                       Projects                      Button
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
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
  When Click "Huỷ bỏ" button
  Then "_@Tên Bài đăng@_" should not be visible in the table line

PL_94 Verify the "Lưu lại" button in the create new post page
  [Tags]                                                                                                Create                       Projects                      Button
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
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
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_99 Verity that create the new post by leaving the blank field in "Tên Bài đăng" field
  [Tags]                                                                                                Create                       Projects                      BlankField
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Anh" tab
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field

PL_100 Verity that create the new post by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                Create                       Projects                      BlankField
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_101 Verity that create the new post by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                Create                       Projects                      BlankField
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_102 Verity that create the new post by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                Create                       Projects                      BlankField
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_103 Verity that create the new post by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                Create                       Projects                      BlankField
  Go to "Bài đăng" page with "Projects" list
  When Click "Thêm mới Bài đăng Projects" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

## Verify that create post page of "News" list ##
PL_104 Verify the UI of the creating post page in "News" list
  [Tags]                                                                                                Create                       News                      UI
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
  When Heading should contain "Thêm mới Bài đăng News" inner text
  When Webpage should contain "Ngày tạo" input field
  When Webpage should contain "Hình ảnh" image upload field
  When Webpage should contain "Tiếng Anh" tab
  When Webpage should contain "Tên Bài đăng" input field
  When Webpage should contain "Slug" input field
  When Webpage should contain "Mô tả" input field
  When Webpage should contain "Nội dung" input field
  When Webpage should contain "Lưu lại" button
  When Webpage should contain "Huỷ bỏ" button

PL_105 Verity that create the new post by entering the valid data
  [Tags]                                                                                                Create                       News                      Valid
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
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
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_106 Verity that create the new post by entering the valid data
  [Tags]                                                                                                Create                       News                      Invalid
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
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
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_107 Verify the "Huỷ bỏ" button in the create new post page
  [Tags]                                                                                                Create                       News                      Button
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
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
  When Click "Huỷ bỏ" button
  Then "_@Tên Bài đăng@_" should not be visible in the table line

PL_108 Verify the "Lưu lại" button in the create new post page
  [Tags]                                                                                                Create                       News                      Button
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
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
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_113 Verity that create the new post by leaving the blank field in "Name" field
  [Tags]                                                                                                Create                       News                      BlankField
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Anh" tab
  When Enter "text" in textarea "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Xin vui lòng nhập tên bài đăng" displayed under "Tên Bài đăng" field

PL_114 Verity that create the new post by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                Create                       News                      BlankField
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_115 Verity that create the new post by leaving the blank field in "Mô tả" field
  [Tags]                                                                                                Create                       News                      BlankField
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_116 Verity that create the new post by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                Create                       News                      BlankField
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_117 Verity that create the new post by leaving the blank field in "Nội dung" field
  [Tags]                                                                                                Create                       News                      BlankField
  Go to "Bài đăng" page with "News" list
  When Click "Thêm mới Bài đăng News" button
  When Click "date" in "Ngày tạo" with "today"
  When Click on "Tiếng Anh" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Click on "Tiếng Việt" tab
  When Enter "test name" in "Tên Bài đăng" with "_RANDOM_"
  When Enter "text" in "Mô tả" with "_RANDOM_"
  When Enter "text" in editor "Nội dung" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tạo thành công" popup
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

### Verify that delete post ###
PL_118 Verify the delete post function
  [Tags]                                                                                                Create                       Projects                      Delete
  Create a test post in "Projects" list
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then User look message "Xóa thành công" popup
  Then "_@Tên Bài đăng@_" should not be visible in the table line

PL_119 Verify the cancel action button when delete post
  [Tags]                                                                                                Create                       Projects                      Delete
  Create a test post in "Projects" list
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line with cancel
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

PL_120 Verify the delete post function
  [Tags]                                                                                                Create                       News                      Delete
  Create a test post in "News" list
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line
  Then User look message "Xóa thành công" popup
  Then "_@Tên Bài đăng@_" should not be visible in the table line

PL_121 Verify the cancel action button when delete post
  [Tags]                                                                                                Create                       News                      Delete
  Create a test post in "News" list
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line with cancel
  Then "_@Tên Bài đăng@_" should be visible in the table line
  When Click on the "Xóa Bài đăng _@Tên Bài đăng@_" button in the "_@Tên Bài đăng@_" table line

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
