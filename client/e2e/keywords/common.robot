*** Settings ***
Library                 Browser
Library                 FakerLibrary        locale=en_IN
Library                 String
Library                 DateTime

*** Variables ***
${BROWSER}              chromium
${HEADLESS}             %{HEADLESS=False}
${BROWSER_TIMEOUT}      %{BROWSER_TIMEOUT=40} seconds
${SHOULD_TIMEOUT}       0.1 seconds

${URL_DEFAULT}          %{HOST_ADDRESS=http://localhost:4000/}
${STATE}                Evaluate  json.loads("""{}""")  json

# Admin's default information #
${EMAIL_ADMIN}          admin@gmail.com
${PASSWORD_ADMIN}       Password1!

*** Keywords ***
Login to admin
  Enter "email" in "Tên đăng nhập" with "${EMAIL_ADMIN}"
  Enter "text" in "Mật khẩu" with "${PASSWORD_ADMIN}"
  Click "Đăng nhập" button
  User look message "Thành công" popup

#### Setup e Teardown
Setup
  Set Browser Timeout         ${BROWSER_TIMEOUT}
  New Browser                 ${BROWSER}  headless=${HEADLESS}
  New Page                    ${URL_DEFAULT}
  ${STATE}                    Evaluate  json.loads("""{}""")  json
Tear Down
  Close Browser               ALL

Wait Until Element Is Existent
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${BROWSER_TIMEOUT}
  Wait For Elements State   ${locator}  attached              ${timeout}                    ${message}

Wait Until Element Is Visible
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${BROWSER_TIMEOUT}
  Wait For Elements State   ${locator}  visible              ${timeout}                     ${message}

Wait Until Page Does Not Contain Element
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${BROWSER_TIMEOUT}
  Wait For Elements State   ${locator}  detached              ${timeout}                    ${message}

Element Should Be Exist
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${SHOULD_TIMEOUT}
  Wait For Elements State   ${locator}  attached              ${timeout}                    ${message}

Element Should Be Visible
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${SHOULD_TIMEOUT}
  Wait For Elements State   ${locator}  visible               ${timeout}                    ${message}

Element Text Should Be
  [Arguments]               ${locator}  ${expected}           ${message}=${EMPTY}           ${ignore_case}=${EMPTY}
  Get Text                  ${locator}  equal                 ${expected}                   ${message}

Element Should Not Be Visible
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${SHOULD_TIMEOUT}
  Wait For Elements State   ${locator}  hidden                ${timeout}                    ${message}

Check Text
  [Arguments]               ${text}
  ${containsS}=             Get Regexp Matches                ${text}                      _@(.+)@_                   1
  ${cntS}=                  Get length                        ${containsS}
  IF  ${cntS} > 0
    ${text}=                Replace String                    ${text}         _@${containsS[0]}@_     ${STATE["${containsS[0]}"]}
  END
  RETURN    ${text}

###  -----  Form  -----  ###
Get Random Text
  [Arguments]               ${type}                           ${text}
  ${symbol}                 Set Variable                      _RANDOM_
  ${new_text}               Set Variable
  ${containsS}=             Get Regexp Matches                ${text}                       _@(.+)@_                   1
  ${cntS}=                  Get length                        ${containsS}
  ${contains}=              Get Regexp Matches                ${text}                       ${symbol}
  ${cnt}=                   Get length                        ${contains}
  IF  ${cntS} > 0
    ${new_text}=            Set Variable                      ${STATE["${containsS[0]}"]}
    ${symbol}=              Set Variable                      _@${containsS[0]}@_
  ELSE IF  ${cnt} > 0 and "${type}" == "test name"
    ${random}=              FakerLibrary.Sentence             nb_words=3
    ${words}=               Split String                      ${TEST NAME}                  ${SPACE}
    ${new_text}=            Set Variable                      ${words[0]} ${random}
  ELSE IF  ${cnt} > 0 and "${type}" == "number"
    ${new_text}=            FakerLibrary.Random Int
    ${new_text}=            Convert To String                 ${new_text}
  ELSE IF  ${cnt} > 0 and "${type}" == "percentage"
    ${new_text}=            FakerLibrary.Random Int           max=100
    ${new_text}=            Convert To String                 ${new_text}
  ELSE IF  ${cnt} > 0 and "${type}" == "paragraph"
    ${new_text}=            FakerLibrary.Paragraph
  ELSE IF  ${cnt} > 0 and "${type}" == "email"
    ${new_text}=            FakerLibrary.Email
  ELSE IF  ${cnt} > 0 and "${type}" == "phone"
    ${new_text}=            FakerLibrary.Random Int           min=200000000                 max=999999999
    ${new_text}=            Convert To String                 ${new_text}
    ${new_text}=            Catenate                          SEPARATOR=                    0                           ${new_text}
  ELSE IF  ${cnt} > 0 and "${type}" == "color"
    ${new_text}=            FakerLibrary.Safe Hex Color
  ELSE IF  ${cnt} > 0 and "${type}" == "password"
    ${new_text}=            FakerLibrary.Password            10                             True                        True                          True                        True
  ELSE IF  ${cnt} > 0 and "${type}" == "date"
    ${new_text}=            FakerLibrary.Date  	              pattern=%d-%m-%Y
  ELSE IF  ${cnt} > 0 and "${type}" == "word"
    ${new_text}=            FakerLibrary.Sentence             nb_words=1
  ELSE IF  ${cnt} > 0 and "${type}" == "otp"
    ${new_text}=            FakerLibrary.Random Int           min=100000                    max=999999
    ${new_text}=            Convert To String                 ${new_text}
  ELSE IF  ${cnt} > 0
    ${new_text}=            FakerLibrary.Sentence
  END
    ${cnt}=                 Get Length                        ${text}
  IF  ${cnt} > 0
    ${text}=                Replace String                    ${text}                       ${symbol}                   ${new_text}
  END
  RETURN    ${text}

Get Element Form Item By Name
  [Arguments]               ${name}                           ${xpath}=${EMPTY}
  RETURN                  xpath=//*[contains(@class, "ant-form-item-label")]/label[text()="${name}"]/../../*[contains(@class, "ant-form-item")]${xpath}

Required message "${text}" displayed under "${name}" field
  ${text}=                  Check Text                        ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-form-item-explain-error")]
  Element Text Should Be    ${element}                        ${text}

Enter "${type}" in "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-input")]
  Click                     ${element}
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}                       True
  Fill Text               ${element}                        ${text}
  ${condition}=           Get Text                          ${element}
  Scroll To Element         ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

