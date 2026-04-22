$candidates = @()

if ($env:JAVA_HOME) {
    $candidates += $env:JAVA_HOME
}

$candidates += @(
    "C:\Program Files\Eclipse Adoptium\jdk-21",
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot",
    "C:\Program Files\JetBrains\PyCharm Community Edition 2024.3.4\jbr"
)

$resolvedJavaHome = $null

foreach ($candidate in $candidates | Select-Object -Unique) {
    if (-not $candidate) {
        continue
    }

    $javaExe = Join-Path $candidate "bin\java.exe"
    if (Test-Path $javaExe) {
        $resolvedJavaHome = $candidate
        break
    }
}

if (-not $resolvedJavaHome) {
    $javaOnPath = Get-Command java -ErrorAction SilentlyContinue
    if ($javaOnPath -and $javaOnPath.Source) {
        $resolvedJavaHome = Split-Path -Parent (Split-Path -Parent $javaOnPath.Source)
    }
}

if (-not $resolvedJavaHome) {
    Write-Error "JAVA_HOME could not be determined. Install JDK 21 and set JAVA_HOME, then re-run this command."
    exit 1
}

$env:JAVA_HOME = $resolvedJavaHome
$jdkBin = Join-Path $env:JAVA_HOME "bin"
$localRepo = Join-Path $PSScriptRoot ".m2\repository"

if (-not (($env:Path -split ";") -contains $jdkBin)) {
    $env:Path = "$jdkBin;$env:Path"
}

& "$PSScriptRoot\mvnw.cmd" "-Dmaven.repo.local=$localRepo" @args
exit $LASTEXITCODE
