# Builds the backend using the Eclipse-bundled JDK 21 and dependencies already in ~/.m2
# Run from the Backend directory.

$ErrorActionPreference = 'Stop'

$jdkBin = "$env:USERPROFILE\.p2\pool\plugins\org.eclipse.justj.openjdk.hotspot.jre.full.win32.x86_64_21.0.11.v20260515-1531\jre\bin"
$javac = Join-Path $jdkBin 'javac.exe'
$java = Join-Path $jdkBin 'java.exe'

if (-not (Test-Path $javac)) { throw "javac not found at $javac" }

$backendDir = $PSScriptRoot
$srcDir = Join-Path $backendDir 'src\main\java'
$resourcesDir = Join-Path $backendDir 'src\main\resources'
$classesDir = Join-Path $backendDir 'target\classes'

# Clean target/classes of our app classes only (leave META-INF maven metadata)
$appClasses = Join-Path $classesDir 'com\printeddimensions'
if (Test-Path $appClasses) { Remove-Item $appClasses -Recurse -Force }
# Also wipe any leftover classes from the old com.forge3d package
$oldClasses = Join-Path $classesDir 'com\forge3d'
if (Test-Path $oldClasses) { Remove-Item $oldClasses -Recurse -Force }
New-Item -ItemType Directory -Force -Path $classesDir | Out-Null

# Build classpath from all jars in .m2 (excluding sources/javadoc)
$m2 = "$env:USERPROFILE\.m2\repository"
$jars = Get-ChildItem $m2 -Recurse -Filter '*.jar' -File |
    Where-Object { $_.Name -notlike '*-sources.jar' -and $_.Name -notlike '*-javadoc.jar' } |
    Select-Object -ExpandProperty FullName
$classpath = ($jars -join ';')

# Compile all .java files
$javaFiles = Get-ChildItem $srcDir -Recurse -Filter '*.java' | Select-Object -ExpandProperty FullName
$argFile = Join-Path $env:TEMP "printeddimensions-javac-args.txt"
Set-Content -Path $argFile -Value $javaFiles -Encoding ASCII

Write-Output "Compiling $($javaFiles.Count) Java files..."
& $javac -d $classesDir -cp $classpath "@$argFile"
if ($LASTEXITCODE -ne 0) { throw "Compilation failed (exit $LASTEXITCODE)" }
Write-Output "Compile OK."

# Copy resources
Copy-Item -Path (Join-Path $resourcesDir '*') -Destination $classesDir -Recurse -Force

# Run
$runCp = "$classesDir;$classpath"
Write-Output "Starting BackendApplication on port 8080..."
& $java -cp $runCp 'com.printeddimensions.backend.BackendApplication'
