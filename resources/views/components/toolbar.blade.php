@if(config('instruckt.enabled', true))
<div id="instruckt-root">
    <script src="{{ $scriptSrc }}" defer></script>
    <script>
        (function() {
            function boot() {
                if (window.__instruckt) return;
                if (typeof Instruckt === 'undefined') return;
                window.__instruckt = Instruckt.init({
                    endpoint: @json($endpoint),
                    adapters: {!! $adapters !!},
                    theme: @json($theme),
                    position: @json($position),
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', boot);
            } else {
                boot();
            }
        })();
    </script>
</div>
@endif
