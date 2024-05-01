<?php

namespace App\Http\Enums;

use App\Http\Traits\EnumToArray;

enum Permissions: string
{
  use EnumToArray;
  case P_USER_INDEX = 'ac0c4f13-776d-4b71-be4d-f9952734a319';
  case P_USER_STORE = '41c9d4e1-ba5a-4850-ad52-35ac928a61d9';
  case P_USER_SHOW = 'a9de3f3d-4c04-4f50-9d1b-c3c2e2eca6dc';
  case P_USER_UPDATE = 'bc0b5f32-ddf7-4c61-b435-384fc5ac7574';
  case P_USER_DESTROY = 'b82e6224-12c3-4e6c-b4e0-62495fb799bf';

  case P_USER_ROLE_INDEX = '8f559613-ef55-4ef0-8068-8c37e84b75de';
  case P_USER_ROLE_STORE = 'f6732943-cb1d-484b-8644-7740a295e3e3';
  case P_USER_ROLE_SHOW = '35ea86b5-e591-4819-9c41-4d35ed580d0b';
  case P_USER_ROLE_UPDATE = '3e8aa2c2-35bf-4a56-8bf2-8f8de240e24c';
  case P_USER_ROLE_DESTROY = '62fd3bc2-0921-4113-9b5b-9966dd5a0517';

  case P_CODE_INDEX = '5d808d76-bf99-4a51-b4b6-d5aa37bdb398';
  case P_CODE_STORE = 'a9574d5e-269d-44f9-a5bb-41cf06d7bdda';
  case P_CODE_SHOW = 'eb510a79-4f75-4b14-a118-f036c1daa430';
  case P_CODE_UPDATE = '6d34b679-9c0e-489a-a2de-a17e37fadf72';
  case P_CODE_DESTROY = 'e21ac25b-1651-443e-9834-e593789807c9';

  case P_CODE_TYPE_INDEX = '2a71d57d-7c2d-49ad-a7e9-3cd4aace132f';
  case P_CODE_TYPE_STORE = '45f014c0-9ebe-497e-9766-2054ebb7e1d5';
  case P_CODE_TYPE_SHOW = '7af26c77-e81f-4875-89df-9d4c2fa3ce52';
  case P_CODE_TYPE_UPDATE = 'fdb47b79-1a6e-49be-8f5b-8525a547534a';
  case P_CODE_TYPE_DESTROY = 'f16e2bc7-12b9-446e-b53b-a2597ca0ad3a';

}
