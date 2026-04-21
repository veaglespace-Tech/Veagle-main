$candidateHomes = [System.Collections.Generic.List[string]]::new()

function Add-CandidateHomes {
    param([string[]] $Homes)

    foreach ($candidate in $Homes) {
        if (-not [string]::IsNullOrWhiteSpace($candidate)) {
            [void] $candidateHomes.Add($candidate)
        }
    }
}

function Test-Java21Home {
    param([string] $JavaHome)

    if ([string]::IsNullOrWhiteSpace($JavaHome)) {
        return $false
    }

    $javaExe = Join-Path $JavaHome "bin\java.exe"
    $javacExe = Join-Path $JavaHome "bin\javac.exe"
    if (-not (Test-Path $javaExe) -or -not (Test-Path $javacExe)) {
        return $false
    }

    $versionOutput = & $javaExe -version 2>&1
    return ($versionOutput | Select-String -Pattern 'version "21(\.|")' -Quiet)
}

Add-CandidateHomes @(
    $env:JAVA_HOME
    "C:\Program Files\Eclipse Adoptium\jdk-21"
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
    (Join-Path $env:LocalAppData "Programs\Eclipse Adoptium\jdk-21")
)

foreach ($root in @(
    (Join-Path $env:LocalAppData "Programs\Eclipse Adoptium")
    "C:\Program Files\Eclipse Adoptium"
)) {
    if (Test-Path $root) {
        Add-CandidateHomes ((Get-ChildItem $root -Directory -Filter "jdk-21*" -ErrorAction SilentlyContinue).FullName)
    }
}

$jetBrainsRoot = "C:\Program Files\JetBrains"
if (Test-Path $jetBrainsRoot) {
    Add-CandidateHomes ((Get-ChildItem $jetBrainsRoot -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        Join-Path $_.FullName "jbr"
    }))
}

$javaCommand = Get-Command java -ErrorAction SilentlyContinue
if ($javaCommand) {
    Add-CandidateHomes ((Split-Path (Split-Path $javaCommand.Source -Parent) -Parent))
}

$javaHome = $candidateHomes | Select-Object -Unique | Where-Object { Test-Java21Home $_ } | Select-Object -First 1

if (-not $javaHome) {
    Write-Host "Java 21 could not be determined."
    Write-Host "Install JDK 21 or set JAVA_HOME to a valid Java 21 path, then re-run this command."
    exit 1
}

$env:JAVA_HOME = $javaHome
$jdkBin = Join-Path $env:JAVA_HOME "bin"

if (-not (($env:Path -split ";") -contains $jdkBin)) {
    $env:Path = "$jdkBin;$env:Path"
}

& "$PSScriptRoot\mvnw.cmd" @args
exit $LASTEXITCODE
