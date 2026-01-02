$imgDir = "D:\lemonArticle\lemonBlog\public\articles\2025-07-21-sony-a6700-guide\img"
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

$urls = @()
for($i=1; $i -le 10; $i++) {
    for($j=1; $j -le 10; $j++) {
        $urls += "https://gotovlog.com/blog/assets/images/setup/a6700/$i-$j.jpg"
    }
}

$count = 0
foreach($url in $urls) {
    try {
        $filename = Split-Path $url -Leaf
        $output = Join-Path $imgDir $filename
        Invoke-WebRequest -Uri $url -OutFile $output -ErrorAction Stop
        $count++
        Write-Host "Downloaded: $filename"
    } catch {
        Write-Host "Failed: $url"
    }
}

Write-Host "Total downloaded: $count images"