Enter "${type}" in editor "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class,"sun-editor-editable")]
  Click                     ${element}
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}                       True
  ${elementS}=              Get Element Form Item By Name     ${name}                       //*[contains(@class,"sun-editor-editable")]/*[contains(text(),"${text}")]
  Wait Until Element Is Existent                              ${elementS}
  Wait For Load State       domcontentloaded                  timeout=${BROWSER_TIMEOUT}
  Fill Text               ${element}                        ${text}
  ${condition}=           Get Text                          ${element}
  Scroll To Element         ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END
  Wait For Load State       domcontentloaded                  timeout=${BROWSER_TIMEOUT}

Enter "${type}" in textarea "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //textarea
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}
  Fill Text               ${element}                        ${text}
  ${condition}=           Get Text                          ${element}
  Scroll To Element         ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
  Set Global Variable       \${STATE["${name}"]}              ${text}
  END

Select file in "${name}" with "${text}"
  ${element}=               Get Element Form Item By Name     ${name}                       //input[@type = "file"]
  Upload File By Selector   ${element}                        e2e/upload/${text}
  Wait Until Element Spin

Get Element Table Item By Name
  [Arguments]               ${name}                           ${xpath}
  RETURN                  xpath=//*[contains(@class, "ant-table-row")]//*[(text()="${name}")]/ancestor::tr${xpath}

