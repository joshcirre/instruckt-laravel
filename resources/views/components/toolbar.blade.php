@if(config('instruckt.enabled', true))
<script src="{{ $scriptSrc }}" defer></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        Instruckt.init({
            endpoint: @json($endpoint),
            adapters: {!! $adapters !!},
            theme: @json($theme),
            position: @json($position),
        });
    });
</script>
@endif
