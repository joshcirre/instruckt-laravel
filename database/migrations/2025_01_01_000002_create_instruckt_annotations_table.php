<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instruckt_annotations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('session_id')
                ->constrained('instruckt_sessions')
                ->cascadeOnDelete();

            // Position
            $table->float('x');     // % of viewport width
            $table->float('y');     // px from top (scroll-adjusted)

            // Content
            $table->text('comment');
            $table->string('element');        // human-readable element name
            $table->text('element_path');     // CSS selector
            $table->text('css_classes')->nullable();
            $table->text('nearby_text')->nullable();
            $table->text('selected_text')->nullable();
            $table->json('bounding_box')->nullable();

            // Workflow
            $table->string('intent')->default('fix');       // fix | change | question | approve
            $table->string('severity')->default('important'); // blocking | important | suggestion
            $table->string('status')->default('pending');   // pending | acknowledged | resolved | dismissed

            // Framework context (Livewire, Vue, Svelte, etc.)
            $table->json('framework')->nullable();

            // Agent thread — array of { id, role, content, timestamp }
            $table->json('thread')->nullable();

            // Resolution
            $table->string('resolved_by')->nullable(); // human | agent
            $table->timestamp('resolved_at')->nullable();

            $table->string('url');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instruckt_annotations');
    }
};
