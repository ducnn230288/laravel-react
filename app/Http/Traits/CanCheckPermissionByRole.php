<?php

namespace App\Http\Traits;

use App\Http\Enums\Permissions;
use App\Models\Base\User;

trait CanCheckPermissionByRole
{
  public function checkPermission(Permissions $permission)
  {
    $role = auth()->user()->load(['role'])->role;
    if (!$role->is_system_admin && !in_array($permission->value, $role->permissions)) return abort(403, 'You are not authorized');
  }
}
