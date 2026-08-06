<?php
set_time_limit(600);
$output = [];
$output[] = "<pre>ConectoVolt - Deploy Script\n";

function run($cmd) {
    global $output;
    $output[] = "\n> $cmd";
    exec("$cmd 2>&1", $lines, $code);
    $output[] = implode("\n", $lines);
    $output[] = "Exit: $code";
}

$repo = '/home/kryontecnologic/conectovolt';
$backend = "$repo/backend";
$frontend = "$repo/frontend";

// Clone or pull
if (!is_dir($repo)) {
    run("cd /home/kryontecnologic && git clone https://github.com/agenciagoodea/conectovolt.git");
} else {
    run("cd $repo && git pull origin master");
}

// Setup .env
$env = "NODE_ENV=production\nPORT=3000\nDB_PROVIDER=mysql\nDATABASE_URL=\"mysql://kryontecnologic_root:ZQ(~{Y?9de&;DqYA@localhost:3306/kryontecnologic_conectovolt\"\nJWT_SECRET=conectovolt-jwt-secret-production-2026\nJWT_REFRESH_SECRET=conectovolt-refresh-secret-production-2026\nJWT_EXPIRATION=15m\nJWT_REFRESH_EXPIRATION=7d\nOCPP_PORT=3001\nCORS_ORIGIN=*\n";
file_put_contents("$backend/.env", $env);
$output[] = "\n.env configurado";

// Backend - Install & Build
run("cd $backend && npm install");
run("cd $backend && npx prisma generate --schema=prisma/schema.mysql.prisma");
run("cd $backend && npx prisma db push --schema=prisma/schema.mysql.prisma");
run("cd $backend && npm run build");

// Frontend - Install & Build (com API URL correta)
run("cd $frontend && npm install");
run("cd $frontend && NEXT_PUBLIC_API_URL=/api/v1 npm run build");

// Kill existing backend and restart
run("pkill -f 'node dist/main.js' 2>/dev/null; sleep 1");
run("cd $backend && nohup node dist/main.js > /home/kryontecnologic/conectovolt/api.log 2>&1 &");

// Check health
sleep(5);
run("curl -s http://localhost:3000/api/v1/health");

$output[] = "\n=== DEPLOY COMPLETO ===";
echo implode("\n", $output);
