@echo off
REM Supabase CLI command shortcuts

IF "%1"=="" (
  echo Supabase CLI Shortcuts
  echo ---------------------
  echo Usage: supabase-commands.bat [command]
  echo.
  echo Available commands:
  echo   dump-schema    - Dump database schema
  echo   dump-data      - Dump database data
  echo   status         - Check Supabase status
  echo   help           - Show this help message
  echo.
  exit /b
)

IF "%1"=="dump-schema" (
  powershell -ExecutionPolicy Bypass -File setup-supabase-credentials.ps1 -Command "Run-SupabaseCommand -Command 'db dump --schema public'"
  exit /b
)

IF "%1"=="dump-data" (
  powershell -ExecutionPolicy Bypass -File setup-supabase-credentials.ps1 -Command "Run-SupabaseCommand -Command 'db dump --data-only --schema public'"
  exit /b
)

IF "%1"=="status" (
  npx supabase status
  exit /b
)

IF "%1"=="help" (
  echo Supabase CLI Shortcuts
  echo ---------------------
  echo Usage: supabase-commands.bat [command]
  echo.
  echo Available commands:
  echo   dump-schema    - Dump database schema
  echo   dump-data      - Dump database data
  echo   status         - Check Supabase status
  echo   help           - Show this help message
  echo.
  exit /b
)

echo Unknown command: %1
echo Run 'supabase-commands.bat help' for usage information.
