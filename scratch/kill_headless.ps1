# scratch/kill_headless.ps1
Get-CimInstance Win32_Process -Filter "Name = 'chrome.exe'" | Where-Object { $_.CommandLine -like "*headless*" } | ForEach-Object {
    Write-Host "Terminating headless Chrome process with PID: $($_.ProcessId)"
    Stop-Process -Id $_.ProcessId -Force
}
