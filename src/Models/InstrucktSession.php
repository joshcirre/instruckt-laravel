<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class InstrucktSession extends Model
{
    use HasUlids;

    protected $table = 'instruckt_sessions';

    protected $fillable = ['url', 'status'];

    protected $attributes = ['status' => 'active'];

    public function annotations(): HasMany
    {
        return $this->hasMany(InstrucktAnnotation::class, 'session_id');
    }

    public function pendingAnnotations(): HasMany
    {
        return $this->hasMany(InstrucktAnnotation::class, 'session_id')
            ->whereIn('status', ['pending', 'acknowledged'])
            ->oldest();
    }
}
