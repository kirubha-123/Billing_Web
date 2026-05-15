# Requires admin privileges. Opens inbound firewall rule for port 3000 (TCP) temporarily.
# Usage: Right-click PowerShell -> Run as Administrator, then:
# .\scripts\open-port-3000.ps1

Param()

Write-Host "This script will add a firewall rule to allow inbound TCP on port 3000." -ForegroundColor Yellow
$ruleName = "Allow Node 3000 (temp)"
try {
    # Check if rule already exists
    $existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "Firewall rule already exists: $ruleName" -ForegroundColor Green
    } else {
        New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
        Write-Host "Firewall rule added: $ruleName" -ForegroundColor Green
    }
    Write-Host "To remove the rule later run:`nRemove-NetFirewallRule -DisplayName '$ruleName'" -ForegroundColor Cyan
} catch {
    Write-Error "Failed to modify firewall. Run this script as Administrator. Details: $_"
}
