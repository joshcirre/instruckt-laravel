<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class InstrucktAnnotation extends Model
{
    use HasUlids;

    protected $table = 'instruckt_annotations';

    protected $fillable = [
        'session_id', 'x', 'y', 'comment', 'element', 'element_path',
        'css_classes', 'nearby_text', 'selected_text', 'bounding_box',
        'intent', 'severity', 'status', 'framework', 'thread',
        'resolved_by', 'resolved_at', 'url',
    ];

    protected $attributes = [
        'intent' => 'fix',
        'severity' => 'important',
        'status' => 'pending',
    ];

    public function casts(): array
    {
        return [
            'x' => 'float',
            'y' => 'float',
            'bounding_box' => 'array',
            'framework' => 'array',
            'thread' => 'array',
            'resolved_at' => 'datetime',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(InstrucktSession::class, 'session_id');
    }

    /** Append a message to the annotation thread */
    public function addThreadMessage(string $role, string $content): void
    {
        $thread = $this->thread ?? [];
        $thread[] = [
            'id' => (string) \Illuminate\Support\Str::ulid(),
            'role' => $role,
            'content' => $content,
            'timestamp' => now()->toIso8601String(),
        ];
        $this->thread = $thread;
        $this->save();
    }
}