Click on the "${text}" button in the "${name}" table line
  Wait For Load State       domcontentloaded                  timeout=${BROWSER_TIMEOUT}
  Sleep                     0.1
  ${name}=                  Check Text                        ${name}
  ${text}=                  Check Text                        ${text}
  ${element}=               Get Element Table Item By Name    ${name}                       //button[@title = "${text}"]
  Click                     ${element}
  Click Confirm To Action

###  -----  Tree  -----  ###
Get Element Tree By Name
  [Arguments]               ${name}                           ${xpath}=${EMPTY}
  RETURN                    xpath=//*[contains(@class, "ant-tree-node-content-wrapper") and @title = "${name}"]//*[contains(@class, "group")]${xpath}

###  -----  Element  -----  ###
Click "${text}" button
  Wait Until Element Spin
  Click                     xpath=//button[@title = "${text}"]
  Scroll By                 ${None}
  Wait For Load State       domcontentloaded                  timeout=${BROWSER_TIMEOUT}

Select on the "${text}" item line
  Wait Until Element Spin
  ${element}=               Set Variable                      //*[@class="item" and contains(.,"${text}")]
  Click                     ${element}

Click "${name}" menu
  Click                     xpath=//aside//ul[contains(@class, "ant-menu")]//span[@class="ant-menu-title-content" and contains(text(), "${name}")]

Click "${name}" sub menu to "${url}"
  Wait For Load State       domcontentloaded                  timeout=${BROWSER_TIMEOUT}
  Click                     xpath=//aside//ul[contains(@class, "ant-menu")]//span[@class="ant-menu-title-content" and contains(text(), "${name}")]
  ${curent_url}=            Get Url
  Should Contain            ${curent_url}                     ${URL_DEFAULT}${url}

User look message "${message}" popup
  Wait For Load State       domcontentloaded                  timeout=${BROWSER_TIMEOUT}
  ${contains}=              Get Regexp Matches                ${message}                    _@(.+)@_                    1
  ${cnt}=                   Get length                        ${contains}
  IF  ${cnt} > 0
    ${message}=             Replace String                    ${message}                    _@${contains[0]}@_          ${STATE["${contains[0]}"]}
  END
  Element Text Should Be    xpath=//div[contains(@class, "ant-message-custom-content")]/span[text()="${message}"]           ${message}

Click Confirm To Action
  Wait Until Element Spin
  ${element}                Set Variable                      //*[contains(@class, "ant-popover")]//*[contains(@class, "ant-btn-primary")]
  ${count}=                 Get Element Count                 ${element}
  IF    ${count} > 0
    Click                   ${element}
    Wait Until Element Spin
  END

Wait Until Element Spin
  Wait For Load State       domcontentloaded                  timeout=${BROWSER_TIMEOUT}
  ${element}                Set Variable                      xpath=//*[contains(@class, "ant-spin-spinning")]
  ${count}=                 Get Element Count                 ${element}
  IF    ${count} > 0
    Wait Until Page Does Not Contain Element                  ${element}
  END

### ----- NEW ----- ###
Click on eye icon in "${name}" field
  Wait Until Element Spin
  ${element}=                Get Element                       //label[@title="${name}"]//ancestor::div[contains(@class,"ant-row")]//div[contains(@class,"relative")]//*[@id="Layer_1"]
  Click                      ${element}

Click on cross icon in input search box
  Click                      //input[contains(@id,"input_search")]//following-sibling::*[contains(@id,"Layer_1")]

The hidden password in "${name}" field should be visibled as "${text}"
  ${text}=                  Check Text                         ${text}
  ${element}=               Get Element                        //*[contains(@class, "ant-form-item-label")]/label[text()="${name}"]/../../*[contains(@class, "ant-form-item")]//input
  Get Property              ${element}                         type                       ==                             text
  Get Text                  ${element}                         equal                      ${text}

