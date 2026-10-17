// Dev only: runs server + client, and serves both on one port.
// /api/* -> server, everything else (incl. live-reload websocket) -> client.
const http = require("http");
const net = require("net");
const { spawn } = require("child_process");

const PORT = 3000;
const CLIENT_PORT = 3001;
const SERVER_PORT = 8000;

const run = (dir, script, env) =>
  spawn("npm", ["run", script], { cwd: `${__dirname}/${dir}`, env: { ...process.env, ...env }, stdio: "inherit", detached: true });
const children = [run(".", "server:dev", { PORT: SERVER_PORT }), run("client", "dev", { PORT: CLIENT_PORT })];

const stop = () => {
  children.forEach((child) => {
    try {
      process.kill(-child.pid); // whole process group
    } catch {}
  });
  process.exit();
};
["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => process.on(signal, stop));
children.forEach((child) => child.on("exit", stop));

const target = (url) => (url.startsWith("/api") ? SERVER_PORT : CLIENT_PORT);

const proxy = http.createServer((req, res) => {
  const upstream = http.request({ port: target(req.url), path: req.url, method: req.method, headers: req.headers }, (up) => {
    res.writeHead(up.statusCode, up.headers);
    up.pipe(res);
  });
  upstream.on("error", () => res.writeHead(502).end(`port ${target(req.url)} is not ready`));
  req.pipe(upstream);
});

proxy.on("upgrade", (req, socket, head) => {
  const upstream = net.connect(target(req.url), () => {
    const headers = Object.entries(req.headers)
      .map(([k, v]) => `${k}: ${v}\r\n`)
      .join("");
    upstream.write(`${req.method} ${req.url} HTTP/1.1\r\n${headers}\r\n`);
    upstream.write(head);
    upstream.pipe(socket).pipe(upstream);
  });
  upstream.on("error", () => socket.destroy());
  socket.on("error", () => upstream.destroy());
});

proxy.listen(PORT, () => console.log(`Dev proxy on http://localhost:${PORT}`));
