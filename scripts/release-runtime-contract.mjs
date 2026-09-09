export const runtimeContractEntry = name => `.netlify-runtime-contracts/${name}.json`;

export function runtimeContractBytes(fn) {
  if (!/^[a-zA-Z0-9_-]+$/.test(fn.name || '') || fn.runtime !== 'js' || !/^nodejs\d+\.x$/.test(fn.runtimeVersion || '') ||
      fn.buildData?.runtimeAPIVersion !== 2 || !['stream', 'background'].includes(fn.invocationMode) ||
      !/^\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?$/.test(fn.buildData.bootstrapVersion || '') ||
      (fn.timeout !== undefined && (!Number.isSafeInteger(fn.timeout) || fn.timeout <= 0))) throw Error('Invalid prepared runtime contract');
  return Buffer.from(`${JSON.stringify({ schema_version: 1, runtime: fn.runtimeVersion, runtime_api_version: fn.buildData.runtimeAPIVersion,
    invocation_mode: fn.invocationMode, timeout: fn.timeout ?? null, bootstrap_version: fn.buildData.bootstrapVersion })}\n`);
}

// Read only the small contract member. Never extract or execute archive contents.
export function verifyRuntimeContractArchive(archive, entryName, expected, openZip) {
  return new Promise((resolve, reject) => openZip(archive, { lazyEntries: true }, (error, zip) => {
    if (error) { reject(error); return; }
    let found = false, stopped = false;
    const fail = error => { if (!stopped) { stopped = true; zip.close(); reject(error); } };
    zip.on('error', fail);
    zip.on('end', () => {
      if (stopped) return;
      if (!found) { fail(Error('Prepared ZIP is missing its runtime contract')); return; }
      stopped = true;
      resolve();
    });
    zip.on('entry', entry => {
      if (entry.fileName !== entryName) { zip.readEntry(); return; }
      if (found || entry.uncompressedSize !== expected.length) { fail(Error('Prepared ZIP runtime contract changed')); return; }
      found = true;
      zip.openReadStream(entry, (error, stream) => {
        if (error) { fail(error); return; }
        const chunks = [];
        stream.on('error', fail);
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => {
          if (!Buffer.concat(chunks).equals(expected)) { fail(Error('Prepared ZIP runtime contract changed')); return; }
          zip.readEntry();
        });
      });
    });
    zip.readEntry();
  }));
}
