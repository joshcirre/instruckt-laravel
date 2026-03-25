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
            $table->string('id', 26)->primary(); // ULID
            $table->string('url');
            $table->float('x');
            $table->float('y');
            $table->text('comment')->default('');
            $table->string('element')->default('');
            $table->string('element_path')->default('');
            $table->string('css_classes')->nullable();
            $table->text('nearby_text')->nullable();
            $table->text('selected_text')->nullable();
            $table->json('bounding_box')->nullable();
            $table->string('screenshot')->nullable();
            $table->string('intent')->default('fix');
            $table->string('severity')->default('important');
            $table->string('status')->default('pending');
            $table->json('framework')->nullable();
            $table->json('thread')->nullable();
            $table->string('resolved_by')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instruckt_annotations');
    }
};
