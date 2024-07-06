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
  public array $fullTextSearch = [];
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
    $this->filterByQueryFullTextSearch($for);
    $this->filterByQueryString($for);
    $this->filterByQueryStringContains($for);
    $this->filterByQueryArrayContains($for);
    $this->filterByQueryBetween($for);
    $this->extendByQueryString($for);
    $this->sortByQuery($for);
    $this->loadRelationships($for, $relations);
//    $for->ddRawSql();
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

  protected function filterByQueryFullTextSearch(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $value = \request()->query('fullTextSearch');
    if ($this->fullTextSearch && $value) {
      $for->where(function ($query) use ($value) {
        $array = [];
        foreach ($this->fullTextSearch as $key) {
          $keys = array_map('trim', explode('.', $key));
          if (count($keys) > 1) {
            $array[$keys[0]][] = $keys[1];
          } else {
            $query->orWhere(Str::snake($key), 'like', "%$value%");
          }
        }
        foreach ($array as $key => $names) {
          $query->whereHas(Str::snake($key), function ($q) use ($names, $value){
            foreach ($names as $name) {
              $q->where(Str::snake($name), 'like', "%$value%");
            }
          });
        }
      });
    }
    return $for;
  }

  protected function filterByQueryString(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $filters = ['select', 'like', 'in', 'between', 'sort', 'include','page','perPage','fullTextSearch', 'extend'];
    $queries = \request()->query();
    if ($queries) {
      $array = [];
      foreach ($queries as $key => $value) {
        if (!in_array($key, $filters)) {
          $keys = array_map('trim', explode('.', $key));
          if (count($keys) > 1) {
            $for->whereHas(Str::snake($keys[0]), function ($q) use ($value, $keys){
                $q->where(Str::snake($keys[1]), 'like', "%$value%");
            });
          } else {
            $for->where(Str::snake($key), $value);
          }
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
        $keys = array_map('trim', explode('.', $like[0]));
        if (count($keys) > 1) {
          $for->whereHas(Str::snake($keys[0]), function ($q) use ($like, $keys){
            $q->where(Str::snake($keys[1]), 'like', "%$like[1]%");
          });
        } else {
          $for->where(Str::snake($like[0]), 'like', "%$like[1]%");
        }
      }
    }
    return $for;
  }

  protected function extendByQueryString(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $extends = \request()->query('extend');
    if ($extends) {
      foreach ($extends as $extend) {
        $extend = array_map('trim', explode(',', $extend));
        $keys = array_map('trim', explode('.', $extend[0]));
        if (count($keys) > 1) {
          $for->whereHas(Str::snake($keys[0]), function ($q) use ($extend, $keys){
            $q->orWhere(Str::snake($keys[1]), $extend[1]);
          });
        } else {
          $for->orWhere(Str::snake($extend[0]), $extend[1]);
        }
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
        $keys = array_map('trim', explode('.', $in[0]));
        if (count($keys) > 1) {
          $for->whereHas(Str::snake($keys[0]), function ($q) use ($in, $keys){
            $q->whereIn(Str::snake($keys[1]), array_slice($in, 1));
          });
        } else {
          $for->whereIn(Str::snake($in[0]), array_slice($in, 1));
        }
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
        $keys = array_map('trim', explode('.', $between[0]));
        if (count($keys) > 1) {
          $for->whereHas(Str::snake($keys[0]), function ($q) use ($between, $keys){
            $q->whereBetween(Str::snake($keys[1]), array_slice($between, 1));
          });
        } else {
          $for->whereBetween(Str::snake($between[0]), array_slice($between, 1));
        }
      }
    }
    return $for;
  }


  protected function sortByQuery(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $sort = \request()->query('sort');
    if ($sort) {
      $sort = array_map('trim', explode(',', $sort));
      $keys = array_map('trim', explode('.', $sort[0]));
      if (count($keys) > 1) {
        $for->whereHas(Str::snake($keys[0]), function ($q) use ($sort, $keys){
          $q->orderBy(Str::snake($keys[1]), $sort[1]);
        });
      } else {
        $for->orderBy(Str::snake($sort[0]), $sort[1]);
      }
    } else {
      $for->orderBy('updated_at', 'desc');
    }
    return $for;
  }

}
