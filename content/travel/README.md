# 旅行画廊数据

`photos.json` 是旅行画廊（`/travel`）的数据源。构建时由 `src/lib/travel.ts` 读取。

## 数据格式

```json
{
  "trips": [
    {
      "id": "trip-2025-04-hangzhou",
      "title": "杭州春行",
      "startDate": "2025-04-12",
      "endDate": "2025-04-15",
      "description": "可选"
    }
  ],
  "photos": [
    {
      "id": "demo-001",
      "src": "https://your-rustfs-domain/travel/2025-04-hangzhou/xxx.jpg",
      "thumb": "https://your-rustfs-domain/travel/2025-04-hangzhou/xxx_thumb.jpg",
      "date": "2025-04-12",
      "city": "杭州",
      "province": "浙江省",
      "coords": [120.153, 30.287],
      "caption": "清晨的湖面",
      "trip": "trip-2025-04-hangzhou"
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `src` | 是 | 图片 URL（RustFS 上传后的地址） |
| `date` | 是 | 拍摄日期 `YYYY-MM-DD` |
| `city` | 是 | 城市名，如 `杭州` |
| `province` | 是 | 省份全称，须与地图区域名一致（如 `浙江省`、`西藏自治区`、`北京市`） |
| `id` | 否 | 唯一 id，缺省自动生成 |
| `thumb` | 否 | 缩略图 URL，缺省用 `src` |
| `coords` | 否 | `[经度, 纬度]`；城市在 `src/data/city-coords.ts` 已收录时可省略 |
| `caption` | 否 | 图片描述 |
| `trip` | 否 | 所属行程 id |

> 当前文件里是**示例数据**（Unsplash 占位图），发布真实照片前请整体替换。

## 上传照片到 RustFS

```bash
# 1. 在 .env.local 配置 RUSTFS_*（见 .env.local.example）
# 2. 上传一个目录
node scripts/upload-to-rustfs.js D:\photos\2025-04-hangzhou --prefix travel/2025-04-hangzhou
```

脚本会打印每张图片的 URL，复制到 `photos.json` 的 `src` 即可。
