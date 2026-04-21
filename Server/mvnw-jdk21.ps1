$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
$jdkBin = Join-Path $env:JAVA_HOME "bin"

if (-not (($env:Path -split ";") -contains $jdkBin)) {
    $env:Path = "$jdkBin;$env:Path"
}

& "$PSScriptRoot\mvnw.cmd" @args
exit $LASTEXITCODE
