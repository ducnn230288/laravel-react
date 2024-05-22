<?php

namespace App\Http\Controllers;

use App\Http\Enums\EPermissions;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

abstract class Controller
{
  public array $relations = [];
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
  }  protected function shouldIncludeRelation(string $relation): bool
{
  $include = \request()->query('include');
  if (!$include) {
    return false;
  }
  $relations = array_map('trim', explode(',', $include));
  return in_array($relation, $relations);
}

  public function filter(Model|QueryBuilder|EloquentBuilder $for, ?array $relations = null) : Model|QueryBuilder|EloquentBuilder
  {
    $this->selectColumnsByQuery($for);
    $this->filterByQueryString($for);
    $this->filterByQueryStringContains($for);
    $this->filterByQueryArrayContains($for);
    $this->filterByQueryBetween($for);
    $this->sortByQuery($for);
    $this->loadRelationships($for, $relations);
    return $for;
  }

  protected function selectColumnsByQuery(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $select = \request()->query('select');
    if ($select) {
      $select = array_map(fn ($item) => Str::snake(trim($item)), explode(',', $select));
      $for->select(...$select);
    }
    return $for;
  }

  protected function filterByQueryString(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $filters = ['select', 'like', 'in', 'between', 'sort', 'include','page','perPage'];
    $queries = \request()->query();
    if ($queries) {
      foreach ($queries as $key => $value) {
        if (!in_array($key, $filters)) {
          $for->where(Str::snake($key), $value);
        }
      }
    }
    return $for;
  }

  protected function filterByQueryStringContains(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $likes = \request()->query('like');
    if ($likes) {
      foreach ($likes as $like) {
        $like = array_map('trim', explode(',', $like));
        $for->where(Str::snake($like[0]), 'like', "%$like[1]%");
      }
    }
    return $for;
  }

  protected function filterByQueryArrayContains(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $ins = \request()->query('in');
    if ($ins) {
      foreach ($ins as $in) {
        $in = array_map('trim', explode(',', $in));
        $for->whereIn(Str::snake($in[0]), array_slice($in, 1));
      }
    }
    return $for;
  }

  protected function filterByQueryBetween(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $betweenTwo = \request()->query('between');
    if ($betweenTwo) {
      foreach ($betweenTwo as $between) {
        $between = array_map('trim', explode(',', $between));
        $for->whereBetween(Str::snake($between[0]), array_slice($between, 1));
      }
    }
    return $for;
  }


  protected function sortByQuery(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $sort = \request()->query('sort');
    if ($sort) {
      $sort = array_map('trim', explode(',', $sort));
      $for->orderBy(Str::snake($sort[0]), $sort[1]);
    }
    return $for;
  }

}