Click on "${name}" tab
  ${element}=               Set Variable                       //*[contains(@class,"ant-tabs")]//*[@role="tab" and text()="${name}"]
  Click                     ${element}

Click on cross icon in select "${name}"
  Wait Until Element Spin
  ${element}=               Get Element                       //*[contains(@class, "ant-form-item-label")]/label[text()="${name}"]//ancestor::div[contains(@class, "ant-row")][1]//span[contains(@class, "anticon-close-circle")]/*[1]
  Click                     ${element}

Click on cross icon inside image in "${name}"
  ${element}=               Get Element Form Item By Name     ${name}                       //button[contains(@class,"btn-delete")]
  Click                     ${element}
  Click Confirm To Action

Click Cancel Action
  ${element}                Set Variable                       xpath=//*[contains(@class, "ant-popover")]//button[1]
  ${count}=                 Get Element Count                  ${element}
  IF    ${count} > 0
    Click                   ${element}
    Wait For Load State     domcontentloaded                  timeout=${BROWSER_TIMEOUT}
  END

Click on the "${text}" button in the "${name}" table line with cancel
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  ${text}=                  Check Text                        ${text}
  ${element}=               Get Element Table Item By Name    ${name}                       //button[@title = "${text}"]
  Click                     ${element}
  Click Cancel Action

Click "${type}" in "${name}" with "${text}"
  IF    "${text}" == "today"
    ${text}=                Get Current Date                  local                         result_format=%d-%m-%Y
  ELSE IF    "${text}" == "yesterday"
    ${text}=                Get Current Date                  local                         -1 day                                     result_format=%d-%m-%Y
  ELSE
    ${text}=                Get Random Text                   ${type}                       ${text}
  END
  ${element}=               Get Element Form Item By Name     ${name}                       //input
  Click                     ${element}
  Wait Until Keyword Succeeds                                 ${SHOULD_TIMEOUT}             ${SHOULD_TIMEOUT}     Fill Text             ${element}                  ${text}                       True
  ${d_text}=                Get Regexp Matches                ${text}                       (.+)-(..)-            1
  ${m_text}=                Get Regexp Matches                ${text}                       (..)-(..)-            2
  ${y_text}=                Get Regexp Matches                ${text}                       (..)-(..)-(.+)        3
  ${after_text}=            Catenate                          SEPARATOR=-                   ${y_text[0]}          ${m_text[0]}          ${d_text[0]}
  Click With Options        //td[@title = "${after_text}"]/div    force=True
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
  Set Global Variable       ${STATE["${name}"]}               ${text}
  END

Data's information in "${name}" should be equal "${value}"
  Wait Until Element Spin
  ${value}=                 Check Text                         ${value}
  ${cnt}=                   Get Element Count                  //label[contains(@title,"${name}")]
  IF    ${cnt} > 0
    ${element}=             Set Variable                       //label[contains(@title,"${name}")]//ancestor::div[contains(@class,"ant-row")][1]//*[contains(@class,"sun-editor-editable")]
    ${cntS}=                Get Element Count                  ${element}
    IF    ${cntS} > 0
      Get Text              ${element}                         equal                       ${value}
    ELSE
      ${element}=           Set Variable                       //label[contains(@title,"${name}")]//ancestor::div[contains(@class,"ant-row")][1]//*[contains(@class,"ant-select-selection-item")]
      ${cnt2}=              Get Element Count                  ${element}
      IF    ${cnt2} > 0
        Get Text            ${element}                         equal                       ${value}
      ELSE
        ${element}=         Set Variable                       //label[contains(@title,"${name}")]//ancestor::div[contains(@class,"ant-row")][1]//*[contains(@class,"ant-picker-input")]/input
        ${cnt3}=            Get Element Count                  ${element}
        IF    ${cnt3} > 0
          Get Text            ${element}                       equal                       ${value}
        ELSE
          ${element}=       Set Variable                       //label[contains(@title,"${name}")]//ancestor::div[contains(@class,"ant-row")][1]//*[contains(@class,"ant-input")]
          Get Text          ${element}                         equal                       ${value}
        END
      END
    END
  END

