# scratch/kill_puppeteer_chrome.ps1
$processes = Get-Process -Name chrome -ErrorAction SilentlyContinue
foreach ($p in $processes) {
    try {
        $path = $p.Path
        if ($path -and $path.ToLower().Contains("puppeteer")) {
            Write-Host "Killing Puppeteer Chrome process: PID = $($p.Id), Path = $path"
            Stop-Process -Id $p.Id -Force
        }
    } catch {
        # Process path query might fail for some protected system processes, ignore
    }
}
