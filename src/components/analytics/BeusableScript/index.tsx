import Script from 'next/script';

export function BeusableScript() {
  if (process.env.NODE_ENV !== 'production') return null;

  const beusableId = process.env.NEXT_PUBLIC_BEUSABLE_ID;
  if (!beusableId) return null;

  const beusableRumLoader = `(function(w, d, a){w.beusablerumclient = {load:function(src){var b = d.createElement("script");b.src = src;b.async = true;b.type = "text/javascript";d.getElementsByTagName("head")[0].appendChild(b);}};w.beusablerumclient.load(a + "?url=" + encodeURIComponent(d.URL));})(window, document, "//rum.beusable.net/load/${beusableId}");`;

  return (
    <Script id='beusable-rum' strategy='afterInteractive' dangerouslySetInnerHTML={{ __html: beusableRumLoader }} />
  );
}