"${name}" should be visible in the table line
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  ${element}=               Set Variable                       //tbody//tr[contains(@class,"ant-table-row")]//*[contains(text(),"${name}")]
  Wait Until Element Is Existent                               ${element}

"${name}" should not be visible in the table line
  ${name}=                  Check Text                         ${name}
  ${element}=               Set Variable                       //tbody//tr[contains(@class,"ant-table-row")]//*[contains(text(),"${name}")]
  Wait Until Page Does Not Contain Element                     ${element}

Get the image's information in "${name}" field
  Wait Until Element Spin
  ${name}=                  Check Text                        ${name}
  ${element}=               Get Element Form Item By Name     ${name}                       //a
  ${infor}=                 Get Attribute                     ${element}                    href
  RETURN                  ${infor}

### --- Check UI --- ###
Heading should contain "${text}" inner text
  ${text}=                  Check Text                        ${text}
  ${element}=               Set Variable                      //*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6][text()="${text}"]
  Wait Until Element Is Existent                              ${element}

Webpage should contain "${name}" input field
  ${element}=               Get Element                       (//label[@title="${name}"]//ancestor::div[contains(@class,"ant-row")][1]//div[@class="ant-form-item-control-input"])[1]
  ${count}=                 Get Element Count                 ${element}
  Should Be True            ${count} >= 1

Webpage should contain "${name}" button
  ${element}=               Set Variable                      //button[(text()="${name}")]
  ${cnt}=                   Get Element Count                 ${element}
  Should Be True            ${cnt} > 0

Webpage should contain "${name}" tab
  ${element}=               Set Variable                       //*[contains(@class,"ant-tabs")]//*[@role="tab" and text()="${name}"]
  Wait Until Element Is Existent                               ${element}

Webpage should contain "${name}" column with sort and search function
  Element Should Be Exist                   //th[@aria-label = "${name}"]
  ${count2}=                Get Element Count                   //th[@aria-label = "${name}"]//span[contains(@class,"ant-table-column-sorter")]
  Should Be True            ${count2} > 0
  ${count3}=                Get Element Count                   //th[@aria-label = "${name}"]//span[contains(@class,"ant-table-filter-trigger")]
  Should Be True            ${count3} > 0

Webpage should contain "${name}" image upload field
  Element Should Be Exist                                       //label[@title="${name}"]
  ${cnt}=                   Get Element Count                   //label[@title="${name}"]
  IF    ${cnt} > 0
    ${cntS}=                Get Element Count                   //label[@title="${name}"]//ancestor::div[contains(@class,"ant-form-item")]//input[@type="file"]
    Should Be True          ${cntS} > 0
  END

Webpage should contain "${name}" group
  ${element}=               Set Variable                        //h3[text() = "${name}"]//ancestor::div[contains(@class,"left")]
  Element Should Be Exist                                       ${element}

Webpage should contain the list data from database
  ${count}=                 Get Element Count                   //div[contains(@class,"container")]
  Should Be True            ${count} >= 1

Webpage should contain the search function
  ${element}=               Set Variable                        //*[contains(@id,"input_search")]
  Element Should Be Exist                                       ${element}

The status button in the "${name}" table line should change to "${text}"
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  ${text}=                  Check Text                         ${text}
  ${element}=               Get Element                        //tbody//*[contains(text(),"${name}")]//ancestor::tr//button[1]
  ${content}=               Get Property                       ${element}                           title                   equal                ${text}

Confirm locating exactly in "${name}" page of "${menu}" menu
  Wait Until Element Spin
  ${element}=               Set Variable                       //main//div[contains(@class, "breadcrumbs")]//li[text()="${menu}"]
  Wait Until Element Is Existent                               ${element}
  ${cnt}=                   Get Element Count                  //main//*[text()="${name}"]
  Should Be True            ${cnt} == 2
