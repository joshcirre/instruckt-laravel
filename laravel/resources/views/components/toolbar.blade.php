@if(config('instruckt.enabled', true))
<div id="instruckt-root">
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

            var s = document.createElement('script');
            s.src = @json($scriptSrc);
            s.onload = boot;
            document.getElementById('instruckt-root').appendChild(s);
        })();
    </script>
</div>
@endif
