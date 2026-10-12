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
| `group` | 否 | "同景"分组 id；同组照片折叠为一张展示（详见下方说明） |
| `solo` | 否 | `true` 表示单独展示，绝不参与连拍/同景折叠（人像等） |

## 连拍 / 同景折叠

高速连拍和同景多拍会在画廊里"感官重复"，构建时由 `src/lib/travel-burst.ts` 自动折叠成一张代表图（不删数据，灯箱里仍可左右翻看每一帧）：

1. **相机连拍自动折叠**：id 为相机帧号（如 `dkx05241`）的图片，按 `日期|城市|行程|相机序列` 分组，帧号连续（差 ≤ 2）的视为同一段连拍，保留中间帧作为代表，其余帧挂在 `burst` 字段上；网格上显示 `×N` 角标。
2. **显式同景分组**：手动命名的系列（如 `lz13`、`ck04`）没有帧号，改用 `group` 字段声明——同 `group` 的图片按列表顺序折叠，第一张作为代表。例如黄河日落连拍可标 `"group": "lz-sunset-city"`。
3. **solo 例外**：标 `"solo": true` 的照片（如人像）永不折叠，每张单独出现在网格里。

灯箱内可用 ←/→ 在组内翻帧，文案显示"连拍 x / y"（帧号连拍）或"同景 x / y"（显式分组）。

> 当前照片为 2026-10 青甘大环线实拍数据。

## 上传照片到 RustFS

```bash
# 1. 在 .env.local 配置 RUSTFS_*（见 .env.local.example）
# 2. 上传一个目录
node scripts/upload-to-rustfs.js D:\photos\2025-04-hangzhou --prefix travel/2025-04-hangzhou
```

脚本会打印每张图片的 URL，复制到 `photos.json` 的 `src` 即可。

> **⚠️ 旋转坑**：预处理（缩放/缩略图）前务必先按 EXIF Orientation 转正像素（如 Python `ImageOps.exif_transpose`），并剥掉 EXIF。否则竖拍照片会横躺着存进对象存储，且没有 EXIF 可供浏览器纠正（曾导致 `LZ12` 横躺，需旋转后重传并同步 `width`/`height`）。
