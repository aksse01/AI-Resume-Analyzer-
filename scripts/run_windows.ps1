$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $PSScriptRoot)

if (!(Test-Path "node_modules")) {
    npm install
}

npm run dev
