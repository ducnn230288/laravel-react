<?php

namespace App\Http\Controllers;

use App\Http\Enums\EPermissions;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;

abstract class Controller
{
  public array $relations = [];
  public function checkPermission(EPermissions $ePermission)
  {
    $role = auth()->user()->load(['role'])->role;
    if (!$role || (!$role->is_system_admin && !in_array($ePermission->value, $role->permissions))) return abort(403, 'You are not authorized');
  }

  public function loadRelationships(
    Model|QueryBuilder|EloquentBuilder $for, ?array $relations = null
  ) : Model|QueryBuilder|EloquentBuilder
  {
    $relations = $relations ?? $this->relations ?? [];
    foreach ($relations as $relation) {
      $for->when($this->shouldIncludeRelation($relation),
        fn($q) => $for instanceof Model ? $for->load($relation) : $q->with($relation)
      );
    }
    return $for;
  }

  protected function shouldIncludeRelation(string $relation): bool
  {
    $include = \request()->query('include');
    if (!$include) return false;
    $relations = array_map('trim', explode(',', $include));
    return in_array($relation, $relations);
  }
}
