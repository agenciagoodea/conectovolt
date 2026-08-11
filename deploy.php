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

function requiredEnv($name) {
    $value = getenv($name);
    if ($value === false || trim($value) === '') {
        throw new RuntimeException("Missing required environment variable: $name");
    }
    return $value;
}

$repo = '/root/conectovolt';
$backend = "$repo/backend";
$frontend = "$repo/frontend";

// Clone or pull
if (!is_dir($repo)) {
    run("cd /root && git clone https://github.com/agenciagoodea/conectovolt.git");
} else {
    run("cd $repo && git pull origin master");
}

// Setup .env using secrets injected by the hosting environment.
$databaseUrl = requiredEnv('DATABASE_URL');
$jwtSecret = requiredEnv('JWT_SECRET');
$jwtRefreshSecret = requiredEnv('JWT_REFRESH_SECRET');
$corsOrigin = requiredEnv('CORS_ORIGIN');
$env = implode("\n", [
    'NODE_ENV=production',
    'PORT=3000',
    'HOST=0.0.0.0',
    'DB_PROVIDER=mysql',
    'DATABASE_URL="' . addcslashes($databaseUrl, "\\\"") . '"',
    'JWT_SECRET=' . $jwtSecret,
    'JWT_REFRESH_SECRET=' . $jwtRefreshSecret,
    'JWT_EXPIRATION=15m',
    'JWT_REFRESH_EXPIRATION=7d',
    'OCPP_PORT=3001',
    'CORS_ORIGIN=' . $corsOrigin,
    '',
]);
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
run("pkill -f 'node dist/src/main.js' 2>/dev/null; sleep 1");
run("cd $backend && nohup node dist/src/main.js > /root/conectovolt/api.log 2>&1 &");

// Check health
sleep(5);
run("curl -s http://localhost:3000/api/v1/health");

$output[] = "\n=== DEPLOY COMPLETO ===";
echo implode("\n", $output);
