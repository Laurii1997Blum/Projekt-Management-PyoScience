/* Startklar – Standalone-Adapter
 * Stellt die Plattform-Funktionen (Speicher, Dateien, Downloads) lokal im Browser bereit.
 * Alle Daten liegen in IndexedDB auf diesem Gerät. Die App baut keine Verbindung zu fremden Servern auf. */
(function () {
  'use strict';
  window.__standalone = true;
  window.__libBase = 'lib/';
  const DBN = 'startklar', DBV = 1;
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DBN, DBV);
      r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('docs')) d.createObjectStore('docs', { keyPath: 'k' }); if (!d.objectStoreNames.contains('blobs')) d.createObjectStore('blobs', { keyPath: 'id' }); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  const tx = async (store, mode, fn) => { const d = await open(); return new Promise((res, rej) => { const t = d.transaction(store, mode); const s = t.objectStore(store); let out; Promise.resolve(fn(s)).then(v => { out = v; }); t.oncomplete = () => res(out && out.result !== undefined && out instanceof IDBRequest ? out.result : out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error || new Error('abort')); }); };
  const req = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const all = async store => { const d = await open(); return req(d.transaction(store).objectStore(store).getAll()); };
  const get = async (store, k) => { const d = await open(); return req(d.transaction(store).objectStore(store).get(k)); };
  const put = (store, v) => tx(store, 'readwrite', s => { s.put(v); });
  const del = (store, k) => tx(store, 'readwrite', s => { s.delete(k); });

  /* db: kleine Teilmenge der Dokumenten-API */
  function query(path, where, lim) {
    return {
      where: (f, op, v) => query(path, where.concat([[f, op, v]]), lim),
      limit: n => query(path, where, n),
      orderBy() { return this; },
      async get() {
        const pre = path + '/';
        const rows = (await all('docs')).filter(r => r.k.startsWith(pre) && !r.k.slice(pre.length).includes('/'))
          .filter(r => where.every(([f, op, v]) => op === '==' ? r.d[f] === v : op === '!=' ? r.d[f] !== v : true))
          .slice(0, lim || 1000)
          .map(r => ({ id: r.k.slice(pre.length), exists: true, data: () => r.d }));
        return { docs: rows, size: rows.length, empty: !rows.length };
      },
      doc(id) {
        const k = path + '/' + id;
        return {
          id,
          async get() { const r = await get('docs', k); return { id, exists: !!r, data: () => r && r.d }; },
          async set(d) { await put('docs', { k, d: JSON.parse(JSON.stringify(d)) }); },
          async update(d) { const r = await get('docs', k); await put('docs', { k, d: Object.assign((r && r.d) || {}, JSON.parse(JSON.stringify(d))) }); },
          async delete() { await del('docs', k); }
        };
      }
    };
  }
  const db = { collection: p => query(p, [], 0), doc: p => { const i = p.lastIndexOf('/'); return query(p.slice(0, i), [], 0).doc(p.slice(i + 1)); } };

  /* assets: Dateien als Blobs in IndexedDB */
  const urls = {};
  const hex = () => [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
  const assets = {
    async upload(blob, o = {}) {
      const id = hex(); const type = o.type || blob.type || 'application/octet-stream';
      const b = blob.type === type ? blob : new Blob([blob], { type });
      await put('blobs', { id, blob: b, type, size: b.size, ts: Date.now() });
      urls[id] = URL.createObjectURL(b);
      return { id, url: urls[id], sizeBytes: b.size, contentType: type };
    },
    async list() {
      const rows = await all('blobs'); let quota = 0;
      try { quota = (await navigator.storage.estimate()).quota || 0; } catch {}
      return { assets: rows.map(r => ({ id: r.id, sizeBytes: r.size, contentType: r.type })), usage: { bytes: rows.reduce((s, r) => s + r.size, 0), maxBytes: quota, files: rows.length } };
    },
    async delete(id) { await del('blobs', id); if (urls[id]) { URL.revokeObjectURL(urls[id]); delete urls[id]; } }
  };
  window.__blobUrl = id => urls[id] || '';
  window.__getBlob = async id => { const r = await get('blobs', id); return r ? r.blob : null; };

  /* downloads: normaler Browser-Download */
  const downloads = {
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: /\.json$/i.test(filename) ? 'application/json' : 'text/plain;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.append(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
      return { ok: true };
    }
  };

  const user = { id: async () => 'local', me: async () => ({ id: 'local', name: '' }), profiles: async () => ({}), isOwner: () => true, canEdit: () => true, can: () => true };

  const ready = (async () => {
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch {}
    try { (await all('blobs')).forEach(r => { urls[r.id] = URL.createObjectURL(r.blob); }); } catch (e) { console.warn('IndexedDB nicht verfügbar', e); }
  })();

  window.claude = {
    async use(name) {
      await ready;
      if (name === 'db') return db;
      if (name === 'user') return user;
      if (name === 'assets') return assets;
      if (name === 'downloads') return downloads;
      return null;
    }
  };
})();
