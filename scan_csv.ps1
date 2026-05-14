$path = 'c:\Users\ADMIN\OneDrive\Desktop\collegepredictor\collegepredictorfrontend\IIT college 1st round cutoff - Sheet1.csv'
if (-not (Test-Path $path)) {
    Write-Host 'MISSING'
    exit 1
}
$rows = Import-Csv $path | Where-Object { $_.category -eq 'OBC-NCL' -and $_.gender -eq 'Gender-Neutral' -and $_.examType -eq 'JEE Advanced' }
Write-Host 'count' $rows.Count
foreach ($row in $rows) {
    Write-Host "ROW: $($row.name) | $($row.course) | $($row.quota) | $($row.category) | $($row.gender) | $($row.openingRank) | $($row.closingRank) | $($row.examType)"
}
$match = $false
function Norm([string]$x) {
    if ($x -match '^(\d+)P$') { return [int]$matches[1] }
    return [int]$x
}
foreach ($row in $rows) {
    $o = Norm($row.openingRank)
    $c = Norm($row.closingRank)
    if ($o -le 300 -and 300 -le $c) {
        Write-Host 'MATCH' "OPEN=$o CLOSE=$c" "ROW: $($row.name) | $($row.course)"
        $match = $true
        break
    }
}
if (-not $match) { Write-Host 'NO MATCH FOR 300' }
